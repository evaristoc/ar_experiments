// This example is taken from the threejs.org periodic table example,
// to demonstrate how an existing threejs application is moved to the argon.js 
// framework.

// most importantly, argon applications should only render when asked to do so,
// rather than in response to animation or other updates.  

  
// set up Argon
var app = Argon.init();

var camera, scene, renderer, hud;
var butterfliesContainer, stage;

var objects = [];
var spherePos;
var targets = { table: [], sphere: [], helix: [], grid: [] };

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

// The CSS3DArgonHUD has a similar interface to a renderer, and provides a simple abstraction
// for multiple HTML HUD's that can be used in stereo mode.  We do not
// use the HUD features here (instead, just removing the buttons below when in Stereo mode)
hud = new THREE.CSS3DArgonHUD();

// argon creates the domElement for the view, which we add our renderer dom to
app.view.setLayers([
  {source: renderer.domElement}, 
  {source: hud.domElement}
])

// argon will pass us the camera projection details in each renderEvent callback.  This
// is necessary to handle different devices, stereo/mono switching, etc.   argon will also
// tell us the position of the camera to correspond to user movement
//    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 5000 );
//		camera.position.z = 1800;
camera = new THREE.PerspectiveCamera();
scene = new THREE.Scene();

// add a new Object3D, butterfliesContainer, that serves as the root of the periodic table in local coordinates.
// Since the camera is moving in AR, and we want to move the content with us, but have it
// oriented relative to the world, putting it in a sub-graph under the stage object
// let's us move the location of the content with us.  Content should not be added to the 
// scene directly unless it is going to be updated as the user moves through the world 
// (since the world coordinate system is abitrarily chosen to be near the user, and could
// change at any time)

butterfliesContainer = new THREE.Object3D;
butterfliesContainer.scale.setScalar(0.1);

stage = new THREE.Object3D;

// Add the butterfliesContainer node to our stage
stage.add(butterfliesContainer)
scene.add(stage);
scene.add(camera);

// need init to run after everything loads
window.addEventListener( 'load', init );

// The original animate function was called once to start the 
// requestAnimationFrame update cycle.  We don't do that with Argon
//    animate();

function Butterfly(){
  this.butterF = new THREE.Object3D();
  this.butinit();
}

Butterfly.prototype.butinit = function(){
  var geometryWL = new THREE.PlaneGeometry(10, 15);
  var materialWL = new THREE.MeshBasicMaterial({
    transparent:true,
    map: new THREE.TextureLoader().load('public/assets/b1w.png'),
    side: THREE.DoubleSide,
    depthTest: true
  });
  
  var meshWL = new THREE.Mesh( geometryWL, materialWL );
  meshWL.position.x = -5;
  var lwing = new THREE.Object3D();
  lwing.add(meshWL);

  var geometryWR = new THREE.PlaneGeometry(10, 15);
  var materialWR = new THREE.MeshBasicMaterial({
    transparent:true,
    map: new THREE.TextureLoader().load('public/assets/b1w.png'),
    side: THREE.DoubleSide,
    depthTest: true
  });
  
  var meshWR = new THREE.Mesh( geometryWR, materialWR )
  meshWR.material.color.setHex(0xff0000);
  var rwing = new THREE.Object3D();
  meshWR.rotation.y = Math.PI;
  meshWR.position.x = 5;
  rwing.add(meshWR);
  this.butterF.add(lwing);
  this.butterF.add(rwing);
  
}


var objects = [];
var s;
var numbuts = 50;

function init() {
  // some of the exact locations of content below have been changed slightly from the original
  // example so that they work reasonably on smaller mobile phone screens.
  for ( var i = 0; i < numbuts; i ++ ) {

    var object = new Butterfly().butterF;
    var geometryW = new THREE.BoxGeometry(10, 10, 10);
    var materialW = new THREE.MeshBasicMaterial({color:'black'});
    
    object.position.x = Math.random() * 4000 - 2000;
    object.position.y = Math.random() * 4000 - 2000;
    object.position.z = Math.random() * 4000 - 2000;
    objects.push( object );

    // Add each object our root node
    butterfliesContainer.add(object);
    

  }


  for ( var i = 0; i < objects.length; i ++ ) {

    var target = new THREE.Object3D();

    target.position.x = ( i * 140 ) - 1330;
    target.position.y = - ( i * 180 ) + 990;
    target.position.z = - 1000;

    targets.table.push( target );

  }

  // sphere

  var vector = stage.position; //World coordinates to be looked at

  for ( var i = 0; i < objects.length; i ++ ) {
    var phi = Math.acos(Math.random()*(Math.random() >= .5? 1:-1))
    var theta = Math.sqrt( objects.length * Math.PI ) * phi; //(Math.sqr of totalItems*PI) angle
    var target = new THREE.Object3D();

    target.position.x = 800 * Math.cos( theta ) * Math.sin( phi );
    target.position.y = 800 * Math.sin( theta ) * Math.sin( phi );
    target.position.z = 800 * Math.cos( phi );

    target.lookAt( vector );

    targets.sphere.push( target );

  }
  
  spherePos = function(){
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
      
          targets.sphere[i] = target;

        }
        
  }
  

  // move the menu to the Argon HUD.  We don't duplicate it because we only
  // use it in mono mode
  var hudContainer = document.getElementById( 'hud' );
  hud.hudElements[0].appendChild(hudContainer);
  
  transform( targets.sphere, 1000 );

  // do not need to respond to windowResize events.  Argon handles this for us
  //    window.addEventListener( 'resize', onWindowResize, false );

}

var tweenfunc; 

function transform( targets, duration ) {
    //console.log(TWEEN.Tween);
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

var counter = 0;
app.updateEvent.on(function () {
    // get the position and orientation (the "pose") of the stage
    // in the local coordinate frame.
    var stagePose = app.getEntityPose(app.stage);

    // set the position of our THREE user object to match it
    stage.position.copy(stagePose.position);
    stage.quaternion.copy(stagePose.orientation);

    if (app.userTracking === '6DOF') {
      if (app.displayMode === 'head') {
        butterfliesContainer.position.set(0, Argon.AVERAGE_EYE_HEIGHT, 0);
      } else {
        butterfliesContainer.position.set(0, Argon.AVERAGE_EYE_HEIGHT / 2, 0);
      }
    } else {
      const userStagePose = app.getEntityPose(app.user, app.stage);
      butterfliesContainer.position.set(0, userStagePose.position.y, 0);
    }
    
    //posTWEEN.onUpdate(()=>{spherePos();})
    
    //// update the moving DIVs, if need be
    if (typeof spherePos === 'function') {
    }
    
    counter += 1
    if (typeof tweenfunc === 'object' && counter > 45) {
    spherePos();
    transform(targets.sphere, 1000);
    counter = 0;
    }
    
    //s.rotation.z += .01;
    TWEEN.update();
    
});

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
