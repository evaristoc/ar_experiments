/// <reference types="@argonjs/argon" />
/// <reference types="three" />
/// <reference types="stats" />

// add a field to Object3D
declare namespace THREE {
    export interface Object3D {
        entity: Argon.Cesium.Entity;
    }
}

// any time we use an INERTIAL frame in Cesium, it needs to know where to find it's
// ASSET folder on the web.  The SunMoonLights computation uses INERTIAL frames, so
// so we need to put the assets on the web and point Cesium at them
var CESIUM_BASE_URL='../resources/cesium/';

// grab some handles on APIs we use
const Cesium = Argon.Cesium;
const Cartesian3 = Argon.Cesium.Cartesian3;
const ReferenceFrame = Argon.Cesium.ReferenceFrame;
const JulianDate = Argon.Cesium.JulianDate;
const CesiumMath = Argon.Cesium.CesiumMath;

// set up Argon
const app = Argon.init();

// this app uses geoposed content, so subscribe to geolocation updates
app.context.subscribeGeolocation({enableHighAccuracy: true});

// install a secondary reality that the user can select from on the desktop
app.reality.install(Argon.resolveURL('../streetview-reality/index.html'));

// We use the standard WebGLRenderer when we only need WebGL-based content
const renderer = new THREE.WebGLRenderer({
    alpha: true,
    logarithmicDepthBuffer: true,
    antialias: Argon.suggestedWebGLContextAntialiasAttribute
});

// account for the pixel density of the device
renderer.setPixelRatio(window.devicePixelRatio);
renderer.sortObjects = false;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;

// to easily control stuff on the display
const hud = new (<any>THREE).CSS3DArgonHUD();

// We put some elements in the index.html, for convenience.
// Here, we retrieve the description box and move it to the
// the CSS3DArgonHUD hudElements[0].  We only put it in the left
// hud since we'll be hiding it in stereo
var crosshair = document.getElementById( 'crosshair-wrapper' );
hud.appendChild(crosshair);

var hudContainer = document.getElementById( 'hud' );
hud.hudElements[0].appendChild(hudContainer);

var description = document.getElementById( 'description' );
hud.hudElements[0].appendChild(description);

// add layers to the view
app.view.setLayers([
    {source: renderer.domElement},
    {source: hud.domElement}
])


// add a performance stats thing to the display
var stats = new Stats();
hud.hudElements[0].appendChild(stats.dom);

// Add button event listener.  Toggle better interaction style.
var isCrosshair = true;

var button = document.getElementById( 'controls' );
button.addEventListener( 'click', function ( event ) {
    if (isCrosshair) {
        button.innerText = "Click to switch to crosshair selection";
        isCrosshair = false;
        crosshair.setAttribute('class', 'crosshair hide-crosshair')
    } else {
        button.innerText = "Click to switch to touch selection";
        isCrosshair = true;
        crosshair.setAttribute('class', 'crosshair show-crosshair')
    }
    // clear any highlight
    if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
    INTERSECTED = null;

}, false );

// set up the scene, a perspective camera and objects for the user's location and the boxes
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera();
const user = new THREE.Object3D;
const boxScene = new THREE.Object3D;
scene.add(camera);
scene.add(user);
scene.add(boxScene);

// an entity for the collection of boxes, which are rooted to the world together
const boxSceneEntity = new Argon.Cesium.Entity({
        name: "box scene",
        position: Cartesian3.ZERO,
        orientation: Cesium.Quaternion.IDENTITY
});

// In this example, we are using the actual position of the sun and moon to create lights.
// The SunMoonLights functions are created by ArgonSunMoon.js, and turn on the sun or moon
// when they are above the horizon.  This package could be improved a lot (such as by
// adjusting the color of light based on distance above horizon, taking the phase of the
// moon into account, etc) but it provides a simple starting point.
const sunMoonLights = new (<any>THREE).SunMoonLights();
// the SunMoonLights.update routine will add/remove the sun/moon lights depending on if
// the sun/moon are above the horizon
scene.add( sunMoonLights.lights );

// make the sun cast shadows
sunMoonLights.sun.castShadow = true;
sunMoonLights.sun.shadow = new THREE.LightShadow( new THREE.PerspectiveCamera( 50, 1, 200, 10000 ) );
sunMoonLights.sun.shadow.bias = - 0.00022;
sunMoonLights.sun.shadow.mapSize.width = 2048;
sunMoonLights.sun.shadow.mapSize.height = 2048;

// add some ambient so things aren't so harshly illuminated
var ambientlight = new THREE.AmbientLight( 0x404040 ); // soft white ambient light
scene.add(ambientlight);

/////////////////////////
// application variables.  This code started out as the three.js draggablecubes example
var objects = [];
var plane = new THREE.Plane();
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var offset = new THREE.Vector3();
var intersection = new THREE.Vector3();
var tempPos = new THREE.Vector3();
var INTERSECTED, SELECTED;
var touchID;  // which touch caused the selection?

// need to keep track of if we've located the box scene at all, and if it's locked to the world
var boxInit = false;
var geoLocked = false;

// set up 50 cubes, each with its own entity
var geometry = new THREE.BoxGeometry( 1, 1, 1 );
for ( var i = 0; i < 50; i ++ ) {
    const object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );

    object.position.x = Math.random() * 50 - 25;
    object.position.y = Math.random() * 10 + 1;
    object.position.z = Math.random() * 50 - 25;

    object.rotation.x = Math.random() * 2 * Math.PI;
    object.rotation.y = Math.random() * 2 * Math.PI;
    object.rotation.z = Math.random() * 2 * Math.PI;

    object.scale.x = Math.random() * 3 + 1;
    object.scale.y = Math.random() * 3 + 1;
    object.scale.z = Math.random() * 3 + 1;

    object.castShadow = true;
    object.receiveShadow = true;

    boxScene.add( object );

    objects.push( object );
}

document.addEventListener('keydown', onDocumentKeyStart, false);
document.addEventListener('keyup', onDocumentKeyEnd, false);

function onDocumentKeyStart(event) {
    console.log("keyboard press");
    if (event.defaultPrevented) {
        return; // Should do nothing if the key event was already consumed.
    }
    if (event instanceof KeyboardEvent) {
        if (!SELECTED && event.keyCode == " ".charCodeAt(0)) {
            if (isCrosshair) {
                mouse.x = mouse.y = 0;

                if(handleSelection()) {
                    event.preventDefault();
                }
            }
        }
    }
}

function onDocumentKeyEnd(event) {
    console.log("keyboard release");
    if (event.defaultPrevented) {
        return; // Should do nothing if the key event was already consumed.
    }
    if (event instanceof KeyboardEvent) {
        if (event.keyCode == " ".charCodeAt(0)) {
            if (SELECTED && isCrosshair) {
                if(handleRelease()) {
                    event.preventDefault();
                }
            }
        }
    }
}

app.view.uiEvent.addEventListener((evt: any) => {
    var event = evt.event;

    if (event.defaultPrevented) {
        console.log ("event was consumed");
        console.log (event);
        evt.forwardEvent();
        return; // Should do nothing if the key event was already consumed.
    }

    // handle mouse movement
    var ti, tx, ty;

    switch (event.type) {
        case "touchmove":
            if ((<any>window).PointerEvent) {
                evt.forwardEvent();
                return; // ignore duplicate events
            }
            //console.log ("touch move: ");
            //console.log(event);
            event.preventDefault();
            for (ti=0; ti < event.changedTouches.length; ti++) {
                //console.log("changedTouches[" + i + "].identifier = " + e.changedTouches[i].identifier);
                if (event.changedTouches[ti].identifier == touchID)
                  break;
            }
            // if we didn't find a move for the first touch, skip
            if (ti == event.changedTouches.length) {
                evt.forwardEvent();
                return;
            }

        case "pointermove":
        case "mousemove":
            // if crosshair interaction, mousemove passed on
            if (isCrosshair) {
                evt.forwardEvent();
                return;
            }

            if (event.type == "touchmove") {
                tx = event.changedTouches[ti].clientX;
                ty = event.changedTouches[ti].clientY;
            } else {
                tx = event.clientX;
                ty = event.clientY;
            }
            var x = ( tx / window.innerWidth ) * 2 - 1;
            var y = - ( ty / window.innerHeight ) * 2 + 1;

            if (SELECTED) {
                mouse.x = x;
                mouse.y = y;
                raycaster.setFromCamera( mouse, camera );

                // recompute the plane each time, in case the camera moved
                var worldLoc = user.localToWorld(tempPos.copy(SELECTED.position));
                plane.setFromNormalAndCoplanarPoint(
                        camera.getWorldDirection( plane.normal ),
                    //user.getWorldDirection( new THREE.Vector3(0,0,1) ),
                    worldLoc );

                if ( raycaster.ray.intersectPlane( plane, intersection ) ) {
                    // planes, rays and intersections are in the local "world" 3D coordinates
                    var ptInWorld = user.worldToLocal(intersection).sub( offset );
                    SELECTED.position.copy( ptInWorld );
                    // SELECTED.entity.position.setValue(SELECTED.position, app.context.user);
                }
            } else {
                handlePointerMove(x,y);
                evt.forwardEvent();
            }
            return;

      case "touchstart":
            if ((<any>window).PointerEvent) {
                evt.forwardEvent();
                return; // ignore duplicate events
            }
            console.log ("touch start: ");
            console.log(event);
            event.preventDefault();

            // try the first new touch ... seems unlikely there will be TWO new touches
            // at exactly the same time
            ti = 0;

        case 'pointerdown':
        case 'mousedown':
            // ignore additional touches or pointer down events after the first selection
            if (SELECTED) {
                // perhaps multitouch devices can do a second pointer down ... need
                // to keep track of which pointer event, I suppose!
                evt.forwardEvent();
                return;
            }

            if (isCrosshair) {
                if (event.type == "mousedown") {
                    // ignore mouse down events for selection in crosshair mode, they must
                    // use the keyboard
                    console.log("mousedown ignored")
                    evt.forwardEvent();
                    return;
                }
                mouse.x = mouse.y = 0;
            } else {
                if (event.type == "touchstart") {
                    tx = event.changedTouches[ti].clientX;
                    ty = event.changedTouches[ti].clientY;
                } else {
                    tx = event.clientX;
                    ty = event.clientY;
                }

                mouse.x = ( tx / window.innerWidth ) * 2 - 1;
                mouse.y = - ( ty / window.innerHeight ) * 2 + 1;
            }
            console.log("mousedown")


            if(handleSelection()) {
                if (event.type == "touchstart") {
                    touchID = event.changedTouches[ti].identifier;
                }
                if (event.type == "touchstart" || event.type == "pointerdown") {
                    if (!isCrosshair) {
                        if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
                        INTERSECTED = SELECTED;
                        INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
                        INTERSECTED.material.color.setHex(0xffff33);
                    }
                }
            } else {
                evt.forwardEvent();
            }
            break;

        case "touchend":
            if ((<any>window).PointerEvent) {
                evt.forwardEvent();
                return; // ignore duplicate events
            }
            console.log("touch end: ");
            console.log(event);
            event.preventDefault();
            for (ti=0; ti < event.changedTouches.length; ti++) {
                //console.log("changedTouches[" + i + "].identifier = " + e.changedTouches[i].identifier);
                if (event.changedTouches[ti].identifier == touchID)
                  break;
            }
            // if we didn't find a move for the first touch, skip
            if (ti == event.changedTouches.length) {
                evt.forwardEvent();
                return;
            }

        case 'pointerup':
        case 'mouseup':

            if (isCrosshair && event.type == "mouseup") {
                // ignore mouse up events for selection in crosshair mode, they must
                // use the keyboard
                console.log("release ignored")
                evt.forwardEvent();
                return;
            }
            console.log("release")

            if ( SELECTED ) {
                if (handleRelease()) {
                    if ((event.type == "touchend" || event.type == "pointerup") && !isCrosshair) {
                        if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
                        INTERSECTED = null;
                    }
                }
            } else {
                evt.forwardEvent();
            }
            break;

        default:
            evt.forwardEvent();
    }

    //console.log(event);

});

function handleRelease() : boolean {
    var date = app.context.getTime();

    
    THREE.SceneUtils.detach(SELECTED, user, scene);
    THREE.SceneUtils.attach(SELECTED, scene, boxScene);
    SELECTED = null;
    touchID = null;
    
    // var boxPose = app.context.getEntityPose(SELECTED.entity);
    // console.log("------");
    // console.log("touch released, pos=" + boxPose.position);
    // console.log("touch released, quat=" + boxPose.orientation);
    // console.log("touch released _value pos=" + SELECTED.entity.position._value)
    // console.log("touch released _value quat=" + SELECTED.entity.orientation._value)
    // console.log("------");

    // var boxPose = app.context.getEntityPose(SELECTED.entity, boxSceneEntity);
    // SELECTED.position.copy(boxPose.position);
    // SELECTED.quaternion.copy(boxPose.orientation);

    // user.remove(SELECTED);
    // boxScene.add(SELECTED);

    return true;
}

function handleSelection() : boolean {
    scene.updateMatrixWorld(true);
    raycaster.setFromCamera( mouse, camera );
    console.log("touch!")

    var intersects = raycaster.intersectObjects( objects );
    if ( intersects.length > 0 ) {
        console.log("touch intersect!")
        var object = intersects[ 0 ].object;
        var date = app.context.getTime();

        const defaultFrame = app.context.getDefaultReferenceFrame();

        console.log("------");
        console.log("touch FIXED pos=" + JSON.stringify(object.position))
        console.log("touch FIXED quat=" + JSON.stringify(object.quaternion))

        THREE.SceneUtils.detach(object, boxScene, scene);
        THREE.SceneUtils.attach(object, scene, user);

        // var newpose = app.context.getEntityPose(object.entity);
        // console.log("touch DEVICE pos=" + newpose.position);
        // console.log("touch DEVICE quat=" + newpose.orientation)
        // console.log("touch DEVICE _value pos=" + object.entity.position._value);
        // console.log("touch DEVICE _value quat=" + object.entity.orientation._value)
        // console.log("------");

        SELECTED = object;

        // console.log("touch DEVICE pos=" + boxPose.position);
        // console.log("touch DEVICE quat=" + boxPose.orientation)
        // console.log("touch DEVICE _value pos=" + (object.entity.position as any)._value);
        // console.log("touch DEVICE _value quat=" + (object.entity.orientation as any)._value)
        // console.log("------");

        if (!isCrosshair) {
            var worldLoc = user.localToWorld(tempPos.copy(SELECTED.position));
            plane.setFromNormalAndCoplanarPoint(
                    camera.getWorldDirection( plane.normal ),
                    worldLoc );
            if ( raycaster.ray.intersectPlane( plane, intersection ) ) {
                //offset.copy( user.worldToLocal(( intersection ).sub( worldLoc )));
                offset.copy( user.worldToLocal(intersection).sub(SELECTED.position));
            }
        }
        return true;
    }
    return false;
}

function handlePointerMove(x,y) {
    if ( SELECTED ) {
        return;
    }

    mouse.x = x;
    mouse.y = y;
    scene.updateMatrixWorld(true);
    raycaster.setFromCamera( mouse, camera );

    var intersects = raycaster.intersectObjects( objects );
    if ( intersects.length > 0 ) {
        if ( INTERSECTED != intersects[ 0 ].object ) {
            if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );

            INTERSECTED = intersects[ 0 ].object;
            INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
            INTERSECTED.material.color.setHex(0xffff33);
        }
    } else {
        if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
        INTERSECTED = null;
    }
}

// since these don't move, we only update them when the origin changes
app.context.originChangeEvent.addEventListener(() => {
    if (boxInit) {
        console.log("**** new frame of reference");
        var boxPose = app.context.getEntityPose(boxSceneEntity);
        boxScene.position.copy(<any>boxPose.position);
        boxScene.quaternion.copy(<any>boxPose.orientation);
    }
});

// check if the reality has a geopose
app.reality.changeEvent.addEventListener((data) => {
    console.log("Reality changed from '" + data.previous + "' to '" + data.current)
});

// the updateEvent is called each time the 3D world should be
// rendered, before the renderEvent.  The state of your application
// should be updated here.
app.updateEvent.addEventListener((frame) => {
    // get the position and orientation (the "pose") of the user
    // in the local coordinate frame.
    const userPose = app.context.getEntityPose(app.context.user);

    // assuming we know the user's pose, set the pose of our
    // THREE user object to match it
    if (userPose.poseStatus & Argon.PoseStatus.KNOWN) {
        user.position.copy(<any>userPose.position);
        user.quaternion.copy(<any>userPose.orientation);
    } else {
        return;
    }

    // get sun and moon positions, add/remove lights as necessary
    const defaultFrame = app.context.getDefaultReferenceFrame();
	sunMoonLights.update(frame.time, defaultFrame);

    // the first time through, we create a geospatial position for
    // the box scene somewhere near us.  If we don't have geospatial tracking,
    // we end up positioning the box scene around our starting point
    if (!boxInit) {
        // set the pose of it's entity to the user pose in our local frame of refererence
        (boxSceneEntity.position as Argon.Cesium.ConstantPositionProperty).setValue(userPose.position, defaultFrame);
        (boxSceneEntity.orientation as Argon.Cesium.ConstantProperty).setValue(userPose.orientation);
        boxInit = true;
        geoLocked = false;

        // we'll start by moving the boxes to the stage coordinates, which we should have and should
        // be a good local coordinate system for any device
        if (!Argon.convertEntityReferenceFrame(boxSceneEntity, frame.time, app.context.stage)) {
            console.log("UNEXPECTED:  can't convert boxScene to STAGE coordinates.")
        }
    }

    // if we were using geo coordinates, but can't any longer, recenter the scene on the user
    if (geoLocked) {
        // are the user and FIXED frames connected?
        var userPoseFIXED = app.context.getEntityPose(app.context.user, ReferenceFrame.FIXED);
        if (!(userPoseFIXED.poseStatus & Argon.PoseStatus.KNOWN)) {
            // we'll start by moving the boxes to the stage coordinates, which we should have and should
            // be a good local coordinate system for any device
            (boxSceneEntity.position as Argon.Cesium.ConstantPositionProperty).setValue(userPose.position, defaultFrame);
            (boxSceneEntity.orientation as Argon.Cesium.ConstantProperty).setValue(userPose.orientation);
            geoLocked = false;

            if (Argon.convertEntityReferenceFrame(boxSceneEntity, frame.time, app.context.stage)) {
                console.log("No longer have geospatial coordinates, moved boxes back to stage");
            } else {
                console.log("No longer have geospatial coordinates, but FAILED to move boxes back to stage");
            }
        }
    } else {
        // can the current box scene reach the FIXED frame?
        var boxPoseFIXED = app.context.getEntityPose(boxSceneEntity, ReferenceFrame.FIXED);

        if (boxPoseFIXED.poseStatus & Argon.PoseStatus.KNOWN) {
            // now convert the entity from our local reference frame to world coordinates if we can
            if (Argon.convertEntityReferenceFrame(boxSceneEntity, frame.time, ReferenceFrame.FIXED)) {
                geoLocked = true;
                console.log("Successfully positioned the boxes in the world");
                // yay!  We're going to continue, either way, since we need it positioned somewhere!
            }
        }
    }

    // In 6DOF realities, scale down the boxes
    boxScene.scale.setScalar(app.context.userTracking === '6DOF' ? 0.1 : 1);

    // get the pose of the boxscene in local coordinates, only need to do this when we
    // set it or when the origin changes (see above)
    var boxPose = app.context.getEntityPose(boxSceneEntity);
    boxScene.position.copy(<any>boxPose.position);
    boxScene.quaternion.copy(<any>boxPose.orientation);


    if (isCrosshair) {
        handlePointerMove(0,0);
    }
});

// renderEvent is fired whenever argon wants the app to update its display
app.renderEvent.addEventListener((frame) => {
    // if we have 1 subView, we're in mono mode.  If more, stereo.
    var monoMode = (app.view.subviews).length == 1;

    if (!monoMode) {
        button.style.display = 'none'; 
    } else {
        button.style.display = 'inline-block'; 
    }
    // set the renderer to know the current size of the viewport.
    // This is the full size of the viewport, which would include
    // both views if we are in stereo viewing mode
    const view = app.view;
    renderer.setSize(view.renderWidth, view.renderHeight, false);  
    renderer.setPixelRatio(app.suggestedPixelRatio);  

    const viewport = view.viewport;
    hud.setSize(viewport.width, viewport.height);

    // there is 1 subview in monocular mode, 2 in stereo mode
    for (let subview of app.view.subviews) {
        // set the position and orientation of the camera for
        // this subview
        camera.position.copy(<any>subview.pose.position);
        camera.quaternion.copy(<any>subview.pose.orientation);
        // the underlying system provide a full projection matrix
        // for the camera.
        camera.projectionMatrix.fromArray(<any>subview.frustum.projectionMatrix);

        // set the viewport for this view
        var {x,y,width,height} = subview.renderViewport;
        renderer.setViewport(x,y,width,height);

        // set the webGL rendering parameters and render this view
        renderer.setScissor(x,y,width,height);
        renderer.setScissorTest(true);
        renderer.render(scene, camera);

        // adjust the hud, but only in mono
  //      if (monoMode) {
            var {x,y,width,height} = subview.viewport;
            hud.setViewport(x,y,width,height, subview.index);
            hud.render(subview.index);
    //    }
    }
    stats.update();

})
