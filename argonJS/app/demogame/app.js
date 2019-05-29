
// set up Argon
var app = Argon.init();

/******************
 * SCENE- AND ARGON-RELATED GLOBALS AND PRE-SETTINGS
 *****************/
var camera,
    scene,
    renderer,
    hud;

/* ---- RENDERER ---- */
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


/* ---- HUD AND ADDITIONAL DOM ELEMENTS ---- */
// to easily control stuff on the display
hud = new THREE.CSS3DArgonHUD();

// We put some elements in the index.html, for convenience.
// Here, we retrieve the description box and move it to the
// the CSS3DArgonHUD hudElements[0].  We only put it in the left
// hud since we'll be hiding it in stereo
var crosshair = document.getElementById('crosshair-wrapper');
hud.appendChild(crosshair);
var hudContainer = document.getElementById('hud');
hud.hudElements[0].appendChild(hudContainer);
var description = document.getElementById('description');
hud.hudElements[0].appendChild(description);


// Add button event listener.  Toggle better interaction style.
var isCrosshair = true;
var controlsBTN = document.getElementById('controls');
console.log('controlsBTN not found?', controlsBTN, document.getElementsByTagName('button'));
//controlsBTN.addEventListener('click', function (event) {
//    if (isCrosshair) {
//        controlsBTN.innerText = "Click to switch to crosshair selection";
//        isCrosshair = false;
//        crosshair.setAttribute('class', 'crosshair hide-crosshair');
//    }
//    else {
//        controlsBTN.innerText = "Click to switch to touch selection";
//        isCrosshair = true;
//        crosshair.setAttribute('class', 'crosshair show-crosshair');
//    }
//    // clear any highlight
//    if (INTERSECTED)
//        INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
//    INTERSECTED = null;
//}, false);


/* ---- ARGON VIEW ---- */
// argon creates the domElement for the view, which we add our renderer dom to
app.view.setLayers([
  {source: renderer.domElement}, 
  {source: hud.domElement}
])


/* ---- CAMERA, SCENE ---- */
// argon will pass us the camera projection details in each renderEvent callback.  This
// is necessary to handle different devices, stereo/mono switching, etc.   argon will also
// tell us the position of the camera to correspond to user movement
//    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 5000 );
//		camera.position.z = 1800;
camera = new THREE.PerspectiveCamera();
scene = new THREE.Scene();

/******************
 * RAYCASTER-RELATED GLOBALS AND PRESETTINGS
 *****************/

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var offset = new THREE.Vector3();
var intersection = new THREE.Vector3();
var INTERSECTED, SELECTED;
var touchID; // which touch caused the selection?
// need to keep track of if we've located the box scene at all, and if it's locked to the world
var boxInit = false;

function onMouseMove( event ) {
	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

/******************
 * OBJECT-RELATED GLOBALS AND PRESETTINGS
 *****************/
var boxScene,
    stage;
var objects = [];
var targets = [];


/* ---- CAMERA, STAGE ---- */   
// add a new Object3D, periodicTable, that serves as the root of the periodic table in local coordinates.
// Since the camera is moving in AR, and we want to move the content with us, but have it
// oriented relative to the world, putting it in a sub-graph under the stage object
// let's us move the location of the content with us.  Content should not be added to the 
// scene directly unless it is going to be updated as the user moves through the world 
// (since the world coordinate system is abitrarily chosen to be near the user, and could
// change at any time)
boxScene = new THREE.Object3D;
boxScene.scale.setScalar(0.1);

stage = new THREE.Object3D;
// Add the periodicTable node to our stage
stage.add(boxScene)

/* ---- PRE-BINDINGS ---- */ 
scene.add(stage);
scene.add(camera);
// need init to run after everything loads
window.addEventListener( 'load', init );

// The original animate function was called once to start the 
// requestAnimationFrame update cycle.  We don't do that with Argon
//    animate();


/******************
 * init FUNCTION: CREATING AND LOCATING OBJECTS: BOXES
 *****************/

function init() {

  for ( var i = 0; i < 50; i ++ ) {

    var geometryW = new THREE.BoxGeometry(10, 10, 10);
    var materialW = new THREE.MeshBasicMaterial({color:'black'});
    var object = new THREE.Mesh(geometryW, materialW);
   
    object.position.x = Math.random() * 4000 - 2000;
    object.position.y = Math.random() * 4000 - 2000;
    object.position.z = Math.random() * 4000 - 2000;
    objects.push( object );
    boxScene.add(object);
  }
  
  spherePosHELPER();

  // move the menu to the Argon HUD.  We don't duplicate it because we only
  // use it in mono mode
  var hudContainer = document.getElementById( 'hud' );
  hud.hudElements[0].appendChild(hudContainer);

  transformHELPER( targets, 1000 );

}


function  spherePosHELPER(){
      var vector = stage.position; //World coordinates to be looked at
      var phi, theta;
  
      for ( var i = 0; i < objects.length; i ++ ) {
        phi = Math.acos(Math.random()*(Math.random() >= .5? 1:-1))
        theta = Math.sqrt( objects.length * Math.PI ) * phi; //(Math.sqr of totalItems*PI) angle
        var target = new THREE.Object3D();
         target.position.x = 800 * Math.cos( theta ) * Math.sin( phi );
         target.position.y = 800 * Math.sin( theta ) * Math.sin( phi );
         target.position.z = 800 * Math.cos( phi );         
    
        target.lookAt( vector );
    
        targets[i] = target;

      }
}

function transformHELPER( targets, duration ) {
  TWEEN.removeAll();
    for ( var i = 0; i < objects.length; i ++ ) {
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


/******************
 * app UPDATE EVENT SECTION
 *****************/
var frameCounter = 0;
app.updateEvent.on(function () {
    // get the position and orientation (the "pose") of the stage
    // in the local coordinate frame.
    var stagePose = app.getEntityPose(app.stage);

    // set the position of our THREE user object to match it
    stage.position.copy(stagePose.position);
    stage.quaternion.copy(stagePose.orientation);

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
        transformHELPER(targets, 1000);
        frameCounter = 0;
    }
    
    
    TWEEN.update();
    
    //setInterval(()=>{spherePos();TWEEN.update()}, 1000);
    
});


/******************
 * app RENDER EVENT SECTION
 *****************/
// for the CSS renderer, we want to use requestAnimationFrame to 
// limit the number of repairs of the DOM.  Otherwise, as the 
// DOM elements are updated, extra repairs of the DOM could be 
// initiated.  Extra repairs do not appear to happen within the 
// animation callback.
var viewport = null;
var subViews = null;
app.renderEvent.on(function () {
    viewport = app.view.viewport;
    subViews = app.view.subviews;

    rAFpending = false;
    // set the renderer to know the current size of the viewport.
    // This is the full size of the viewport, which would include
    // both views if we are in stereo viewing mode
    renderer.setSize(viewport.width, viewport.height);
    hud.setSize(viewport.width, viewport.height);

    // There is 1 subview in monocular mode, 2 in stereo mode.
    // If we are in mono view, show the buttons.  If not, hide them, 
    // since we can't interact with them in an HMD
    if (subViews.length > 1 || !app.focus.hasFocus) {
      hud.domElement.style.display = 'none';
    } else {
      hud.domElement.style.display = 'block';
    }

    // we pass the view number to the renderer so it knows 
    // which div's to use for each view
    for (var _i = 0, _a = subViews; _i < _a.length; _i++) {
        var subview = _a[_i];
        var frustum = subview.frustum;

        // set the position and orientation of the camera for 
        // this subview
        camera.position.copy(subview.pose.position);
        camera.quaternion.copy(subview.pose.orientation);
        // the underlying system provide a full projection matrix
        // for the camera.  Use it, and then update the FOV of the 
        // camera from it (needed by the CSS Perspective DIV)
        camera.projectionMatrix.fromArray(subview.frustum.projectionMatrix);
        camera.fov = THREE.Math.radToDeg(frustum.fovy);

        // set the viewport for this view
        var _b = subview.viewport, x = _b.x, y = _b.y, width = _b.width, height = _b.height;
        renderer.setViewport(x, y, width, height, _i);
        hud.setViewport(x, y, width, height, _i);

        // render this view.
        // set the webGL rendering parameters and render this view
        renderer.setScissor(x, y, width, height);
        renderer.setScissorTest(true);
        renderer.render(scene, camera, _i);
        hud.render(_i);
    }
});