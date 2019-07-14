const nbButterflies = 2;
var conf, scene, camera, cameraCtrl, light, renderer;
var whw, whh;

var butterflies;
var bodyTexture, wingTexture1, wingTexture2, wingTexture3, bodyTexture4, wingTexture4;
var destination = new THREE.Vector3();

//<>var mouse = new THREE.Vector2();
//<>var mouseOver = false;
//<>var mousePlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
//<>var mousePosition = new THREE.Vector3();
//<>var raycaster = new THREE.Raycaster();

function init() {
  conf = {
    attraction: 0.03,
    velocityLimit: 1.2,
    move: true,
//<>    followMouse: true,
 //<>   shuffle: shuffle
  };

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
  cameraCtrl = new THREE.OrbitControls(camera);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  initScene();

  const gui = new dat.GUI();
  gui.add(conf, 'move');
//<>  gui.add(conf, 'followMouse');
  gui.add(conf, 'attraction', 0.01, 0.1);
  gui.add(conf, 'velocityLimit', 0.1, 2);
//<>  gui.add(conf, 'shuffle');
  gui.close();

  onWindowResize();
  window.addEventListener('resize', onWindowResize, false);

 //<> document.addEventListener('mousemove', onMouseMove, false);
 //<> // document.addEventListener('mouseover', function () { mouseOver = true; }, false);
 //<> document.addEventListener('mouseout', function () { mouseOver = false; }, false);

  animate();
};

function initScene() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);

  camera.position.z = 75;

  bodyTexture = new THREE.TextureLoader().load('https://klevron.github.io/codepen/butterflies/b1.png');
  wingTexture1 = new THREE.TextureLoader().load('https://klevron.github.io/codepen/butterflies/b1w.png');
  wingTexture2 = new THREE.TextureLoader().load('https://klevron.github.io/codepen/butterflies/b2w.png');
  wingTexture3 = new THREE.TextureLoader().load('https://klevron.github.io/codepen/butterflies/b3w.png');
  bodyTexture4 = new THREE.TextureLoader().load('https://klevron.github.io/codepen/butterflies/b4.png');
  wingTexture4 = new THREE.TextureLoader().load('https://klevron.github.io/codepen/butterflies/b4w.png');

  butterflies = [];
  for (var i = 0; i < nbButterflies; i++) {
    var b = new Butterfly();
    butterflies.push(b);
    scene.add(b.o3d);
  }

  //E: 10. this will call a Butterfly's property that modifies the trajectory of the butterflies into a circular one
  // The value parameters of the property are assigned at initialization and intrinsically updated during the animation
  // the target is a POSITION vector
  // IMPORTANT: it appears that the movement is then based on TWO vectors:
  // -- The velocity one, with an accompanying logic to control the extent of the distance to go and back (direction, magnitude)
  // -- The position one, which after being modified by velocity determines the amplitude of the movement (apparently an elipsoid)
  shuffle();
}

function animate() {
  requestAnimationFrame(animate);

  TWEEN.update();

  cameraCtrl.update();

  if (conf.move) {
    for (var i = 0; i < butterflies.length; i++) {
      butterflies[i].move();
    }
  }

  renderer.render(scene, camera);
};

function shuffle() {
  for (var i = 0; i < butterflies.length; i++) {
    butterflies[i].shuffle();
  }
}

function Butterfly() {
  //E: 7. initial setting of the range at which wings will flap
  this.minWingRotation = -Math.PI / 6;
  this.maxWingRotation = Math.PI / 2 - 0.1;
  this.wingRotation = 0;

  //E: 1. they will go always initially to a 0,0,0 destination but the initial velocity, which is positioning, is randomly assigned
  this.velocity = new THREE.Vector3(rndHELPER(1, true), rndHELPER(1, true), rndHELPER(1, true));
  //this.velocity = new THREE.Vector3(1, 1, 1);
  this.destination = destination;
  //console.log(this.destination, this.velocity);


  var confs = [
    { bodyTexture: bodyTexture, bodyW: 10, bodyH: 15, wingTexture: wingTexture1, wingW: 10, wingH: 15, wingX: 5.5 },
    { bodyTexture: bodyTexture, bodyW: 6, bodyH: 9, wingTexture: wingTexture2, wingW: 15, wingH: 20, wingX: 7.5 },
    { bodyTexture: bodyTexture, bodyW: 8, bodyH: 12, wingTexture: wingTexture3, wingW: 10, wingH: 15, wingX: 5.5 },
	{ bodyTexture: bodyTexture4, bodyW: 6, bodyH: 10, bodyY: 2, wingTexture: wingTexture4, wingW: 15, wingH: 20, wingX: 8 },
  ];

  this.init(confs[Math.floor(rndHELPER(4))]);
}

Butterfly.prototype.init = function (bconf) {
  var geometry = new THREE.PlaneGeometry(bconf.wingW, bconf.wingH);
  var material = new THREE.MeshBasicMaterial({ transparent: false, color: 'yellow', side: THREE.DoubleSide, depthTest: false });
  var lwmesh = new THREE.Mesh(geometry, material);
  lwmesh.position.x = -bconf.wingX;
  this.lwing = new THREE.Object3D();
  this.lwing.add(lwmesh);

  var rwmesh = new THREE.Mesh(geometry, material);
  rwmesh.rotation.y = Math.PI;
  rwmesh.position.x = bconf.wingX;
  this.rwing = new THREE.Object3D();
  this.rwing.add(rwmesh);

  geometry = new THREE.PlaneGeometry(bconf.bodyW, bconf.bodyH);
  material = new THREE.MeshBasicMaterial({ transparent: false, map: bconf.bodyTexture, side: THREE.DoubleSide, depthTest: false });
  this.body = new THREE.Mesh(geometry, material);
  if (bconf.bodyY) this.body.position.y = bconf.bodyY;
  // this.body.position.z = -0.1;

  this.group = new THREE.Object3D();
  this.group.add(this.body);
  this.group.add(this.lwing);
  this.group.add(this.rwing);
  this.group.rotation.x = Math.PI / 2;
  this.group.rotation.y = Math.PI;

  //E: 9. here he calls a function to set the initial position of the wings; ANY flapping WONT occur unless the tweening function / TWEEN.update are called!!
  this.setWingRotation(this.wingRotation);
  this.initTween();

  this.o3d = new THREE.Object3D();
  this.o3d.add(this.group);
};

Butterfly.prototype.initTween = function () {
  /*initialization*/
  var duration = limitHELPER(conf.velocityLimit - this.velocity.length(), 0.1, 1.5) * 1000;
  this.wingRotation = this.minWingRotation;
  
  
  //this.tweenWingRotation = new TWEEN.Tween(this)
  var tweenWingRotation = new TWEEN.Tween(this)
    .to({ wingRotation: this.maxWingRotation }, duration)
    .repeat(1)
    .yoyo(true)
    // .easing(TWEEN.Easing.Cubic.InOut)
    .onComplete(function(object) {
      object.initTween();
    })
    .start();
};

Butterfly.prototype.move = function () {
  //E: 2. an inner destination variable is defined (apparently no required BUT it is actually about creating a non-public variable)
  var _destination;
//<> if (mouseOver && conf.followMouse) {
//<>   //<>destination = mousePosition;
//<>   destination = this.destination;
//<>  } else {
    _destination = this.destination;
//<>  }
  
  //E: 3. a normalization will keep the WHOLE scene between -1,1; this aspects will be taken in account when defining limits
  var dv = _destination.clone().sub(this.o3d.position).normalize();
  //var dz = destination.clone().sub(this.o3d.position);
  //console.log(dv, dz)
  this.velocity.x += conf.attraction * dv.x;
  this.velocity.y += conf.attraction * dv.y;
  this.velocity.z += conf.attraction * dv.z;
  this.limitVelocity();

  // update position & rotation
  //E: 8. updating position 
  this.setWingRotation(this.wingRotation);
  //E: the following will change the status of o3d.position based on velocity
  this.o3d.lookAt(this.o3d.position.clone().add(this.velocity));
  this.o3d.position.add(this.velocity);
};

//E: 4. the function limitVelocity will be key to the tweening movement of the wings and the coming/go movement
Butterfly.prototype.limitVelocity = function () {
  this.velocity.x = limitHELPER(this.velocity.x, -conf.velocityLimit, conf.velocityLimit);
  this.velocity.y = limitHELPER(this.velocity.y, -conf.velocityLimit, conf.velocityLimit);
  this.velocity.z = limitHELPER(this.velocity.z, -conf.velocityLimit, conf.velocityLimit);
};

//E: 6. will control the directions of the flapping wings, which will oppose each other and over the y axis of WING SUB-OBJECTS
Butterfly.prototype.setWingRotation = function (y) {
  this.lwing.rotation.y = y;
  this.rwing.rotation.y = -y;
};

Butterfly.prototype.shuffle = function () {
  /*
  what is affected is the INITIAL POSITION
  */
  //affecting the following velocity vector apparently affect initial exit?
  //this.velocity = new THREE.Vector3(rndHELPER(1, true), rndHELPER(1, true), rndHELPER(1, true));
  var p = new THREE.Vector3(rndHELPER(1, true), rndHELPER(1, true), rndHELPER(1, true)).normalize().multiplyScalar(100);
  //console.log(this.velocity, p)
  this.o3d.position.set(p.x, p.y, p.z);
  var scale = rndHELPER(0.4) + 0.1;
  //var scale = 1;
  this.o3d.scale.set(scale, scale, scale);
}

/*********************
/*HELPERS
/*********************/

//E: 5.
function limitHELPER(coordval, minvalrange, maxvalrange) {
  /*
  E: this function is what it makes the flying object to move back and forward:
  it gets a value of a coordinate and a range
  from them, it will pick up the extreme value (min of max1, (max of mins))
  */
  return Math.min(Math.max(coordval, minvalrange), maxvalrange);
}

function rndHELPER(max, negative) {
  return negative ? Math.random() * 2 * max - max : Math.random() * max;
}

function onWindowResize() {
  whw = window.innerWidth / 2;
  whh = window.innerHeight / 2;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

//<>function onMouseMove(event) {
//<>  // if (cameraCtrl.getState()!=-1) return;
//<>
//<>  var v = new THREE.Vector3();
//<>  camera.getWorldDirection(v);
//<>  v.normalize();
//<>  // console.log(v);
//<>  mousePlane.normal = v;
//<>
//<>  mouseOver = true;
//<>  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//<>  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
//<>
//<>  raycaster.setFromCamera(mouse, camera);
//<>  raycaster.ray.intersectPlane(mousePlane, mousePosition);
//<>}

init();
