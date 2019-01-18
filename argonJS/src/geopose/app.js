/// <reference types="@argonjs/argon" />
/// <reference types="three" />
// grab some handles on APIs we use
var Cesium = Argon.Cesium;
var Cartesian3 = Argon.Cesium.Cartesian3;
var ReferenceFrame = Argon.Cesium.ReferenceFrame;
var JulianDate = Argon.Cesium.JulianDate;
var CesiumMath = Argon.Cesium.CesiumMath;
// set up Argon
var app = Argon.init();
//app.view.element.style.zIndex = 0;
// this app uses geoposed content, so subscribe to geolocation updates
app.subscribeGeolocation({ enableHighAccuracy: true });
// set up THREE.  Create a scene, a perspective camera and an object
// for the user's location
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera();
var user = new THREE.Object3D;
scene.add(camera);
scene.add(user);
// The CSS3DArgonRenderer supports mono and stereo views.  Currently
// not using it in this example, but left it in the code in case we
// want to add an HTML element near either geo object. 
// The CSS3DArgonHUD is a place to put things that appear 
// fixed to the screen (heads-up-display).  
// In this demo, we are  rendering the 3D graphics with WebGL, 
// using the standard WebGLRenderer, and using the CSS3DArgonHUD
// to manage the 2D display fixed content
var cssRenderer = new THREE.CSS3DArgonRenderer();
var hud = new THREE.CSS3DArgonHUD();
var renderer = new THREE.WebGLRenderer({
    alpha: true,
    logarithmicDepthBuffer: true,
    antialias: Argon.suggestedWebGLContextAntialiasAttribute
});
renderer.setPixelRatio(window.devicePixelRatio);
// Set the layers that should be rendered in our view. The order of sibling elements
// determines which content is in front (top->bottom = back->front)
app.view.setLayers([
    { source: renderer.domElement },
    { source: cssRenderer.domElement },
    { source: hud.domElement },
]);
// We put some elements in the index.html, for convenience. 
// Here, we retrieve the hud element and use hud.appendChild to append it and a clone 
// to the two CSS3DArgonHUD hudElements.  We are retrieve the two
// elements with the 'location' class so we can update them both.
var hudContent = document.getElementById('hud');
hud.appendChild(hudContent);
var locationElements = hud.domElement.getElementsByClassName('location');
//  We also move the description box to the left Argon HUD.  
// We don't duplicated it because we only use it in mono mode
var holder = document.createElement('div');
var hudDescription = document.getElementById('description');
holder.appendChild(hudDescription);
hudContent.appendChild(holder);
// All geospatial objects need to have an Object3D linked to a Cesium Entity.
// We need to do this because Argon needs a mapping between Entities and Object3Ds.
//
// Here we create two objects, showing two slightly different approaches.
//
// First, we position a cube near Georgia Tech using a known LLA.
//
// Second, we will position a cube near our starting location.  This geolocated object starts without a
// location, until our reality is set and we know the location.  Each time the reality changes, we update
// the cube position.
// create a 100m cube with a Buzz texture on it, that we will attach to a geospatial object at Georgia Tech
var buzz = new THREE.Object3D;
var loader = new THREE.TextureLoader();
loader.load('buzz.png', function (texture) {
    var geometry = new THREE.BoxGeometry(10, 10, 10);
    var material = new THREE.MeshBasicMaterial({ map: texture });
    var mesh = new THREE.Mesh(geometry, material);
    mesh.scale.set(100, 100, 100);
    buzz.add(mesh);
});
// have our geolocated object start somewhere, in this case 
// near Georgia Tech in Atlanta.
// you should probably adjust this to a spot closer to you 
// (we found the lon/lat of Georgia Tech using Google Maps)
var gatechGeoEntity = new Cesium.Entity({
    name: "Georgia Tech",
    position: Cartesian3.fromDegrees(-84.398881, 33.778463),
    orientation: Cesium.Quaternion.IDENTITY
});
var gatechGeoTarget = new THREE.Object3D;
gatechGeoTarget.add(buzz);
scene.add(gatechGeoTarget);
// create a 1m cube with a wooden box texture on it, that we will attach to the geospatial object when we create it
// Box texture from https://www.flickr.com/photos/photoshoproadmap/8640003215/sizes/l/in/photostream/
//, licensed under https://creativecommons.org/licenses/by/2.0/legalcode
var boxGeoObject = new THREE.Object3D;
var box = new THREE.Object3D();
// In a 6DOF reality(such as Tango-reality), create a box to put on the floor at the center of the stage
var floorBox = new THREE.Object3D();
var loader = new THREE.TextureLoader();
loader.load('box.png', function (texture) {
    // Set box size to 20 cm
    var geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    var material = new THREE.MeshBasicMaterial({ map: texture });
    var mesh = new THREE.Mesh(geometry, material);
    box.add(mesh);
    var geometry2 = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    var mesh2 = new THREE.Mesh(geometry2, material);
    floorBox.add(mesh2);
});
// Create a box that we indend to have geoposed. 
var geoBoxEntity = new Argon.Cesium.Entity({
    name: "I have a box",
    position: new Argon.Cesium.ConstantPositionProperty(undefined),
    orientation: new Argon.Cesium.ConstantProperty(undefined)
});
boxGeoObject.add(box);
// Set initial box position 2 meters in front of user
boxGeoObject.position.z = -2;
scene.add(boxGeoObject);
// A line between the two boxes
var lineGeometry = new THREE.Geometry();
lineGeometry.vertices.push(new THREE.Vector3());
lineGeometry.vertices.push(new THREE.Vector3());
var lineMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff });
var boxToboxLine = new THREE.Line(lineGeometry, lineMaterial);
// Create a DIV to use to label the position and distance of the cube
var boxLocDiv = document.getElementById("box-location");
var boxLocDiv2 = boxLocDiv.cloneNode(true);
var boxLabel = new THREE.CSS3DSprite([boxLocDiv, boxLocDiv2]);
boxLabel.scale.set(0.002, 0.002, 0.002);
boxLabel.position.set(0, 0.2, 0);
boxGeoObject.add(boxLabel);
// Create a DIV to use to label the box on the floor in 6DOF realities
var floorBoxLocDiv = document.getElementById("floorbox-location");
var floorBoxLocDiv2 = floorBoxLocDiv.cloneNode(true);
var floorBoxLabel = new THREE.CSS3DSprite([floorBoxLocDiv, floorBoxLocDiv2]);
floorBoxLabel.scale.set(0.002, 0.002, 0.002);
floorBoxLabel.position.set(0, 0.2, 0);
floorBox.add(floorBoxLabel);
// putting position and orientation in the constructor above is the 
// equivalent of doing this:
//
//     const boxPosition = new Cesium.ConstantPositionProperty
//                   (Cartesian3.ZERO.clone(), ReferenceFrame.FIXED);
//     boxGeoEntity.position = boxPosition;
//     const boxOrientation = new Cesium.ConstantProperty(Cesium.Quaternion);
//     boxOrientation.setValue(Cesium.Quaternion.IDENTITY);
//     boxGeoEntity.orientation = boxOrientation;
var boxCartographicDeg = [0, 0, 0];
var lastInfoText = "";
var lastBoxText = "";
var lastFloorBoxText = "";
// make floating point output a little less ugly
function toFixed(value, precision) {
    var power = Math.pow(10, precision || 0);
    return String(Math.round(value * power) / power);
}
// the updateEvent is called each time the 3D world should be
// rendered, before the renderEvent.  The state of your application
// should be updated here.
app.updateEvent.on(function (frame) {
    // get the user pose in the local coordinate frame.
    var userPose = app.getEntityPose(app.user);
    user.position.copy(userPose.position);
    user.quaternion.copy(userPose.orientation);
    // get the user pose relative to FIXED
    var userPoseFIXED = app.getEntityPose(app.user, ReferenceFrame.FIXED);
    // If user has a FIXED pose and our geoBoxEntity is not positioned relative to FIXED, 
    // try to convert its reference frame to FIXED
    if (userPoseFIXED.status & Argon.PoseStatus.KNOWN &&
        geoBoxEntity.position.referenceFrame !== ReferenceFrame.FIXED) {
        // now, we want to move the box's coordinates to the FIXED frame, so
        // the box doesn't move if the local coordinate system origin changes.
        Argon.convertEntityReferenceFrame(geoBoxEntity, frame.time, ReferenceFrame.FIXED);
    }
    // if the geoBoxEntity still does not have a known pose, 
    // place it 2 meters in front of the user, on the stage
    var geoBoxPose = app.getEntityPose(geoBoxEntity);
    if ((geoBoxPose.status & Argon.PoseStatus.KNOWN) === 0) {
        geoBoxEntity.position.setValue(new Cartesian3(0, 0, -2), app.user);
        geoBoxEntity.orientation.setValue(Cesium.Quaternion.IDENTITY);
        if (!Argon.convertEntityReferenceFrame(geoBoxEntity, frame.time, app.stage)) {
            console.warn('Unable to convert to stage frame!');
        }
    }
    // get the local coordinates of the local box, and set the THREE object
    var boxPose = app.getEntityPose(geoBoxEntity);
    if (geoBoxPose.poseStatus & Argon.PoseStatus.KNOWN) {
        boxGeoObject.position.copy(geoBoxPose.position);
        boxGeoObject.quaternion.copy(geoBoxPose.orientation);
        // update one end of the line to be at the local box
        lineGeometry.vertices[0].copy(geoBoxPose.position);
    }
    // get the local coordinates of the GT box, and set the THREE object
    var geoPose = app.getEntityPose(gatechGeoEntity);
    if (geoPose.poseStatus & Argon.PoseStatus.KNOWN) {
        gatechGeoTarget.position.copy(geoPose.position);
    }
    else {
        // initialize to a fixed location in case we can't convert to geospatial
        gatechGeoTarget.position.y = 0;
        gatechGeoTarget.position.z = -4000;
        gatechGeoTarget.position.x = 1000;
    }
    // add the additional box only in 6DOF realities
    if (app.userTracking === '6DOF') {
        // get the local coordinates of the local box, and set the THREE object
        var floorBoxPose = app.getEntityPose(app.context.floor);
        floorBox.position.copy(floorBoxPose.position);
        floorBox.quaternion.copy(floorBoxPose.orientation);
        // update the other end of the line to be at the floor box
        lineGeometry.vertices[1].copy(floorBoxPose.position);
        lineGeometry.verticesNeedUpdate = true;
        scene.add(floorBox);
        scene.add(boxToboxLine);
    }
    else {
        scene.remove(floorBox);
        scene.remove(boxToboxLine);
    }
    // rotate the boxes at a constant speed, independent of frame rates     
    // to make it a little less boring
    buzz.rotateY(2 * frame.deltaTime / 10000);
    box.rotateY(3 * frame.deltaTime / 10000);
    //
    // stuff to print out the status message.  It's fairly expensive to convert FIXED
    // coordinates back to LLA, but those coordinates probably make the most sense as
    // something to show the user, so we'll do that computation.
    //
    // we'll compute the distance to the cube, just for fun. If the cube could be further away,
    // we'd want to use Cesium.EllipsoidGeodesic, rather than Euclidean distance, but this is fine here.
    var userPos = user.getWorldPosition();
    var buzzPos = buzz.getWorldPosition();
    var boxPos = box.getWorldPosition();
    var boxPos2 = floorBox.getWorldPosition();
    var distanceToBox = userPos.distanceTo(boxPos);
    var distanceToBuzz = userPos.distanceTo(buzzPos);
    var distanceToBox2 = userPos.distanceTo(boxPos2);
    // cartographicDegrees is a 3 element array containing [longitude, latitude, height]
    var gpsCartographicDeg = [0, 0, 0];
    // create some feedback text
    var infoText = "Geospatial Argon example:<br>";
    // Why does user not move? check local movement & movement relative to fixed
    // get user position in global coordinates
    if (userPoseFIXED.poseStatus & Argon.PoseStatus.KNOWN) {
        var userLLA = Cesium.Ellipsoid.WGS84.cartesianToCartographic(userPoseFIXED.position);
        if (userLLA) {
            gpsCartographicDeg = [
                CesiumMath.toDegrees(userLLA.longitude),
                CesiumMath.toDegrees(userLLA.latitude),
                userLLA.height
            ];
            infoText += "Your location is lla (" + toFixed(gpsCartographicDeg[0], 6) + ", ";
            infoText += toFixed(gpsCartographicDeg[1], 6) + ", " + toFixed(gpsCartographicDeg[2], 2) + ")<br>";
        }
    }
    else {
        infoText += "Waiting for geolocation...<br>";
    }
    var geoBoxFixedPose = app.getEntityPose(geoBoxEntity, ReferenceFrame.FIXED);
    if (geoBoxFixedPose.poseStatus & Argon.PoseStatus.KNOWN) {
        var boxLLA = Cesium.Ellipsoid.WGS84.cartesianToCartographic(geoBoxFixedPose.position);
        if (boxLLA) {
            boxCartographicDeg = [
                CesiumMath.toDegrees(boxLLA.longitude),
                CesiumMath.toDegrees(boxLLA.latitude),
                boxLLA.height
            ];
        }
    }
    infoText += " distance to Buzz box @ GT (" + toFixed(distanceToBuzz, 2) + ")<br>";
    infoText += "box is " + toFixed(distanceToBox, 2) + " meters away";
    if (app.userTracking === '6DOF')
        infoText += "<br>floor-box is " + toFixed(distanceToBox2, 2) + " meters away";
    var boxLabelText;
    if (geoBoxFixedPose.poseStatus & Argon.PoseStatus.KNOWN) {
        boxLabelText = "a wooden box!<br>lla = " + toFixed(boxCartographicDeg[0], 6) + ", ";
        boxLabelText += toFixed(boxCartographicDeg[1], 6) + ", " + toFixed(boxCartographicDeg[2], 2) + "";
    }
    else {
        boxLabelText = "a wooden box!<br>Location unknown";
    }
    if (lastInfoText !== infoText) {
        locationElements[0].innerHTML = infoText;
        locationElements[1].innerHTML = infoText;
        lastInfoText = infoText;
    }
    if (lastBoxText !== boxLabelText) {
        boxLocDiv.innerHTML = boxLabelText;
        boxLocDiv2.innerHTML = boxLabelText;
        lastBoxText = boxLabelText;
    }
    // Add a label to the box on the floor
    if (app.userTracking === '6DOF') {
        var floorBoxLabelText = "a wooden box,<br>on the floor!";
        if (lastFloorBoxText !== floorBoxLabelText) {
            floorBoxLocDiv.innerHTML = floorBoxLabelText;
            floorBoxLocDiv2.innerHTML = floorBoxLabelText;
            lastFloorBoxText = floorBoxLabelText;
        }
    }
});
// renderEvent is fired whenever argon wants the app to update its display
app.renderEvent.on(function () {
    // set the renderers to know the current size of the viewport.
    // This is the full size of the viewport, which would include
    // both views if we are in stereo viewing mode
    var view = app.view;
    renderer.setSize(view.renderWidth, view.renderHeight, false);
    renderer.setPixelRatio(app.suggestedPixelRatio);
    var viewport = view.viewport;
    cssRenderer.setSize(viewport.width, viewport.height);
    hud.setSize(viewport.width, viewport.height);
    // There is 1 subview in monocular mode, 2 in stereo mode.
    // If we are in mono view, show the description.  If not, hide it, 
    if (app.view.subviews.length > 1) {
        holder.style.display = 'none';
    }
    else {
        holder.style.display = 'block';
    }
    // there is 1 subview in monocular mode, 2 in stereo mode    
    for (var _i = 0, _a = app.view.subviews; _i < _a.length; _i++) {
        var subview = _a[_i];
        var frustum = subview.frustum;
        // set the position and orientation of the camera for 
        // this subview
        camera.position.copy(subview.pose.position);
        camera.quaternion.copy(subview.pose.orientation);
        // the underlying system provide a full projection matrix
        // for the camera. 
        camera.projectionMatrix.fromArray(subview.frustum.projectionMatrix);
        // set the webGL rendering parameters and render this view
        // set the viewport for this view
        var _b = subview.renderViewport, x = _b.x, y = _b.y, width = _b.width, height = _b.height;
        renderer.setViewport(x, y, width, height);
        renderer.setScissor(x, y, width, height);
        renderer.setScissorTest(true);
        renderer.render(scene, camera);
        // set the viewport for this view
        var _c = subview.viewport, x = _c.x, y = _c.y, width = _c.width, height = _c.height;
        // set the CSS rendering up, by computing the FOV, and render this view
        camera.fov = THREE.Math.radToDeg(frustum.fovy);
        cssRenderer.setViewport(x, y, width, height, subview.index);
        cssRenderer.render(scene, camera, subview.index);
        // adjust the hud
        hud.setViewport(x, y, width, height, subview.index);
        hud.render(subview.index);
    }
});
