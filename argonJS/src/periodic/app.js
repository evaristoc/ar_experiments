// This example is taken from the threejs.org periodic table example,
// to demonstrate how an existing threejs application is moved to the argon.js 
// framework.

// most importantly, argon applications should only render when asked to do so,
// rather than in response to animation or other updates.  

// The original example is in the original-three-example.html file in this directory
  
var tableContent = [
  [ "H", "Hydrogen", "1.00794", 1, 1 ],
  [ "He", "Helium", "4.002602", 18, 1 ],
  [ "Li", "Lithium", "6.941", 1, 2 ],
  [ "Be", "Beryllium", "9.012182", 2, 2 ],
  [ "B", "Boron", "10.811", 13, 2 ],
  [ "C", "Carbon", "12.0107", 14, 2 ],
  [ "N", "Nitrogen", "14.0067", 15, 2 ],
  [ "O", "Oxygen", "15.9994", 16, 2 ],
  [ "F", "Fluorine", "18.9984032", 17, 2 ],
  [ "Ne", "Neon", "20.1797", 18, 2 ],
  [ "Na", "Sodium", "22.98976...", 1, 3 ],
  [ "Mg", "Magnesium", "24.305", 2, 3 ],
  [ "Al", "Aluminium", "26.9815386", 13, 3 ],
  [ "Si", "Silicon", "28.0855", 14, 3 ],
  [ "P", "Phosphorus", "30.973762", 15, 3 ],
  [ "S", "Sulfur", "32.065", 16, 3 ],
  [ "Cl", "Chlorine", "35.453", 17, 3 ],
  [ "Ar", "Argon", "39.948", 18, 3 ],
  [ "K", "Potassium", "39.948", 1, 4 ],
  [ "Ca", "Calcium", "40.078", 2, 4 ],
  [ "Sc", "Scandium", "44.955912", 3, 4 ],
  [ "Ti", "Titanium", "47.867", 4, 4 ],
  [ "V", "Vanadium", "50.9415", 5, 4 ],
  [ "Cr", "Chromium", "51.9961", 6, 4 ],
  [ "Mn", "Manganese", "54.938045", 7, 4 ],
  [ "Fe", "Iron", "55.845", 8, 4 ],
  [ "Co", "Cobalt", "58.933195", 9, 4 ],
  [ "Ni", "Nickel", "58.6934", 10, 4 ],
  [ "Cu", "Copper", "63.546", 11, 4 ],
  [ "Zn", "Zinc", "65.38", 12, 4 ],
  [ "Ga", "Gallium", "69.723", 13, 4 ],
  [ "Ge", "Germanium", "72.63", 14, 4 ],
  [ "As", "Arsenic", "74.9216", 15, 4 ],
  [ "Se", "Selenium", "78.96", 16, 4 ],
  [ "Br", "Bromine", "79.904", 17, 4 ],
  [ "Kr", "Krypton", "83.798", 18, 4 ],
  [ "Rb", "Rubidium", "85.4678", 1, 5 ],
  [ "Sr", "Strontium", "87.62", 2, 5 ],
  [ "Y", "Yttrium", "88.90585", 3, 5 ],
  [ "Zr", "Zirconium", "91.224", 4, 5 ],
  [ "Nb", "Niobium", "92.90628", 5, 5 ],
  [ "Mo", "Molybdenum", "95.96", 6, 5 ],
  [ "Tc", "Technetium", "(98)", 7, 5 ],
  [ "Ru", "Ruthenium", "101.07", 8, 5 ],
  [ "Rh", "Rhodium", "102.9055", 9, 5 ],
  [ "Pd", "Palladium", "106.42", 10, 5 ],
  [ "Ag", "Silver", "107.8682", 11, 5 ],
  [ "Cd", "Cadmium", "112.411", 12, 5 ],
  [ "In", "Indium", "114.818", 13, 5 ],
  [ "Sn", "Tin", "118.71", 14, 5 ],
  [ "Sb", "Antimony", "121.76", 15, 5 ],
  [ "Te", "Tellurium", "127.6", 16, 5 ],
  [ "I", "Iodine", "126.90447", 17, 5 ],
  [ "Xe", "Xenon", "131.293", 18, 5 ],
  [ "Cs", "Caesium", "132.9054", 1, 6 ],
  [ "Ba", "Barium", "132.9054", 2, 6 ],
  [ "La", "Lanthanum", "138.90547", 4, 9 ],
  [ "Ce", "Cerium", "140.116", 5, 9 ],
  [ "Pr", "Praseodymium", "140.90765", 6, 9 ],
  [ "Nd", "Neodymium", "144.242", 7, 9 ],
  [ "Pm", "Promethium", "(145)", 8, 9 ],
  [ "Sm", "Samarium", "150.36", 9, 9 ],
  [ "Eu", "Europium", "151.964", 10, 9 ],
  [ "Gd", "Gadolinium", "157.25", 11, 9 ],
  [ "Tb", "Terbium", "158.92535", 12, 9 ],
  [ "Dy", "Dysprosium", "162.5", 13, 9 ],
  [ "Ho", "Holmium", "164.93032", 14, 9 ],
  [ "Er", "Erbium", "167.259", 15, 9 ],
  [ "Tm", "Thulium", "168.93421", 16, 9 ],
  [ "Yb", "Ytterbium", "173.054", 17, 9 ],
  [ "Lu", "Lutetium", "174.9668", 18, 9 ],
  [ "Hf", "Hafnium", "178.49", 4, 6 ],
  [ "Ta", "Tantalum", "180.94788", 5, 6 ],
  [ "W", "Tungsten", "183.84", 6, 6 ],
  [ "Re", "Rhenium", "186.207", 7, 6 ],
  [ "Os", "Osmium", "190.23", 8, 6 ],
  [ "Ir", "Iridium", "192.217", 9, 6 ],
  [ "Pt", "Platinum", "195.084", 10, 6 ],
  [ "Au", "Gold", "196.966569", 11, 6 ],
  [ "Hg", "Mercury", "200.59", 12, 6 ],
  [ "Tl", "Thallium", "204.3833", 13, 6 ],
  [ "Pb", "Lead", "207.2", 14, 6 ],
  [ "Bi", "Bismuth", "208.9804", 15, 6 ],
  [ "Po", "Polonium", "(209)", 16, 6 ],
  [ "At", "Astatine", "(210)", 17, 6 ],
  [ "Rn", "Radon", "(222)", 18, 6 ],
  [ "Fr", "Francium", "(223)", 1, 7 ],
  [ "Ra", "Radium", "(226)", 2, 7 ],
  [ "Ac", "Actinium", "(227)", 4, 10 ],
  [ "Th", "Thorium", "232.03806", 5, 10 ],
  [ "Pa", "Protactinium", "231.0588", 6, 10 ],
  [ "U", "Uranium", "238.02891", 7, 10 ],
  [ "Np", "Neptunium", "(237)", 8, 10 ],
  [ "Pu", "Plutonium", "(244)", 9, 10 ],
  [ "Am", "Americium", "(243)", 10, 10 ],
  [ "Cm", "Curium", "(247)", 11, 10 ],
  [ "Bk", "Berkelium", "(247)", 12, 10 ],
  [ "Cf", "Californium", "(251)", 13, 10 ],
  [ "Es", "Einstenium", "(252)", 14, 10 ],
  [ "Fm", "Fermium", "(257)", 15, 10 ],
  [ "Md", "Mendelevium", "(258)", 16, 10 ],
  [ "No", "Nobelium", "(259)", 17, 10 ],
  [ "Lr", "Lawrencium", "(262)", 18, 10 ],
  [ "Rf", "Rutherfordium", "(267)", 4, 7 ],
  [ "Db", "Dubnium", "(268)", 5, 7 ],
  [ "Sg", "Seaborgium", "(271)", 6, 7 ],
  [ "Bh", "Bohrium", "(272)", 7, 7 ],
  [ "Hs", "Hassium", "(270)", 8, 7 ],
  [ "Mt", "Meitnerium", "(276)", 9, 7 ],
  [ "Ds", "Darmstadium", "(281)", 10, 7 ],
  [ "Rg", "Roentgenium", "(280)", 11, 7 ],
  [ "Cn", "Copernicium", "(285)", 12, 7 ],
  [ "Uut", "Unutrium", "(284)", 13, 7 ],
  [ "Fl", "Flerovium", "(289)", 14, 7 ],
  [ "Uup", "Ununpentium", "(288)", 15, 7 ],
  [ "Lv", "Livermorium", "(293)", 16, 7 ],
  [ "Uus", "Ununseptium", "(294)", 17, 7 ],
  [ "Uuo", "Ununoctium", "(294)", 18, 7 ]
];

// set up Argon
var app = Argon.init();

var camera, scene, renderer, hud;
var periodicTable, stage;

var objects = [];
var targets = { table: [], sphere: [], helix: [], grid: [] };

// In a typical threejs example, the camera doesn't move and is controlled by the 
// mouse.  We do not need that here.  Furthermore, our domElement for rendering is 
// coordinated by argon to match the user's prefered rendering setup

//   renderer = new THREE.CSS3DRenderer();
//   renderer.setSize( window.innerWidth, window.innerHeight );
//   renderer.domElement.style.position = 'absolute';
//   renderer.domElement.style.top = 0;
//   document.getElementById( 'container' ).appendChild( renderer.domElement );
//
//   controls = new THREE.TrackballControls( camera, renderer.domElement );
//   controls.rotateSpeed = 0.5;
//   controls.addEventListener( 'change', render );

// In argon, we use a custom version of the CSS3DRenderer called CSS3DArgonRenderer.
// This version of the renderer supports stereo in a way that fits with Argon's renderEvent,
// especially supporting the user providing multiple divs for the potential multiple viewports
// in stereo mode.
renderer = new THREE.CSS3DArgonRenderer();
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

// add a new Object3D, periodicTable, that serves as the root of the periodic table in local coordinates.
// Since the camera is moving in AR, and we want to move the content with us, but have it
// oriented relative to the world, putting it in a sub-graph under the stage object
// let's us move the location of the content with us.  Content should not be added to the 
// scene directly unless it is going to be updated as the user moves through the world 
// (since the world coordinate system is abitrarily chosen to be near the user, and could
// change at any time)

periodicTable = new THREE.Object3D()
periodicTable.scale.setScalar(0.001);

stage = new THREE.Object3D;

// Add the periodicTable node to our stage
stage.add(periodicTable)
scene.add(stage);
scene.add(camera);

// need init to run after everything loads
window.addEventListener( 'load', init );

// The original animate function was called once to start the 
// requestAnimationFrame update cycle.  We don't do that with Argon
//    animate();

function init() {
  // some of the exact locations of content below have been changed slightly from the original
  // example so that they work reasonably on smaller mobile phone screens.
  for ( var i = 0; i < tableContent.length; i ++ ) {

    var item = tableContent[ i ];

    var element = document.createElement( 'div' );
    element.className = 'element';
    element.style.backgroundColor = 'rgba(0,127,127,' + ( Math.random() * 0.5 + 0.25 ) + ')';

    // if it's Argon make it bright red
    if (i==17) element.style.backgroundColor = 'rgba(127,0,0,1)';

    var number = document.createElement( 'div' );
    number.className = 'number';
    number.textContent = i + 1;
    element.appendChild( number );

    var symbol = document.createElement( 'div' );
    symbol.className = 'symbol';
    symbol.textContent = item[ 0 ];
    element.appendChild( symbol );

    var details = document.createElement( 'div' );
    details.className = 'details';
    details.innerHTML = item[ 1 ] + '<br>' + item[ 2 ];
    element.appendChild( details );

    var object = new THREE.CSS3DObject( element );
    object.position.x = Math.random() * 4000 - 2000;
    object.position.y = Math.random() * 4000 - 2000;
    object.position.z = Math.random() * 4000 - 2000;
    //object.matrixAutoUpdate = false;
    objects.push( object );

    // Add each object our root node
    periodicTable.add(object);
  }

  // table

  for ( var i = 0; i < objects.length; i ++ ) {

    var item = tableContent[ i ];

    var target = new THREE.Object3D();

    target.position.x = ( item[ 3 ] * 140 ) - 1330;
    target.position.y = - ( item[ 4 ] * 180 ) + 990;
    target.position.z = - 1000;

    targets.table.push( target );

  }

  // sphere

  var vector = stage.position;

  for ( var i = 0; i < objects.length; i ++ ) {

    var phi = Math.acos( -1 + ( 2 * i ) / objects.length );
    var theta = Math.sqrt( objects.length * Math.PI ) * phi;
    var target = new THREE.Object3D();

    target.position.x = 800 * Math.cos( theta ) * Math.sin( phi );
    target.position.y = 800 * Math.sin( theta ) * Math.sin( phi );
    target.position.z = 800 * Math.cos( phi );

    target.lookAt( vector );

    targets.sphere.push( target );

  }

  // helix

  var vector = new THREE.Vector3(0, 0, 0);

  for ( var i = 0; i < objects.length; i ++ ) {

    var phi = i * 0.175 + Math.PI;

    target = new THREE.Object3D();

    target.position.x = 900 * Math.sin( -phi );
    target.position.y = - ( i * 8 ) + 450;
    target.position.z = 900 * Math.cos( -phi );

    vector.x = -target.position.x * 2;
    vector.y = -target.position.y;
    vector.z = -target.position.z * 2;

    target.lookAt( vector );

    targets.helix.push( target );

  }

  // grid
  for ( var i = 0; i < objects.length; i ++ ) {

    target = new THREE.Object3D();

    target.position.x = ( ( i % 5 ) * 400 ) - 800;
    target.position.y = ( - ( Math.floor( i / 5 ) % 5 ) * 400 ) + 800;
    target.position.z = ( Math.floor( i / 25 ) ) * 1000 - 2500;

    targets.grid.push( target );

  }


  // move the menu to the Argon HUD.  We don't duplicate it because we only
  // use it in mono mode
  var hudContainer = document.getElementById( 'hud' );
  hud.hudElements[0].appendChild(hudContainer);

  // Add button event listeners
  var button = document.getElementById( 'table' );
  button.addEventListener( 'click', function ( event ) {
    transform( targets.table, 2000 );
  }, false );

  var button = document.getElementById( 'sphere' );
  button.addEventListener( 'click', function ( event ) {
    transform( targets.sphere, 2000 );
  }, false );

  var button = document.getElementById( 'helix' );
  button.addEventListener( 'click', function ( event ) {
    transform( targets.helix, 2000 );
  }, false );

  var button = document.getElementById( 'grid' );
  button.addEventListener( 'click', function ( event ) {
    transform( targets.grid, 2000 );
  }, false );

  transform( targets.table, 5000 );

  // do not need to respond to windowResize events.  Argon handles this for us
  //    window.addEventListener( 'resize', onWindowResize, false );

}

function transform( targets, duration ) {
  TWEEN.removeAll();

      for ( var i = 0; i < objects.length; i ++ ) {

        var object = objects[ i ];
        var target = targets[ i ];

        new TWEEN.Tween( object.position )
          .to( { x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration )
          .easing( TWEEN.Easing.Exponential.InOut )
          .start();

        new TWEEN.Tween( object.rotation )
          .to( { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration )
          .easing( TWEEN.Easing.Exponential.InOut )
          .start();

      }

      // An EXTREMELY important difference between creating desktop 3D content and 
      // AR content using Argon is that we should not render except when argon tells
      // us to.  In this way, Argon can decide when to render based on the kind of Reality 
      // being rendered, and the device being used.  So, we do not leverage the Tween.onUpdate
      // callback. 
      new TWEEN.Tween( this )
        .to( {}, duration * 2 )
//					.onUpdate( render )
        .start();
  
}

// The original demo responded to windowResize events but updating the camera.
// argon handles this functionality and sends the appropriate information to
// the render callback each frame.

// 			function onWindowResize() {
//
// 				camera.aspect = window.innerWidth / window.innerHeight;
// 				camera.updateProjectionMatrix();
//
// 				renderer.setSize( window.innerWidth, window.innerHeight );
//
// 			}

// The original demo used a simple animation loop to trigger regular updates,
// and manage the mouse virtual trackball controller.  Argon send update
// messages, which we cache and trigger requestAnimationFrames from (see below)

// 			function animate() {
//
// 				requestAnimationFrame( animate );
//
// 				TWEEN.update();
// 				controls.update();
//
// 			}
//
// 			function render() {
//
// 				renderer.render( scene, camera );
//
// 			}

// the updateEvent is called each time the 3D world should be
// rendered, before the renderEvent.  The state of your application
// should be updated here.  Here, we call TWEEN.update()
app.updateEvent.on(function () {
    // get the position and orientation (the "pose") of the stage
    // in the local coordinate frame.
    var stagePose = app.getEntityPose(app.stage);

    // set the position of our THREE user object to match it
    stage.position.copy(stagePose.position);
    stage.quaternion.copy(stagePose.orientation);

    if (app.userTracking === '6DOF') {
      if (app.displayMode === 'head') {
        periodicTable.position.set(0, Argon.AVERAGE_EYE_HEIGHT, 0);
      } else {
        periodicTable.position.set(0, Argon.AVERAGE_EYE_HEIGHT / 2, 0);
      }
    } else {
      const userStagePose = app.getEntityPose(app.user, app.stage);
      periodicTable.position.set(0, userStagePose.position.y, 0);
    }

    // update the moving DIVs, if need be
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
        renderer.render(scene, camera, _i);
        hud.render(_i);
    }
});
