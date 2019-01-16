/// <reference types="@argonjs/argon"/>
/// <reference types="three"/>
// set up Argon
var app = Argon.init();
// set up THREE.  Create a scene, a perspective camera and an object
// for the user's location
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera();
var stage = new THREE.Object3D;
scene.add(camera);
scene.add(stage);
// The CSS3DArgonRenderer supports mono and stereo views, and 
// includes both 3D elements and a place to put things that appear 
// fixed to the screen (heads-up-display) 
var renderer = new THREE.CSS3DArgonRenderer();
app.view.element.appendChild(renderer.domElement);
// to easily control stuff on the display
var hud = new THREE.CSS3DArgonHUD();
// We put some elements in the index.html, for convenience.
// Here, we retrieve the description box and move it to the 
// the CSS3DArgonHUD hudElements[0].  We only put it in the left
// hud since we'll be hiding it in stereo
var description = document.getElementById('description');
hud.hudElements[0].appendChild(description);
app.view.element.appendChild(hud.domElement);
// creating 6 divs to indicate the x y z positioning
var divXpos = document.createElement('div');
var divXneg = document.createElement('div');
var divYpos = document.createElement('div');
var divYneg = document.createElement('div');
var divZpos = document.createElement('div');
var divZneg = document.createElement('div');
// programatically create a stylesheet for our direction divs
// and add it to the document
var style = document.createElement("style");
style.type = 'text/css';
document.head.appendChild(style);
var sheet = style.sheet;
sheet.insertRule("\n    .cssContent {\n        opacity: 0.5;\n        width: 100px;\n        height: 100px;\n        border-radius: 50%;\n        line-height: 100px;\n        fontSize: 20px;\n        text-align: center;\n    }\n", 0);
// Put content in each one  (should do this as a couple of functions)
// for X
divXpos.className = "cssContent";
divXpos.style.backgroundColor = "red";
divXpos.innerText = "Pos X = East";
divXneg.className = "cssContent";
divXneg.style.backgroundColor = "red";
divXneg.innerText = "Neg X = West";
// for Y
divYpos.className = "cssContent";
divYpos.style.backgroundColor = "blue";
divYpos.innerText = "Pos Y = Up";
divYneg.className = "cssContent";
divYneg.style.backgroundColor = "blue";
divYneg.innerText = "Neg Y = Down";
//for Z
divZpos.className = "cssContent";
divZpos.style.backgroundColor = "green";
divZpos.innerText = "Pos Z = South";
divZneg.className = "cssContent";
divZneg.style.backgroundColor = "green";
divZneg.innerText = "Neg Z = North";
// create 6 CSS3DObjects in the scene graph.  The CSS3DObject object 
// is used by the CSS3DArgonRenderer. Because an HTML element can only
// appear once in the DOM, we need two elements to create a stereo view.
// The CSS3DArgonRenderer manages these for you, using the CSS3DObject.
// You can pass a single DIV to the CSS3DObject, which
// will be cloned to create a second matching DIV in stereo mode, or you
// can pass in two DIVs in an array (one for the left and one for the 
// right eyes).  If the content of the DIV does not change as the 
// application runs, letting the CSS3DArgonRenderer clone them is 
// simplest.  If it is changing, passing in two and updating both
// yourself is simplest.
var cssObjectXpos = new THREE.CSS3DObject(divXpos);
var cssObjectXneg = new THREE.CSS3DObject(divXneg);
var cssObjectYpos = new THREE.CSS3DObject(divYpos);
var cssObjectYneg = new THREE.CSS3DObject(divYneg);
var cssObjectZpos = new THREE.CSS3DObject(divZpos);
var cssObjectZneg = new THREE.CSS3DObject(divZneg);
// the width and height is used to align things.
cssObjectXpos.position.x = 200.0;
cssObjectXpos.position.y = 0.0;
cssObjectXpos.position.z = 0.0;
cssObjectXpos.rotation.y = -Math.PI / 2;
cssObjectXneg.position.x = -200.0;
cssObjectXneg.position.y = 0.0;
cssObjectXneg.position.z = 0.0;
cssObjectXneg.rotation.y = Math.PI / 2;
// for Y
cssObjectYpos.position.x = 0.0;
cssObjectYpos.position.y = 200.0;
cssObjectYpos.position.z = 0.0;
cssObjectYpos.rotation.x = Math.PI / 2;
cssObjectYneg.position.x = 0.0;
cssObjectYneg.position.y = -200.0;
cssObjectYneg.position.z = 0.0;
cssObjectYneg.rotation.x = -Math.PI / 2;
// for Z
cssObjectZpos.position.x = 0.0;
cssObjectZpos.position.y = 0.0;
cssObjectZpos.position.z = 200.0;
cssObjectZpos.rotation.y = Math.PI;
cssObjectZneg.position.x = 0.0;
cssObjectZneg.position.y = 0.0;
cssObjectZneg.position.z = -200.0;
//no rotation need for this one
stage.add(cssObjectXpos);
stage.add(cssObjectXneg);
stage.add(cssObjectYpos);
stage.add(cssObjectYneg);
stage.add(cssObjectZpos);
stage.add(cssObjectZneg);
// the updateEvent is called each time the 3D world should be
// rendered, before the renderEvent.  The state of your application
// should be updated here.
app.updateEvent.on(function () {
    // get the pose of the "stage" to anchor our content. 
    // The "stage" defines an East-Up-South coordinate system 
    // (assuming geolocation is available).
    var stagePose = app.getEntityPose(app.stage);
    // set the pose of our THREE stage object
    if (stagePose.poseStatus & Argon.PoseStatus.KNOWN) {
        stage.position.copy(stagePose.position);
        stage.quaternion.copy(stagePose.orientation);
    }
});
app.renderEvent.on(function () {
    var viewport = app.view.viewport;
    var subViews = app.view.subviews;
    // if we have 1 subView, we're in mono mode.  If more, stereo.
    var monoMode = subViews.length == 1;
    // set the renderer to know the current size of the viewport.
    // This is the full size of the viewport, which would include
    // both views if we are in stereo viewing mode
    renderer.setSize(viewport.width, viewport.height);
    hud.setSize(viewport.width, viewport.height);
    // there is 1 subview in monocular mode, 2 in stereo mode
    for (var _i = 0, subViews_1 = subViews; _i < subViews_1.length; _i++) {
        var subview = subViews_1[_i];
        // set the position and orientation of the camera for 
        // this subview
        camera.position.copy(subview.pose.position);
        camera.quaternion.copy(subview.pose.orientation);
        // the underlying system provides a full projection matrix
        // for the camera.  Use it, and then update the FOV of the 
        // camera from it (needed by the CSS Perspective DIV)
        camera.projectionMatrix.fromArray(subview.frustum.projectionMatrix);
        camera.fov = subview.frustum.fovy * 180 / Math.PI;
        // set the viewport for this view
        var _a = subview.viewport, x = _a.x, y = _a.y, width = _a.width, height = _a.height;
        renderer.setViewport(x, y, width, height, subview.index);
        // render this view.
        renderer.render(scene, camera, subview.index);
        // adjust the hud, but only in mono
        if (monoMode) {
            hud.setViewport(x, y, width, height, subview.index);
            hud.render(subview.index);
        }
    }
});
