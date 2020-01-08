/// <reference types="@argonjs/argon" />
/// <reference types="three" />
/// <reference types="stats" />
// any time we use an INERTIAL frame in Cesium, it needs to know where to find it's
// ASSET folder on the web.  The SunMoonLights computation uses INERTIAL frames, so
// so we need to put the assets on the web and point Cesium at them
var CESIUM_BASE_URL = '../resources/cesium/';
// grab some handles on APIs we use
var Cesium = Argon.Cesium;
var Cartesian3 = Argon.Cesium.Cartesian3;
var ReferenceFrame = Argon.Cesium.ReferenceFrame;
var JulianDate = Argon.Cesium.JulianDate;
var CesiumMath = Argon.Cesium.CesiumMath;
// set up Argon
var app = Argon.init();
// this app uses geoposed content, so subscribe to geolocation updates
app.context.subscribeGeolocation({ enableHighAccuracy: true });
// install a secondary reality that the user can select from on the desktop
app.reality.install(Argon.resolveURL('../streetview-reality/index.html'));
// We use the standard WebGLRenderer when we only need WebGL-based content
var renderer = new THREE.WebGLRenderer({
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
var hud = new THREE.CSS3DArgonHUD();
// We put some elements in the index.html, for convenience.
// Here, we retrieve the description box and move it to the
// the CSS3DArgonHUD hudElements[0].  We only put it in the left
// hud since we'll be hiding it in stereo
var hudContainer = document.getElementById('hud');
console.log(hudContainer);
hud.hudElements[0].appendChild(hudContainer);
// add layers to the view
app.view.setLayers([
    { source: renderer.domElement },
    { source: hud.domElement }
]);
// add a performance stats thing to the display
var stats = new Stats();
hud.hudElements[0].appendChild(stats.dom);

// set up the scene, a perspective camera and objects for the user's location and the boxes
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera();
var stage = new THREE.Object3D;
var boxScene = new THREE.Object3D;
scene.add(camera);
scene.add(stage);
scene.add(boxScene);
// an entity for the collection of boxes, which are rooted to the world together
var boxSceneEntity = new Argon.Cesium.Entity({
    name: "box scene",
    position: Cartesian3.ZERO,
    orientation: Cesium.Quaternion.IDENTITY
});

var ambientlight = new THREE.AmbientLight(0xf0f0f0); // soft white ambient light
scene.add(ambientlight);
/////////////////////////
// application variables.  This code started out as the three.js draggablecubes example
var objects = [];
var targets = [];
var move = [];
var plane = new THREE.Plane();
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var offset = new THREE.Vector3();
var intersection = new THREE.Vector3();
var tempPos = new THREE.Vector3();
var INTERSECTED, SELECTED;
var touchID; // which touch caused the selection?
//// need to keep track of if we've located the box scene at all, and if it's locked to the world
//var boxInit = false;
//var geoLocked = false;

var sphs = 10;

var sounds_srcs = ['358232_j_s_song.ogg', 'merel_vogelbescherming.mp3', 'Project_Utopia.ogg'];
var sounds = [];
var listener = new THREE.AudioListener();
camera.add(listener);
var audioloader = new THREE.AudioLoader();
//for (var i=0; i<sounds_srcs.length;i++) {
//    //code
//    var sound = new THREE.PositionalAudio( listener );
//    audioloader.load( '../../../public/sounds/'+sounds_srcs[i], function( buffer ) {
//        sound.setBuffer( buffer );
//        sound.setRefDistance( 20 );
//        sound.play();
//        //sounds.push(sound);
//    });
//}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

var soundLoadfunc = function(object, sound){
    audioloader.load( '../../../public/sounds/'+sounds_srcs[getRndInteger(0, 3)], function( buffer ) {
        sound.setLoop(true);
        sound.setVolume(.5);
        sound.setBuffer( buffer );
        sound.setRefDistance( 2 );
        sound.play();
        object.add(sound);
    });  
}


var remainingSpheres = document.getElementById('remainingSpheres');
hud.hudElements[0].appendChild(remainingSpheres);
remainingSpheres.setAttribute('style', "color:brown; position:fixed; right:10px; top:10px;");
remainingSpheres.innerHTML = `${sphs} spheres remaining`;

// center of Spheres
var geometry = new THREE.SphereGeometry(3);
var material = new THREE.MeshBasicMaterial({ color: 'black' })
// Shader
var customMaterial = new THREE.ShaderMaterial( 
	{
	    uniforms: 
		{ 
			"c":   { type: "f", value: 1.0 },
			"p":   { type: "f", value: .5 },
			glowColor: { 
    type: "c",
    //value: new THREE.Color(0xffff00)
    value: new THREE.Color('')
   },
			viewVector: { type: "v3", value: camera.position }
		},
		vertexShader:   document.getElementById( 'vertexShader'   ).textContent,
		fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
		side: THREE.FrontSide,
		blending: THREE.AdditiveBlending,
		transparent: true
	}   );
		
	//this.moonGlow = new THREE.Mesh( sphereGeom.clone(), customMaterial.clone() );


    //moonGlow.position.set(0,0,-150); //cloning not working??
	//moonGlow.scale.multiplyScalar(1.3);
	//scene.add( moonGlow );



for (var i = 0; i < sphs; i++) {
    //var group = new THREE.Group();
    //var object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff }));
    var object = new THREE.Mesh(geometry, material);    
    var moonGlow = new THREE.Mesh( geometry.clone(), customMaterial.clone() );
    //object.add(moonGlow);
    object.position.x = Math.random() * 50 - 25;
    object.position.y = Math.random() * 10 + 1;
    object.position.z = Math.random() * 50 - 25;
    (function(object){
        var sound = new THREE.PositionalAudio( listener );
        soundLoadfunc(object,sound);
        sounds.push(sound)
    })(object)
    boxScene.add(object);
    //boxScene.add(moonGlow);
    objects.push(object);
    move.push(true);
}

spherePosHELPER();

transformHELPER( targets, 1000 );

/******************
 * HELPERS
*****************/

function  spherePosHELPER(){
      var vector = stage.position; //World coordinates to be looked at
      var phi, theta;
  
      for ( var i = 0; i < objects.length; i ++ ) {
        //E: TEMPORARY HACK!!
        // target is giving undefined at some point...
        if (target !== undefined && move[i] === false) {
            target.position.x = target.position.x;
            target.position.y = target.position.y;
            target.position.z = target.position.z;
        }else{
            phi = Math.acos(Math.random()*(Math.random() >= .5? 1:-1))
            theta = Math.sqrt( objects.length * Math.PI ) * phi; //(Math.sqr of totalItems*PI) angle
            var target = new THREE.Object3D();
            target.position.x = 80 * Math.cos( theta ) * Math.sin( phi );
            target.position.y = 80 * Math.sin( theta ) * Math.sin( phi );
            target.position.z = 80 * Math.cos( phi );
        }
        target.lookAt( vector );
        targets[i] = target;

      }
}

function transformHELPER( targets, duration ) {
  TWEEN.removeAll();
    for ( var i = 0; i < objects.length; i ++ ) {
      if (move[i] === false) {
        continue
      }
      var object = objects[ i ];
      var target = targets[ i ];
      var pos = new TWEEN.Tween( object.position )
        .to( { x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration )
        .start();
      var rot = new TWEEN.Tween(object.rotation)
          .to({ x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration)
          .start();
      var c = pos.chain(rot)
      tweenfunc = c;
    }

    new TWEEN.Tween( this )
      .to( {}, duration * 2 )
      .start();
  
}


//E:
// this part is a bit complicated...
/*
- app.view.uiEvent will read changes to a parameter the function also inject (`evt`); evt contains all events in HTML
- once an event is set, we forward the event to app (evt.forwardEvent())
- for this function:
-- if there is a event in course, defaultPrevented is true so we re-send the existing event
-- if not, we are going to manipulate 3 variables (t1, tx, ty) representing the mouse coordinates with a SWITCH of event cascades
-- each new response to event will be based on the current event type
*/
app.view.uiEvent.addEventListener(function (evt) {
    var event = evt.event;
    if (event.type === 'mousedown') {
        //code
        //console.log('sounds', sounds)
        sounds[0].context.resume().then(() => {
           console.log('Playback resumed successfully');
           //console.log(sound1.context);
          document.getElementById('overlay').remove();
          //document.getElementById('overlay').innerHTML =  'Playback resumed successfully';
         }).catch((err)=>{document.getElementById('overlay').innerHTML = err; });
    };
    if (event.defaultPrevented) {
        console.log("event was consumed");
        //console.log(event);
        evt.forwardEvent();
        return; // Should do nothing if the key event was already consumed.
    }
    // handle mouse movement
    var ti, tx, ty;
    switch (event.type) {
        case "touchstart":
        /*
        ---- `touchstart`
        -------- if PointerEvent already, send this event and leave
        -------- otherwise
        ------------ preventDefault
        ------------ make ti = 0
         */
            if (window.PointerEvent) {
                evt.forwardEvent();
                return; // ignore duplicate events
            }
            console.log("touch start: ");
            console.log(event);
            event.preventDefault();
            // try the first new touch ... seems unlikely there will be TWO new touches
            // at exactly the same time
            ti = 0;
        case 'pointerdown':
        /*
         ---- `pointerdown`
         -------- (a metacase)
         */
        case 'mousedown':
        /*
        ---- `mousedown`
        -------- if SELECTED already, send this event and leave
        -------- otherwise
        ------------ if isCrosshair
        ---------------- if event.type == `mousedown`
        -------------------- we have it already: send this event and leave
        ---------------- otherwise if event.type other thing than `mousedown` make mouse x,y = 0 (center reference of object) 
        ------------ if NOT isCrosshair
        ---------------- if event.type == `touchstart`
        -------------------- set internal tx,ty to mouse values as in the registered events saved in changedTouches
        ---------------- if event.type NOT `touchstart`
        -------------------- it is likely we are going to start one: set tx and ty to current mouse position
        ---------------- prepare for a start: set x and y accordingly, making a normalization
        ------------ if after the selection is handled...
        ---------------- ... the event.type changes to `touchstart`
        -------------------- get the touchID using the ti by looking at the register of the boxes events (changedTouches)
        ---------------- if addtionally is possibly a ANY `pointerdown` event
        -------------------- if isCrosshair is NOT active...
        ----------------------- ... but there is an INTERSECT
        --------------------------- change the color of the selection
        ------------ if the selection is NOT handled
        ---------------- we are doing something else: send this event and leave
        -------- we have checked for `touchmove` as well as the `pointermove` and `pointerdown` metacases: BREAK those cases now 
          */
            // ignore additional touches or pointer down events after the first selection
            if (SELECTED) {
                // perhaps multitouch devices can do a second pointer down ... need
                // to keep track of which pointer event, I suppose!
                evt.forwardEvent();
                return;
            }
            if (event.type == "touchstart") {
                tx = event.changedTouches[ti].clientX;
                ty = event.changedTouches[ti].clientY;
            }
            else {
                tx = event.clientX;
                ty = event.clientY;
            }
            mouse.x = (tx / window.innerWidth) * 2 - 1;
            mouse.y = -(ty / window.innerHeight) * 2 + 1;
            console.log("mousedown");
            if (handleSelection()) {
                if (event.type == "touchstart") {
                    touchID = event.changedTouches[ti].identifier;
                }
                if (event.type == "touchstart" || event.type == "pointerdown") {
                    if (INTERSECTED)
                        INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
                    INTERSECTED = SELECTED;
                    //INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
                    //console.log('interseted color in mousestart', INTERSECTED.currentHex);
                    //INTERSECTED.material.color.setHex(0xffff33);
                    //console.log(objects.indexOf(INTERSECTED));
                    if (move[objects.indexOf(INTERSECTED)]) {
                        move[objects.indexOf(INTERSECTED)] = false;
                        INTERSECTED.material.color.setHex(0xffffff);
                        INTERSECTED.children[0].pause();
                        INTERSECTED.remove(INTERSECTED.children[0]);
                        //INTERSECTED.remove(INTERSECTED.children[1]);
                        //sounds.pop();
                        --sphs;
                        remainingSpheres.innerHTML = `${sphs} spheres remaining`; 
                    }
                 }
            }
            else {
                evt.forwardEvent();
            }
            break;
        case "touchend":
        /*
        ---- `touchend` (identical logic as touchmove)
        -------- if there is a PointerEvent already, send this event and leave
        -------- otherwise
        ------------ preventDefault
        ------------ for ti = 0 to all changedTouches registered in event
        ---------------- if the current identifier in changedTouches is the same as touchid, break: we got the current ti
        ------------ if 'ti' is the last one
        ---------------- we are still in the last event: send this event and leave
         */            
            if (window.PointerEvent) {
                evt.forwardEvent();
                return; // ignore duplicate events
            }
            console.log("touch end: ");
            console.log(event);
            event.preventDefault();
            for (ti = 0; ti < event.changedTouches.length; ti++) {
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
        /*
         ---- `pointerup`
         -------- (a metacase)
         */        
        case 'mouseup':
        /*
        ---- `mouseup`
        -------- if mouseup and isCrosshair already
        ------------ send this event and leave
        -------- if none of those but SELECTED
        ------------ if handleRelease is true
        ---------------- if event.type is either `touchend` or any `pointerup` AND there is NOT isCrosshair
        -------------------- if INTERSECT
        ------------------------ make color of INTERSECTED == currentHex
        -------------------- in any case, delete INTERSECT
        -------- if still NOT SELECTED
        ------------ send this event and leave AND leave this case
          */
            console.log("release");
            if (SELECTED) {
                if (handleRelease()) {
                    if (event.type == "touchend" || event.type == "pointerup") {
                        //if(INTERSECTED)
                        //    INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
                        //console.log('mouseup color', INTERSECTED.material.color);
                        INTERSECTED = null;
                    }
                }
            }
            else {
                evt.forwardEvent();
            }
            break;
        default:
        /*
        ---- `default`
        -------- always send current event
        */
            evt.forwardEvent();
    }
    //console.log(event);
});
function handleRelease() {
    /*
    ---- get the time of the intersection (date): we are going to formulate an ID; this comes FROM THE APP (app.context)
    ---- using THREE SceneUtils, detach the object from the USER scene (we are going to bring it back to boxScene)
    ---- using THREE SceneUtils, attach the object to the boxScene again
    ---- make SELECTED and touchID both = NULL
    ---- return TRUE ("we handled a release correctly")
    */
    //var date = app.context.getTime();
    THREE.SceneUtils.detach(SELECTED, stage, scene);
    THREE.SceneUtils.attach(SELECTED, scene, boxScene);
    //console.log('at release', SELECTED.currentHex);
    SELECTED = null;
    touchID = null;
    return true;
}
function handleSelection() {
    //E:
    /*
    ---- update the Matrix World
    ---- set raycaster to mouse coordinates respect to camera
    ---- check for intersects
    ---- if any intersects
    -------- declare INTERSECTED object as the first in the list of intersects
    -------- get the time of the intersection (date): we are going to formulate an ID; this comes FROM THE APP (app.context)
    -------- get also the defaultFrame as reference: this come FROM THE APP (app.context), not THREE.JS
    -------- using THREE SceneUtils, detach the object from the boxScene (we are going to do something with the object outside its current local world)
    -------- using THREE SceneUtils, attach the object to the scene of the USER
    -------- declare SELECTED as this object: we have a selection
    -------- if isCrosshair is true
    ------------ recalculate the plane coordinates based on the position of the SELECTED and using the camera as it moves
    ------------ if there is an intersection between the plane and the ray
    ---------------- move the SELECTED within the USER world according to the offset
    -------- we have intesects: return TRUE
    ---- if NOT intersects
    -------- return FALSE
    */
    scene.updateMatrixWorld(true);
    raycaster.setFromCamera(mouse, camera);
    console.log("touch!");
    var intersects = raycaster.intersectObjects(objects);
    if (intersects.length > 0) {
        console.log("touch intersect!");
        var object = intersects[0].object;
        //var date = app.context.getTime();
        //var defaultFrame = app.context.getDefaultReferenceFrame();
        //console.log("------");
        //console.log("touch FIXED pos=" + JSON.stringify(object.position));
        //console.log("touch FIXED quat=" + JSON.stringify(object.quaternion));
        THREE.SceneUtils.detach(object, boxScene, scene);
        THREE.SceneUtils.attach(object, scene, stage);
        SELECTED = object;
        //var worldLoc = user.localToWorld(tempPos.copy(SELECTED.position));
        //plane.setFromNormalAndCoplanarPoint(camera.getWorldDirection(plane.normal), worldLoc);
        //if (raycaster.ray.intersectPlane(plane, intersection)) {
        //    offset.copy(user.worldToLocal(intersection).sub(SELECTED.position));
        //}
        return true;
    }
    return false;
}

//// since these don't move, we only update them when the origin changes
//app.context.originChangeEvent.addEventListener(function () {
//    if (boxInit) {
//        console.log("**** new frame of reference");
//        var boxPose = app.context.getEntityPose(boxSceneEntity);
//        boxScene.position.copy(boxPose.position);
//        boxScene.quaternion.copy(boxPose.orientation);
//    }
//});
// check if the reality has a geopose
app.reality.changeEvent.addEventListener(function (data) {
    console.log("Reality changed from '" + data.previous + "' to '" + data.current);
});

// the updateEvent is called each time the 3D world should be
// rendered, before the renderEvent.  The state of your application
// should be updated here.
var frameCounter = 0;
app.updateEvent.addEventListener(function (frame) {
    //// get the position and orientation (the "pose") of the user
    //// in the local coordinate frame.
    //var stagePose = app.context.getEntityPose(app.context.stage);
    
    // get the position and orientation (the "pose") of the stage
    // in the local coordinate frame.
    var stagePose = app.getEntityPose(app.stage);

    //// assuming we know the user's pose, set the pose of our
    //// THREE user object to match it
    //if (stagePose.poseStatus & Argon.PoseStatus.KNOWN) {
    //    stage.position.copy(stagePose.position);
    //    stage.quaternion.copy(stagePose.orientation);
    //}
    //else {
    //    return;
    //}
    
    // set the position of our THREE user object to match it
    stage.position.copy(stagePose.position);
    stage.quaternion.copy(stagePose.orientation);
    
    //// In 6DOF realities, scale down the boxes
    //boxScene.scale.setScalar(app.context.userTracking === '6DOF' ? 2 : 4);
    
    if (app.userTracking === '6DOF') {
      if (app.displayMode === 'head') {
        boxScene.position.set(0, Argon.AVERAGE_EYE_HEIGHT, 0);
      } else {
        boxScene.position.set(0, Argon.AVERAGE_EYE_HEIGHT / 2, 0);
      }
    } else {
      const userStagePose = app.getEntityPose(app.user, app.stage);
      boxScene.position.set(0, userStagePose.position.y, 0);
    }
    
    
    frameCounter += 1
    if (frameCounter > 45) {
        spherePosHELPER();
        transformHELPER(targets, 3000);
        frameCounter = 0;
    }
    
    
    TWEEN.update();
    
});
// renderEvent is fired whenever argon wants the app to update its display
app.renderEvent.addEventListener(function (frame) {
    // set the renderer to know the current size of the viewport.
    // This is the full size of the viewport, which would include
    // both views if we are in stereo viewing mode
    var view = app.view;
    renderer.setSize(view.renderWidth, view.renderHeight, false);
    renderer.setPixelRatio(app.suggestedPixelRatio);
    var viewport = view.viewport;
    hud.setSize(viewport.width, viewport.height);
    // there is 1 subview in monocular mode, 2 in stereo mode
    for (var _i = 0, _a = app.view.subviews; _i < _a.length; _i++) {
        var subview = _a[_i];
        // set the position and orientation of the camera for
        // this subview
        camera.position.copy(subview.pose.position);
        camera.quaternion.copy(subview.pose.orientation);
        // the underlying system provide a full projection matrix
        // for the camera.
        camera.projectionMatrix.fromArray(subview.frustum.projectionMatrix);
        // set the viewport for this view
        var _b = subview.renderViewport, x = _b.x, y = _b.y, width = _b.width, height = _b.height;
        renderer.setViewport(x, y, width, height);
        // set the webGL rendering parameters and render this view
        renderer.setScissor(x, y, width, height);
        renderer.setScissorTest(true);
        renderer.render(scene, camera);
        // adjust the hud, but only in mono
        //      if (monoMode) {
        var _c = subview.viewport, x = _c.x, y = _c.y, width = _c.width, height = _c.height;
        hud.setViewport(x, y, width, height, subview.index);
        hud.render(subview.index);
        //    }
    }
    stats.update();
});
