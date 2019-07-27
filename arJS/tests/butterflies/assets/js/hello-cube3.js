var scene, camera, cameraCtrl, light, renderer, clock, deltaTime, totalTime;
//var whw = window.innerWidth;
//var whh = window.innerHeight;
var wWidth = Math.max( 0, window.innerWidth || document.body.clientWidth || document.documentElement.clientWidth || 0 );
var wHeight = Math.max( 0, window.innerHeight || document.body.clientHeight || document.documentElement.clientHeight || 0 );;
var opacitybackground = 0.0;

function rnd(max, negative) {
  return negative ? Math.random() * 2 * max - max : Math.random() * max;
}

var arToolkitSource, arToolkitContext;

var markerRoot1, markerRoot2;

var mesh1;
const nbButterflies = 200;
var lengthB = 1;
var conf;
var butterflies;
var bodyTexture, wingTexture1, wingTexture2, wingTexture3, bodyTexture4, wingTexture4;
var destination = new THREE.Vector3();

var stats = new Stats();

initialize();

function initialize()
{
    
    conf = {
      attraction: 0.03,
      velocityLimit: 1.2,
      move: true,
      followMouse: true,
      shuffle: shuffle
    };
      
    function initButterflies(){
        camera.position.z = 75;
        butterflies = [];
        for (var i = 0; i < nbButterflies; i++) {
          var b = new Butterfly();
          butterflies.push(b);
          scene.add(b.o3d);
        }
      
        shuffle();
    };
    
    function shuffle() {
      for (var i = 0; i < butterflies.length; i++) {
        butterflies[i].shuffle();
      }
    }
    
    function Butterfly() {
      this.minWingRotation = -Math.PI / 6;
      this.maxWingRotation = Math.PI / 2 - 0.1;
      this.wingRotation = 0;
    
      this.velocity = new THREE.Vector3(rnd(1, true), rnd(1, true), rnd(1, true));
      this.destination = destination;
    
      var confs = [
                    {
                      //bodyTexture: new THREE.TextureLoader().load('https://klevron.github.io/codepen/butterflies/b1.png'),
                      bodyTexture: new THREE.TextureLoader().load('assets/grph/b1.png'),
                      bodyW: 10,
                      bodyH: 15,
                      //wingTexture: new THREE.TextureLoader().load('https://klevron.github.io/codepen/butterflies/b1w.png'),
                      wingTexture: new THREE.TextureLoader().load('assets/grph/b1w.png'),
                      wingW: 10, wingH: 15,
                      wingX: 5.5
                    },
                    {
                      //bodyTexture: new THREE.TextureLoader().load('https://klevron.github.io/codepen/butterflies/b1.png'),
                      bodyTexture: new THREE.TextureLoader().load('assets/grph/b1.png'),
                      bodyW: 6,
                      bodyH: 9,
                      //wingTexture: new THREE.TextureLoader().load('https://klevron.github.io/codepen/butterflies/b2w.png'),
                      wingTexture: new THREE.TextureLoader().load('assets/grph/b2w.png'),
                      wingW: 15,
                      wingH: 20,
                      wingX: 7.5
                    },
                    {
                      //bodyTexture: new THREE.TextureLoader().load('https://klevron.github.io/codepen/butterflies/b1.png'),
                      bodyTexture: new THREE.TextureLoader().load('assets/grph/b1.png'),
                      bodyW: 8,
                      bodyH: 12,
                      //wingTexture: new THREE.TextureLoader().load('https://klevron.github.io/codepen/butterflies/b3w.png'),
                      wingTexture: new THREE.TextureLoader().load('assets/grph/b3w.png'),
                      wingW: 10,
                      wingH: 15,
                      wingX: 5.5
                    },
                    {
                      //bodyTexture: new THREE.TextureLoader().load('https://klevron.github.io/codepen/butterflies/b4.png'),
                      bodyTexture: new THREE.TextureLoader().load('assets/grph/b4.png'),
                      bodyW: 6,
                      bodyH: 10,
                      bodyY: 2,
                      //wingTexture: new THREE.TextureLoader().load('https://klevron.github.io/codepen/butterflies/b4w.png'),
                      wingTexture: new THREE.TextureLoader().load('assets/grph/b4w.png'),
                      wingW: 15,
                      wingH: 20,
                      wingX: 8 },
      ];
    
      this.init(confs[Math.floor(rnd(4))]);
    }
    
    Butterfly.prototype.init = function (bconf) {
      var geometry = new THREE.PlaneGeometry(bconf.wingW, bconf.wingH);
      var material = new THREE.MeshBasicMaterial({
                                        transparent: true,
                                        //color: 'yellow',
                                        map: bconf.wingTexture,
                                        side: THREE.DoubleSide,
                                        depthTest: false
        });
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
      material = new THREE.MeshBasicMaterial({
                                        transparent: true,
                                        map: bconf.bodyTexture,
                                        side: THREE.DoubleSide,
                                        depthTest: false
        });
      this.body = new THREE.Mesh(geometry, material);
      if (bconf.bodyY) this.body.position.y = bconf.bodyY;
      // this.body.position.z = -0.1;
    
      this.group = new THREE.Object3D();
      this.group.add(this.body);
      this.group.add(this.lwing);
      this.group.add(this.rwing);
      this.group.rotation.x = Math.PI / 2;
      this.group.rotation.y = Math.PI;
    
      this.setWingRotation(this.wingRotation);
      this.initTween();
    
      this.o3d = new THREE.Object3D();
      this.o3d.add(this.group);
    };
    
    
    Butterfly.prototype.move = function () {
      var destination;
      destination = this.destination;
    
      var dv = destination.clone().sub(this.o3d.position).normalize();
      this.velocity.x += conf.attraction * dv.x;
      this.velocity.y += conf.attraction * dv.y;
      this.velocity.z += conf.attraction * dv.z;
      this.limitVelocity();
    
      // update position & rotation
      this.setWingRotation(this.wingRotation);
      this.o3d.lookAt(this.o3d.position.clone().add(this.velocity));
      this.o3d.position.add(this.velocity);
    };
    
    Butterfly.prototype.limitVelocity = function (y) {
      this.velocity.x = limit(this.velocity.x, -conf.velocityLimit, conf.velocityLimit);
      this.velocity.y = limit(this.velocity.y, -conf.velocityLimit, conf.velocityLimit);
      this.velocity.z = limit(this.velocity.z, -conf.velocityLimit, conf.velocityLimit);
    };
    
    Butterfly.prototype.setWingRotation = function (y) {
      this.lwing.rotation.y = y;
      this.rwing.rotation.y = -y;
    };
    
    Butterfly.prototype.initTween = function(){
      //console.error('in initTween', this.velocityLimit, this.velocity.length());
      var rangevel = conf.velocityLimit - this.velocity.length();
      var duration = limit(rangevel, 0.1, 1.5) * 1000;
      this.wingRotation = this.minWingRotation;
        this.tweenWingRotation = new TWEEN.Tween(this)
              .to({ wingRotation: this.maxWingRotation }, duration)
              .repeat(1)
              .yoyo(true)
              // .easing(TWEEN.Easing.Cubic.InOut)
              .onComplete(function(object) {
                object.initTween();
              })
              .start();
   }
    
    Butterfly.prototype.shuffle = function () {
      this.velocity = new THREE.Vector3(rnd(1, true), rnd(1, true), rnd(1, true));
      var p = new THREE.Vector3(rnd(1, true), rnd(1, true), rnd(1, true)).normalize().multiplyScalar(100);
      this.o3d.position.set(p.x, p.y, p.z);
      var scale = rnd(0.4) + 0.1;
      this.o3d.scale.set(scale, scale, scale);
    }
    
    function limit(number, min, max) {
      return Math.min(Math.max(number, min), max);
    }
    
    
    scene = new THREE.Scene();

	let ambientLight = new THREE.AmbientLight( 0xcccccc, 0.5 );
	scene.add( ambientLight );
				
	//camera = new THREE.Camera();
    camera = new THREE.PerspectiveCamera(50, wWidth / wHeight, 0.1, 1000);
    cameraCtrl = new THREE.OrbitControls(camera);	
    scene.add(camera);
    
	renderer = new THREE.WebGLRenderer({
		antialias : true,
		alpha: true
	});
	
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setClearAlpha(opacitybackground);
    //renderer.setClearColor(new THREE.Color('lightgrey'), 0)
    //renderer.setSize( 640, 480 ); //width, height
	renderer.setSize(wWidth, wHeight);
//    renderer.domElement.style.position = 'absolute'
//	renderer.domElement.style.top = '0px'
//	renderer.domElement.style.left = '0px'
    renderer.domElement.style["display"]  = "block";
    renderer.domElement.style["position"] = "fixed";
    //renderer.domElement.style["position"] = "absolute";
    renderer.domElement.style["width"]    = "100%";
    renderer.domElement.style["height"]   = "100%";
    renderer.domElement.style["top"] = '0px';
    renderer.domElement.style["left"] = '0px';
	document.body.appendChild( renderer.domElement );
    
    document.body.appendChild(stats.domElement);

	clock = new THREE.Clock();
	deltaTime = 0;
	totalTime = 0;
    

	////////////////////////////////////////////////////////////
	// setup arToolkitSource
	////////////////////////////////////////////////////////////

	arToolkitSource = new THREEx.ArToolkitSource({
		sourceType : 'webcam',
	});

	function onResize()
	{
		arToolkitSource.onResize()	
		arToolkitSource.copySizeTo(renderer.domElement)	
		if ( arToolkitContext.arController !== null )
		{
			arToolkitSource.copySizeTo(arToolkitContext.arController.canvas)	
		}	
	}

	arToolkitSource.init(function onReady(){
		onResize()
	});
	
	// handle resize event
	window.addEventListener('resize', function(){
		onResize()
	});
	
	////////////////////////////////////////////////////////////
	// setup arToolkitContext
	////////////////////////////////////////////////////////////	

	// create atToolkitContext
	arToolkitContext = new THREEx.ArToolkitContext({
		cameraParametersUrl: '../../arjs-resources/data/camera_para.dat',
		detectionMode: 'mono'
	});
	
	//// copy projection matrix to camera when initialization complete
	//arToolkitContext.init( function onCompleted(){
	//	camera.projectionMatrix.copy( arToolkitContext.getProjectionMatrix() );
	//});

	////////////////////////////////////////////////////////////
	// setup markerRoots
	////////////////////////////////////////////////////////////

	initButterflies();
    
    // build markerControls
	markerRoot1 = new THREE.Group();
	scene.add(markerRoot1);
	let markerControls1 = new THREEx.ArMarkerControls(arToolkitContext, markerRoot1, {
		type: 'pattern', patternUrl: "../../arjs-resources/data/hiro.patt",
	})

    
//	/*--- test volume ---*/
//    let geometry1	= new THREE.CubeGeometry(1,1,1);
//	let material1	= new THREE.MeshNormalMaterial({
//		transparent: true,
//		opacity: 0.5,
//		side: THREE.DoubleSide
//	}); 
//	
//	mesh1 = new THREE.Mesh( geometry1, material1 );
//	mesh1.position.y = 0.5;
//
//    
//	markerRoot1.add( mesh1 );
}

var smokeParticles = {};
var factoryObj;

function update1() //just a bit of house-keeping: moving some functionality not strictly related to animation here 
{
	console.log(111);
    deltaTime = clock.getDelta();
	totalTime += deltaTime;
    stats.update();
    cameraCtrl.update();
    TWEEN.update();
    
    //setInterval(function(){
    //  if (butterflies[0]) {
    //    scene.remove(butterflies[0].o3d);
    //    butterflies.shift();
    //    renderer.setClearAlpha(lengthB/(2*nbButterflies));
    //    lengthB += 1;
    //  };
    //},
    //1000 + deltaTime*rnd(40000));

    if (butterflies.length === 0) {
        console.log(333, butterflies[0]);
        scene.remove(camera);
        camera = new THREE.Camera();
        scene.add(camera);
        render();
        $('.sidenav').width(wWidth);

        // build markerControls
        markerRoot1 = new THREE.Group();
        scene.add(markerRoot1);
        let markerControls1 = new THREEx.ArMarkerControls(arToolkitContext, markerRoot1, {
            type: 'pattern', patternUrl: "../../arjs-resources/data/hiro.patt",
        });
        scene.add(markerRoot1);
        // copy projection matrix to camera when initialization complete
        factoryObj = new FactoryObj(markerRoot1);
        smokeParticles = {};
        for (let i=0;i < 100;i++){
          smokeParticles[i] = {particle:null, start:false}
          smokeParticles[i].particle = new Particle(markerRoot1);
        }; 
        arToolkitContext.init( function onCompleted(){
            camera.projectionMatrix.copy( arToolkitContext.getProjectionMatrix() );
        });
        //update2();

    }else{
        requestAnimationFrame(animate);
        render();
    }; 

    if (butterflies[0]) {
      if (Math.random() <= .05) {
        scene.remove(butterflies[0].o3d);
        butterflies.shift();
        renderer.setClearAlpha(lengthB/(1.25*nbButterflies));
        lengthB += 1;
      };
      if (conf.move) {
        for (var i = 0; i < butterflies.length; i++) {
          butterflies[i].move();
        }
      };
    };
}

/* Set the width of the side navigation to 0 */
function closeStart() {
  //document.getElementById("mySidenav2").style.width = "0";
  // Removes an element from the document
  var element = document.getElementById("mySidenav2");
  element.parentNode.removeChild(element);
  animate();
}


/* Set the width of the side navigation to 0 */
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  update2();
}

function update2() //just a bit of house-keeping: moving some functionality not strictly related to animation here 
{
	console.log(222);
    requestAnimationFrame(update2);
    deltaTime = clock.getDelta();
	totalTime += deltaTime;
    stats.update();
    
    
    for (let i = 0; i < 100; i++) {
      if (smokeParticles[i].start === false) {
        smokeParticles[i].start = Math.random() > .2? false:true;
        console.log(smokeParticles[i].start);
      }
      else {
        let s_a = smokeParticles[i].particle._particle;
        s_a.position.y += .01;
    
        if (s_a.position.y > 1.6){
            markerRoot1.remove(s_a);
            smokeParticles[i] = {particle:null, start:false}
            smokeParticles[i].particle = new Particle(markerRoot1);
        }
      }
    }
    
    if (!factoryObj) {
      factoryObj = new FactoryObj(markerRoot);
    }    
    
    
    // update artoolkit on every frame
	if ( arToolkitSource.ready !== false )
		arToolkitContext.update( arToolkitSource.domElement );
    render();
}

function render()
{
	renderer.render( scene, camera );
}


function animate()
{
    update1();
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function init() {



  onWindowResize();
  window.addEventListener('resize', onWindowResize, false);

};


/**********************
    FACTORY OBJECT
 ********************/

(function(){
 //constructor parameters
 
  var FactoryObj = function(markerRoot){
     this._subScene = markerRoot;
     this._textureLoader = new THREE.TextureLoader();
     this._textureLoad = this._textureLoader.load('./assets/PUSHILIN_factory.png');
     this._mtlLoader = new THREE.MTLLoader();
     this._objLoader = new THREE.OBJLoader();
     this._mtlLoader.setPath( 'assets/' );
     this._objLoader.setPath( 'assets/' );
     this._url = 'PUSHILIN_factory';
     this.to = {
       x: 0.0,
       y: -.5,
       z: -1.0
       };

     this.launch();
     //var e = this.launch()      
     //let f = (function(){
     //  console.log(111);
     //})()
       
     //launch;

   }      
  
  //console.log(FactoryObj.launch);
  
  //constructor prototyping: instantiation (constructor) and methods
  FactoryObj.prototype = {
    constructor : FactoryObj,
    
    launch : function(){
                //console.log(this);
                //console.log(new FactoryObj);
                //FactoryObj.prototype.mtlLoading;
                this.mtlLoading();
              },
    //mtlLoading : function(){
    //                  console.log(typeof this._mtlLoader);
    //                  //return this._mtlLoader(this._url+'.mtl', function(materials){
    //                  //                              materials.preload();
    //                  //                              console.log(this);
    //                  //                              //this.objLoader.setMaterials( materials );
    //                  //                              //this.objLoading;
    //                  //        })
    //              },
    mtlLoading : function(){ //<------------------------------------ `this` OBJECT WONT BE CORRECTLY POINTED IF THIS IS NOT A FUNCTION
                      //=*
                      //console.log(typeof this._mtlLoader.load);//<-- HERE STILL WORK BUT...
                      //*=
                      let zelf = this; //<----------------------------- RELEVANT: OTHER USES OF `this` BECOME `undefined`
                      
                      //=*
                      //HOW TO IMPROVE THE LINE ABOVE?
                      //1. IT COULD THOUGHT BY USING call/apply/bind (nicer)
                      //[code]this._mtlLoader.load.call(this, this._url+'.mtl', callback)
                      //
                      //   HOWEVER, I MIGHT NEED TO KNOW THE ACTUAL PROPERTY NAMES PASSED TO `xxxxx.load`? EG. https://www.w3schools.com/js/js_function_call.asp
                      //   IT DOESN'T READ THEM AS SIMPLE ARGUMENTS
                      //
                      //2. IT CAN BE DONE BY USING ES6 SYNTAX
                      //[code]()=>{}
                      //
                      //KEEPING CURRENT FORMAT...
                      //*=
                      zelf._mtlLoader.load(zelf._url+'.mtl', function(materials){ // this function doesn't require to return
                                                    //materials.preload();
                                                    //console.log(materials, z, z.objLoading);
                                                    zelf._objLoader.setMaterials( materials );
                                                    zelf.objLoading();
                              })                          
                  },
    objLoading : function(){
                    let zelf = this;
                    console.log(this); //<---- USEFUL...
                    zelf._objLoader.load(zelf._url+'.obj', function(obj) {
                        obj.position.x = zelf.to.x;
                        obj.position.y = zelf.to.y;
                        obj.position.z = zelf.to.z;
                        //https://stackoverflow.com/questions/39850083/three-js-objloader-texture
                        obj.traverse(function (child) {   // aka setTexture
                            if (child instanceof THREE.Mesh) {
                                child.material.map = zelf._textureLoad;
                            }
                        });                         
                        //console.log('who', this, z); //<---- USEFUL...
                        zelf._subScene.add(obj);
                        //z._render();
                      })
                  }
    
  };
  
  window.FactoryObj = FactoryObj;  
  
})();

//var a = new FactoryObj(console.log,console.log);
//console.log(a);



/**********************
  PSEUDO-PARTICLES OBJECTS
 ********************/

//(function(){
//   var Particle = function(markerRoot){
//     this._subScene = markerRoot;
//     this._particle = null;
//     this._sphereRadius = 0.1;
//     this.smokecolor = 0x44aa88;
//     this.smokex = -.189; //-.7
//     this.smokey = .55;
//     this.smokez = -1.71;
//     this.launch();
//   };
//   
//   Particle.prototype = {
//     constructor : Particle,
//     material: function(color){
//                 return new THREE.MeshBasicMaterial({color});
//               },
//     geometry: function(radius){
//                 return new THREE.SphereGeometry(radius);
//               },
//     launch : function(){
//                let z = this;
//                const mat = z.material(z._smokecolor);
//                //const geo = z.geometry(z.paramsobj.sphereRadius);
//                const geo = z.geometry(z._sphereRadius);
//                const mesh = new THREE.Mesh(geo, mat);
//                let _posx = Math.random()*.01*(Math.random() > .5? 1:-1);
//                let _posz = Math.random()*.01*(Math.random() > .5? 1:-1);
//                mesh.position.x = z._smokex + _posx;
//                mesh.position.y = z._smokey;
//                mesh.position.z = z._smokez + _posz;
//                z._subScene.add(mesh);
//                z._particle = mesh;
//             }
//   }
//   
//   window.Particle = Particle;
//
// })();


(function(){
  var Particle = function(markerRoot){
        this._subScene = markerRoot;
        this._particle = null;
        this._radius = 0.1;
        this._color = 0x44aa88;
        this._x = -.189; //-.7
        this._y = .55;
        this._z = -1.71;
        this.launch();
    };
  
  Particle.prototype = {
    constructor: Particle,
    material: function(){
        return new THREE.MeshBasicMaterial({color:0xbebebe});
      },
    geometry: function(radius){
        return new THREE.SphereGeometry(radius);
      },
    launch: function(){
        let zelf = this;
        let mat = zelf.material(zelf._color);
        let geo = zelf.geometry(zelf._radius);
        let mesh = new THREE.Mesh(geo, mat);
        let _diffx = Math.random()*.01*(Math.random() > .5? 1:-1);
        let _diffz = Math.random()*.01*(Math.random() > .5? 1:-1);
        mesh.position.x = zelf._x + _diffx;
        mesh.position.y = zelf._y;
        mesh.position.z = zelf._z + _diffz;
        //markerRoot.add(mesh);
        this._subScene.add(mesh);
        console.log('scene inside object', markerRoot1);
        zelf._particle = mesh;
    }
  };
  
  window.Particle = Particle;
  
})();



//function onWindowResize() {
//  whw = window.innerWidth / 2;
//  whh = window.innerHeight / 2;
//  camera.aspect = window.innerWidth / window.innerHeight;
//  camera.updateProjectionMatrix();
//  renderer.setSize(window.innerWidth, window.innerHeight);
//}
//
//
//init();