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
var user = new THREE.Object3D;
var boxScene = new THREE.Object3D;
scene.add(camera);
scene.add(user);
scene.add(boxScene);
// an entity for the collection of boxes, which are rooted to the world together
var boxSceneEntity = new Argon.Cesium.Entity({
    name: "box scene",
    position: Cartesian3.ZERO,
    orientation: Cesium.Quaternion.IDENTITY
});

var ambientlight = new THREE.AmbientLight(0x404040); // soft white ambient light
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
var touchID; // which touch caused the selection?
// need to keep track of if we've located the box scene at all, and if it's locked to the world
var boxInit = false;
var geoLocked = false;
// set up 50 cubes, each with its own entity
var geometry = new THREE.BoxGeometry(1, 1, 1);
for (var i = 0; i < 50; i++) {
    var object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff }));
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
    boxScene.add(object);
    objects.push(object);
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
    if (event.defaultPrevented) {
        console.log("event was consumed");
        console.log(event);
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
                    INTERSECTED.material.color.setHex(0xffffff);
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
    THREE.SceneUtils.detach(SELECTED, user, scene);
    THREE.SceneUtils.attach(SELECTED, scene, boxScene);
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
        THREE.SceneUtils.detach(object, boxScene, scene);
        THREE.SceneUtils.attach(object, scene, user);
        SELECTED = object;
        return true;
    }
    return false;
}

// check if the reality has a geopose
app.reality.changeEvent.addEventListener(function (data) {
    console.log("Reality changed from '" + data.previous + "' to '" + data.current);
});
// the updateEvent is called each time the 3D world should be
// rendered, before the renderEvent.  The state of your application
// should be updated here.
app.updateEvent.addEventListener(function (frame) {
    // get the position and orientation (the "pose") of the user
    // in the local coordinate frame.
    var userPose = app.context.getEntityPose(app.context.user);
    // assuming we know the user's pose, set the pose of our
    // THREE user object to match it
    if (userPose.poseStatus & Argon.PoseStatus.KNOWN) {
        user.position.copy(userPose.position);
        user.quaternion.copy(userPose.orientation);
    }
    else {
        return;
    }
    // In 6DOF realities, scale down the boxes
    boxScene.scale.setScalar(app.context.userTracking === '6DOF' ? 0.1 : 1);
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
