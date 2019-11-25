/*
--- _createClass and _classCheck are util functions
--- _createClass seems to be a factory or a builder
--- _classCallCheck is a private function to check for class as a function (function instantiated as Constructor in this case)
*/

const statsGlobal = new Stats();
//const guiGlobal = new dat.GUI();
//guiGlobal.close();

/**********************
  CLASS CREATOR
 ********************/   

var _createClass = function () {
                      function defineProperties(target, props) {
                        for (var i = 0; i < props.length; i++) {
                          var descriptor = props[i];
                          descriptor.enumerable = descriptor.enumerable || false;
                          descriptor.configurable = true;
                          if ("value" in descriptor) descriptor.writable = true;
                          //target: either Constructor.prototype or just Constructor; descriptor.key == 'key'; descriptor == (key,value) object with method or static property
                          Object.defineProperty(target, descriptor.key, descriptor);
                        }
                      }
                      return function (Constructor, protoProps, staticProps) { //proto are methods; static are variables
                        if (protoProps) defineProperties(Constructor.prototype, protoProps);
                        if (staticProps) defineProperties(Constructor, staticProps);
                        return Constructor;
                      };
                    }();

function _classCallCheck(instance, Constructor) {
                      if (!(instance instanceof Constructor)) {
                        throw new TypeError("Cannot call a class as a function");
                      }
                    };

/**********************
  EMITTER INTERFACE
 ********************/ 


(function() {
  //a simple synchronous emitter interface based on https://netbasal.com/javascript-the-magic-behind-event-emitter-cce3abcbcef9
  var  CustomEventEmitter = function(){
    this.events = {};
  };
  
  CustomEventEmitter.prototype ={
      constructor: CustomEventEmitter,
      emit: function(eventName, data){ //create an emit event and associate it to a function
              var event = this.events[eventName];
              if( event ) {
                event.forEach(fn => {
                  fn.call(null, data);
                });
              }        
            },
      subscribe: function(eventName, fn){ //register the emit event so it can be used later
              if(!this.events[eventName]) {
                this.events[eventName] = []; //for a new event to be registered, make a list of functions associated to it
              };
              this.events[eventName].push(fn);
              return (function(){ this.events[eventName] = this.events[eventName].filter(eventFn => fn !== eventFn); }).bind(this);
            },
        //to unsubscribe an emitter do:
        //  var unsubscribe = emitter.subscribe(eventName, data);
        //  unsubscribe();
  };
  
  window.CustomEventEmitter = CustomEventEmitter;
  
})();


/**********************
  ZDOG animation
 ********************/   


//CANVAS 1. Parameter initialization
var illoElem = document.querySelector('#section1in3--zdog-canvas');
const illoSize = 230;
const minWindowSize = Math.min(window.innerWidth, window.innerHeight);
const zoomSize = (minWindowSize / illoSize);
const zoom = (zoomSize < 1) ? zoomSize : Math.floor(zoomSize);

//ZDOG 1. Initialize animation parameters (eg. rotation)
const sceneStartRotation = { x: 0.25, y: 0.2};
const TAU = Zdog.TAU; // == 2*Pi
let isSpinning = true;
const c_01 = '#e89e21';
const c_02 = '#b52f24';
const c_03 = '#fffffd';
const c_04 = '#713b39';
const c_05 = '#fae3d9';


//CANVAS 2. Parameter initialization (cont)
illoElem.setAttribute('width', (illoSize * zoom) + 20);
illoElem.setAttribute('height', (illoSize * zoom) - 20);


//ZDOG 2. Instance of ZDOG - affects CANVAS; global configuration (includes zooming, dragging and rotation)
var illo = new Zdog.Illustration( {
	element: illoElem,
 rotate: sceneStartRotation,
	zoom: zoom/1.5,
	dragRotate: true,
	onDragStart: function() {
		isSpinning = false;
	},
	onDragEnd: function() {
		isSpinning = true;
	},
});

//ZDOG 3. Instantiation of a GROUP using an anchor (An VOID item that can be added to another item, and have other items added to it.)
const shroom = new Zdog.Anchor({
	addTo: illo,
	rotate: { x: TAU/4.4, z: -TAU/20 },
});

//ZDOG 4. Instantion of parts of the figure, each added to a PARENT shape
const cap = new Zdog.Hemisphere({
	addTo: shroom,
	diameter: 160,
	stroke: 10,
	color: c_01,
	backface: c_04,
});

// Let's draw the schroom's gills as well
new Zdog.Ellipse({
	addTo: shroom,
	diameter: 160,
	stroke: 10,
	color: c_04,
	fill: true,
});

const stem = new Zdog.Cylinder({
	addTo: shroom,
	diameter: 80,
	length: 100,
	stroke: false,
	color: c_03,
	translate: { z: -50 },
	backface: c_04,
});

const scalesZ = (cap.diameter / 2);
const scalesAnchor = new Zdog.Anchor({
	addTo: cap,
	translate: { z: scalesZ },
});
const aTop = new Zdog.Hemisphere({
	addTo: scalesAnchor,
 diameter: 15,
 stroke: 10,
	color: c_02,
	translate: { z: 5 },
	/*backface: c_02,*/
});

const aScale = new Zdog.Ellipse({
	addTo: scalesAnchor,
 diameter: 30,
 stroke: 10,
	color: c_02,
	translate: { z: 5 },
	backface: c_02
});
aScale.copy({
 diameter: 4,
 stroke: 10,
	translate: { 
		x: (scalesZ / 1.3), 
		y: 40,
		z: (scalesZ / -1.8) 
	},
});
aScale.copy({
 diameter: 4,
 stroke: 10,
	translate: { 
		x: -75, 
		y: -10,
		z: (scalesZ / -1.7) 
	},
});
aScale.copy({
 diameter: 4,
 stroke: 10,
	translate: { 
		y: 73,
		z: (scalesZ / -2)
	},
});
aScale.copy({
 diameter: 4,
 stroke: 10,
	translate: { 
		x: (scalesZ / -2.7),
		y: (scalesZ / -1.1), 
		z: (scalesZ / -1.3) 
	},
});
aScale.copy({
 diameter: 4,
 stroke: 10,
	translate: { 
		x: (scalesZ / -1.8),
		y: (scalesZ * 0.75),
		z: (scalesZ / -1.5) 
	},
});
aScale.copy({
 diameter: 4,
 stroke: 10,
	translate: { 
		x: (scalesZ / 1.8),
		y: (scalesZ * -0.75),
		z: (scalesZ / -1.7) 
	},
});
aScale.copy({
 diameter: 4,
 stroke: 10,
	translate: { 
		x: 53,
		y: -10,
		z: -20
	},
});
aScale.copy({
 diameter: 4,
 stroke: 10,
	translate: { 
		x: -34,
		y: -40,
		z: -15
	},
});
aScale.copy({
 diameter: 4,
 stroke: 10,
	translate: { 
		x: -40,
		y: 20,
		z: -10
	},
});
aScale.copy({
 diameter: 4,
 stroke: 10,
	translate: { 
		x: 30,
		y: 30,
		z: -8
	},
});
aScale.copy({
 diameter: 4,
 stroke: 10,
	translate: { 
		x: 80,
		z: -60
	},
});
aScale.copy({
 diameter: 4,
 stroke: 10,
	translate: { 
		x: 10,
		y: -50,
		z: -17
	},
});

	//eye
	var left_eye = new Zdog.Ellipse({
		addTo: scalesAnchor,
		width: 5,
		height: 20,		
		fill: true,
		color: 'black',
		translate: {x: 9, y: 65, z: -30},
  rotate: {x: Math.PI/1.4}
	});

	var right_eye = new Zdog.Ellipse({
		addTo: scalesAnchor,
		width: 5,
		height: 20,		
		fill: true,
		color: 'black',
		translate: {x: -9, y: 65, z: -30},
  rotate: {x: Math.PI/1.4}
	});

	//eyebrow
	var eyebrow = new Zdog.Ellipse({
		addTo: scalesAnchor,
		diameter: 6,
		quarters: 2,
		color: 'black',
		translate: {x: -9, y: 50, z: -15},
		rotate: {z: -TAU/4, x: -Math.PI/2},
		stroke: 1.5
	});

	eyebrow.copy({
		translate: {x: 9, y: 50, z: -15},
  //rotate: {y:3*Math.PI/4, z: TAU/5, x: Math.PI/4}
	});

	//mouth
	var mouth = new Zdog.Ellipse({
		addTo: scalesAnchor,
		diameter: 40,
		quarters: 2,
		//closed: true,
		//fill: true,
		color: 'brown',
		//translate: {y: 80, z: -50},
		//rotate: { z: TAU/4, x: -Math.PI/2.3 },
  translate: {y: 80, z: -70},
		rotate: { x: Math.PI/1.8, z: TAU/4 },
		//backface: false,
  backface:'brown',
	});
    
//const aScale2 = new Zdog.Shape({
//	addTo: scalesAnchor,
//	stroke: 12,
//	color: 'blue',
//	translate: { z: 5 },
//	backface: c_02,
//});

//aScale2.copy({
//	stroke: 22,
//	translate: { 
//		x: 10,
//		y: 30,
//		z: -70
//	},
//});

	// ---- GSAP ---- //
 //GSAP 1. instantiation and global configuration
const tlEyes = new TimelineMax({repeat: -1, repeatDelay: 2});

//GSAP 2. local (object-specific) initialization
const animationObject = {
 LeftEyeHeight: 20,
 RightEyeHeight: 20
};

//GSAP 3. local (object-specific) animation (start-end)
tlEyes.to(animationObject, .1, {
		LeftEyeHeight: .1,
		RightEyeHeight: .1
	})
	.to(animationObject, .1,{
		LeftEyeHeight: 20,
		RightEyeHeight: 20
	})
	.to(animationObject, .1, {
		LeftEyeHeight: .1,
		RightEyeHeight: .1
	})
	.to(animationObject, .1,{
		LeftEyeHeight: 20,
		RightEyeHeight: 20
	})

 //ZDOG ANIMATION SECTION
 //ZDOG 5. public variable declaration (eg. time)
 let t = 0;

function render_zdog(){

  
  //GSAP
  //GSAP 4. value assigned to object (!) 
		left_eye.height = animationObject.LeftEyeHeight; 
		right_eye.height = animationObject.RightEyeHeight;
		
  //GSAP 5. canvas update
  left_eye.updatePath();
  right_eye.updatePath();


  //if set to spin...
  if (isSpinning) {
   //ZDOG 6. update time variable
   t += 1/240;
   
   //ZDOG 7. estimate parameters based on time (in this case, rotation)
   const theta = Zdog.easeInOut(t % 1) * TAU;
   
   //ZDOG 8. interpolation (trigonometric one)
   illo.rotate.y = (Math.cos(theta) / -3);
   //console.log(111);
	 }  
    
  
  //ZDOG 9. re-rendering of the whole figure
		illo.updateRenderGraph(); 
}

var tlMaster;


/**********************
  CUBE OBJECT
 ********************/                    

                    
/**********************
  BUTTERFLY OBJECT
 ********************/
                    
var Butterfly = function () {
    //E:
    /*  FUNCTION OBJECT: Smoke */
    function Butterfly(options) {

      _classCallCheck(this, Butterfly); //E: this is in this case var Smoke defined AS GLOBAL; the question is if that variable is defined as Smoke Constructor
      
      
      var defaults = {
        lwing: new THREE.Object3D(),
        rwing: new THREE.Object3D(),
        meshObj:new THREE.Object3D(),
        confBodyWings: [
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
                  ],
        destination: new THREE.Vector3(),
        minWingRotation: -Math.PI / 6,
        maxWingRotation: Math.PI / 2 - 0.1,
        wingRotation: 0,
        velocity: new THREE.Vector3(),
        velocityLimit: 1.2,
        attraction: 0.03
      };

      //<>gui.add(conf, 'move');
      //<>gui.add(conf, 'followMouse');
      //<>gui.add(conf, 'shuffle');
  
      //add objects to a target one (the first argument)
      Object.assign(this, options, defaults);
      this.init();
    }
  
    //E: it is HERE where the Constructor type is assigned and the real class created
    // notice that the design by this author consists in passing all the properties as OBJECTS to the FACTORY
    _createClass(Butterfly, [
            { 
            key: 'init',
            value: function init() {
                    //console.error('velocity', this.velocity)
                    this.velocity.set(this.rndHELPER(1, true), this.rndHELPER(1, true), this.rndHELPER(1, true));
                    
                    var bconf = this.confBodyWings[Math.floor(this.rndHELPER(4))];
                    
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
                    this.lwing.add(lwmesh);
                  
                    var rwmesh = new THREE.Mesh(geometry, material);
                    rwmesh.rotation.y = Math.PI;
                    rwmesh.position.x = bconf.wingX;
                    this.rwing.add(rwmesh);
                  
                    geometry = new THREE.PlaneGeometry(bconf.bodyW, bconf.bodyH);
                    material = new THREE.MeshBasicMaterial({
                                        transparent: true,
                                        map: bconf.bodyTexture,
                                        side: THREE.DoubleSide,
                                        depthTest: false
                                      });
                    var body = new THREE.Mesh(geometry, material);
                    if (bconf.bodyY) body.position.y = bconf.bodyY;
                    
                    var group = new THREE.Object3D();
                    group.add(body);
                    group.add(this.lwing);
                    group.add(this.rwing);
                    group.rotation.x = Math.PI / 2;
                    group.rotation.y = Math.PI;
                    
                    this.setWingRotation(this.wingRotation);
                    this.initTween();
                    
                    this.meshObj.add(group);
                    
                }
            },
            {
            key: 'mesh',
            value: function mesh(){
                return meshObj
              }
            },
            {
             key: 'initTween',
             value: function initTween(){
                //console.error('in initTween', this.velocityLimit, this.velocity.length());
                var rangevel = this.velocityLimit - this.velocity.length();
                var duration = this.limitHELPER(rangevel, 0.1, 1.5) * 1000;
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
            },
            {
             key: 'setWingRotation',
             value: function setWingRotation(y){
                this.lwing.rotation.y = y;
                this.rwing.rotation.y = -y;
             }
            },
            {
             key: 'move',
             value: function move(){
                var destination = this.destination;
                var dv = this.destination.clone().sub(this.meshObj.position).normalize();
                this.velocity.x += this.attraction * dv.x;
                this.velocity.y += this.attraction * dv.y;
                this.velocity.z += this.attraction * dv.z;
                this.limitVelocity.bind(this);
                this.setWingRotation(this.wingRotation);
                this.meshObj.lookAt(this.meshObj.position.clone().add(this.velocity));
                this.meshObj.position.add(this.velocity);
             }
            },
            {
             key: 'limitVelocity',
             value: function limitVelocity(){
                this.velocity.x = this.limitHELPER(this.velocity.x, -this.velocityLimit, this.velocityLimit);
                this.velocity.y = this.limitHELPER(this.velocity.y, -this.velocityLimit, this.velocityLimit);
                this.velocity.z = this.limitHELPER(this.velocity.z, -this.velocityLimit, this.velocityLimit);
             }
            },
            {
             key: 'shuffleHELPER',
             value: function shuffleHELPER(){
                var p = new THREE.Vector3(this.rndHELPER(1, true), this.rndHELPER(1, true), this.rndHELPER(1, true)).normalize().multiplyScalar(100);
                this.meshObj.position.set(p.x, p.y, p.z);
                var scale = this.rndHELPER(0.4) + 0.1;
                this.meshObj.scale.set(scale, scale, scale);
             }
            },
            {
             key: 'limitHELPER',
             value: function limitHELPER(number, minL, maxL){
                return Math.min(Math.max(number, minL), maxL);
             }
            },
            {
             key: 'rndHELPER',
             value: function rndHELPER(max, negative){
                return negative ? Math.random() * 2 * max - max : Math.random() * max;
              }
             },
            {
             key: 'velocitySetter',
             value: function velocityChange(newvel){
               this.velocityLimit = newvel;
             }
            },
      ]);
  
    //E: return the class!
    return Butterfly;
}(); //<--- run ALL the functions at instantiation

/**********************
    FACTORY OBJECT
 ********************/

(function(){
 //constructor parameters
 
  //var FactoryObj = function(markerRoot){
  //   this._subScene = markerRoot;
  var FactoryObj = function(mr){
     this._subScene = mr;
     //this._subScene = null;
     //this._subScene = function(o){return new Promise(function(resolve,reject){if(o){resolve(o)}else{reject(null)}})};
     this._Object = null;
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
     //this.localCliping = new THREE.Plane( new THREE.Vector3( 1, 0, 0 ), 0 );
     //this._subScene.add(this.localCliping);

     this.launch();

   }      
  
  //console.log(FactoryObj.launch);
  
  //constructor prototyping: instantiation (constructor) and methods
  FactoryObj.prototype = {
    constructor : FactoryObj,
    
    launch : function(){
                this.mtlLoading();
              },
    mtlLoading : function(){
                      let zelf = this;
                      zelf._mtlLoader.load(zelf._url+'.mtl', function(materials){
                                                    zelf._objLoader.setMaterials( materials );
                                                    zelf.objLoading();
                              })                          
                  },
    objLoading : function(){
                    let zelf = this;
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
                        obj.name = "factory1";
                        zelf._subScene.add(obj); //because it is async... :(
                        var p = new Promise(function(resolve, reject){
                            resolve(obj);
                          });
                        //console.log(4444, obj);
                        p.then((o)=>{
                          zelf._Object = o;
                          })
                        //console.error(zelf);
                        //zelf._subScene = obj;
                        //zelf._subScene = zelf._subScene(obj);
                        //zelf._Object = obj;
                        //console.error('1111', zelf._subScene(obj));
                      })
                  }
    
  };
  
  window.FactoryObj = FactoryObj;  
  
})();


/**********************
  PSEUDO-PARTICLES OBJECTS
 ********************/

(function(){
  //var Particle = function(markerRoot){
  //      this._subScene = markerRoot;
  var Particle = function(){
        this._subScene = null;
        this._particle = null;
        this._radius = 0.1;
        //this._color = 0x44aa88;
        this._x = -.189; //-.7
        this._y = .55;
        this._z = -1.71;
        this.launch();
    };
  
  Particle.prototype = {
    constructor: Particle,
    material: function(){
        //return new THREE.MeshBasicMaterial({color:0xbebebe});
        //https://www.htmlcsscolor.com/hex/BEBEBE
        return new THREE.MeshBasicMaterial({color:0x323232});
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
        //console.log('scene inside object', markerRoot1);
        //zelf._particle = mesh;
        //zelf._subScene.add(mesh);
        zelf._subScene = mesh;
    }
  };
  
  window.Particle = Particle;
  
})();



/**********************
  APP MODULE
 ********************/

var app = (function APPmodule(){
            /*--- misc var ---*/
            var _optionsGlobal;
            var _ctxGraphics;
            var _canvasWidthGraphics;
            var _canvasHeightGraphics;
            var _app_vid;
            var scene;
            var clock;
            var globalWidth;
            var globalHeight;
            var cameraCtrl;


  /////////////////////////////////////////////////////
  /// sceneelements1 == scene2html, scene3html: initialization of the AR.js / THREE.js; initial butterflies and introduction to the "story"; calls sceneelements2
  /////////////////////////////////////////////////////            
            var changeAlpha = true;
            var sceneelements1 = {
              renderer: null,
              camera: null,
              //cameraCtrl: null,
              opacitybackground: 0.0,
              arToolkitSource: null,
              shader: true,
              composer: null,
              init: function(){
                          this.renderer = this.renderer_init();
                          this.camera = this.camera_init();
                          this.camera.position.z = 5;
                          cameraCtrl = new THREE.OrbitControls(this.camera);
                          scene.add(this.camera);
                          //sceneelements1.cameraCtrl = sceneelements1.cameraCtrls1_init.orbit.call(sceneelements1);
                          
                          scene.add(this.lights_init.ambient());
                          this.objects.bttfls_init();
                          
                          document.body.appendChild(this.renderer.domElement);
                          window.addEventListener('onresize', this.listeners_init.onResize.bind(this));
                    
                    },
              initAR: function(){
                
                          /*CHECKS*/
                          //console.log(Butterfly);

                          /*
                          //TEST OBJECT
                          let geometry1	= new THREE.CubeGeometry(1,1,1);
                          let material1	= new THREE.MeshNormalMaterial({
                              transparent: true,
                              opacity: 0.5,
                              side: THREE.DoubleSide
                          }); 
                          
                          var mesh1 = new THREE.Mesh( geometry1, material1 );
                          mesh1.position.y = 0.5;
                          mesh1.rotation.y = Math.PI/4;
                          scene.add(mesh1);
                          */                          
                          
                          /**************/
                          //$("#intro_text2").hide();
                          $("#section1in2--content2").css("opacity", 0.0);
                          $("#scene2html").css("display","inline-block");
                          this.renderer = this.renderer_init();
                          this.camera = this.camera_init();
                          this.camera.position.z = 35;
                          cameraCtrl = new THREE.OrbitControls(this.camera);
                          scene.add(this.camera);
                          scene.add(this.lights_init.ambient());


                          
                          this.objects.bttfls_init();
                          
                          document.body.appendChild(this.renderer.domElement);
                          //window.addEventListener('onresize', this.listeners_init.onResize.bind(this));
                          ////E: a simple solution for onResize not look for the window scope from arToolkitSource.onResizeElement() method in onResize listener,
                          //// needed a wrapper function, and to pass context as argument to onResize after context normalization (`var zelf = this`)
                          ////https://stackoverflow.com/questions/1338599/the-value-of-this-within-the-handler-using-addeventlistener
                          ////console.error(this);
                          ////onResize.bind(this); //trying binding `this` to onResize didn't work :(
                          this.arToolkitSource = new THREEx.ArToolkitSource({ //arToolkitSource for camera search can be set as window
                              sourceType : 'webcam',
                          });
                          var zelf = this;
                          var onResize = this.listeners_init.onResizeAR;
                          function intheeventlistenerhandler(){
                              onResize(zelf);  
                          }                     
                          
                          this.arToolkitSource.init(function onReady(){
                              intheeventlistenerhandler();
                          });
                          
                          // handle resize event
                          window.addEventListener('resize', intheeventlistenerhandler); 
                          
                          ////////////////////////////////////////////////////////////
                          // running ZDOG animation
                          ////////////////////////////////////////////////////////////	
                          
                          //GSAP 6. Master instantiation for onUpdate
                          tlMaster = new TimelineMax({onUpdate: render_zdog});
                        
                          //GSAP 7. add animation instance to Master instance
                          tlMaster.add(tlEyes);
                          
                          //console.log(1111, tlMaster);
                   
                    },
              renderer_init: function(){
                            var renderer = new THREE.WebGLRenderer({
                                antialias : true,
                                alpha: true
                            });
                            renderer.setPixelRatio( window.devicePixelRatio );
                            renderer.setClearAlpha(this.opacitybackground);
                            renderer.setSize(globalWidth, globalHeight); //set CANVAS size
                            renderer.domElement.style["display"]  = "block";
                            renderer.domElement.style["position"] = "fixed";
                            renderer.domElement.style["width"]    = globalWidth; //set RENDERING AREA size (not the same as canvas size!); it can overflow the canvas size.
                            renderer.domElement.style["height"]   = globalHeight;
                            renderer.domElement.style["top"] = '0px';
                            renderer.domElement.style["left"] = '0px'; 
                            return renderer;                        
                      },
              camera_init: function(){
                    var cam = new THREE.PerspectiveCamera(50, globalWidth / globalHeight, 0.1, 1000);
                    cam.name = "perspectivecamerascene1"
                    return cam;
                      },
              lights_init: {
                          ambient: function(){
                            var ambient = new THREE.AmbientLight( 0xcccccc, 1.5 );
                            ambient.name = "ambientlight1scene1"
                            return ambient;
                          },
                      },
              cameraCtrls_init: {
                          orbit: function(){
                            var camera = this.camera;
                            var orbit = new THREE.OrbitControls(camera);
                            orbit.name = "orbitcontrolscene1"
                            return orbit
                            }
                      },
              listeners_init: {
                onResize: function(){
                    var camera = this.camera;
                    camera.aspect = globalWidth / globalHeight;
                    camera.updateProjectionMatrix();
                    this.renderer.setSize(globalWidth , globalHeight);
                },
                onResizeAR: function(t){
                    //console.error(t);
                    t.arToolkitSource.onResizeElement(); //this function involves a non-explicit while-loop that is hard to handle with `this`!!	
                    t.arToolkitSource.copyElementSizeTo(t.renderer.domElement);
                    if ( t.arToolkitContext !== undefined && t.arToolkitContext.arController !== null )
                    {
                        //console.log(t.arToolkitContext.arController);
                        t.arToolkitSource.copyElementSizeTo(t.arToolkitContext.arController.canvas)	
                    } else { // is this ok???
                        var camera = t.camera;
                        camera.aspect = globalWidth / globalHeight;
                        camera.updateProjectionMatrix();
                        //t.renderer.setSize(globalWidth , globalHeight);
                    };

                },
              },
              objects: {
                butterflies : [],
                
                nbButterflies: 50,
                
                bttfls_init : function(){
                    for(let i = 0; i < this.butterflies.length; i++){
                            scene.remove(this.butterflies[i].meshObj);
                    };
                    this.butterflies = [];
                                   
                     
                    const nbButterflies = this.nbButterflies;
                    
                    function shuffle(_b){
                        for (var i = 0; i < _b.length; i++) {
                          _b[i].shuffleHELPER();
                        };
                    };
                    
                    for (var i = 0; i < nbButterflies; i++) {
                      var b = new Butterfly();
                      this.butterflies.push(b);
                      b.meshObj.name = "butterfly"+i;
                      scene.add(b.meshObj);
                    };
                   
                    shuffle(this.butterflies);
                    //console.log(this.butterflies);                  
                }
                
              },
              update: function(){
                    var zelf = this;
                    //console.error(zelf.objects1.butterflies.length);
                    //statsGlobal.begin();
                    compatibility.requestAnimationFrame(this.update.bind(this));
                    //this.cameraCtrl.update();
                    cameraCtrl.update();
                    TWEEN.update();
                    for (var i = 0; i < this.objects.butterflies.length; i++) {
                      this.objects.butterflies[i].move();
                    };
                    //statsGlobal.end();
                    this.renderer.render(scene, this.camera);
              },
              updateAR: function(){
                    var zelf = this;
                    if (changeAlpha) {
                      if (($("#section1in2--content1").css("opacity") - 1/800) <= 0) {
                        //code
                        $("#section1in2--content1").hide();
                        $("#section1in2--content2").css("opacity", 1.0);
                        changeAlpha = false;
                      }else{
                        $("#section1in2--content1").css("opacity", $("#section1in2--content1").css("opacity") - 1/800);
                        $("#section1in2--content2").css("opacity", Number($("#section1in2--content2").css("opacity")) + 1/1000);

                      };
  
                      if (this.renderer.getClearAlpha() < .75) {
                        //code
                        this.opacitybackground += 1;
                        this.renderer.setClearAlpha(this.opacitybackground/(20*this.objects.nbButterflies));
                      };
                    };
                    
                    cameraCtrl.update();
                    TWEEN.update();
                    for (var i = 0; i < this.objects.butterflies.length; i++) {
                      this.objects.butterflies[i].move();
                    };

                    if ($("#section1in2--content2").css("opacity") == 1.0) {
                      //OBS: FIND A WAY TO RESET MOVE!
                      //code
                      //console.log(1111);
                      if (this.shader) {
                        //code
                        THREE.CustomGrayScaleShader = { 
 
                                  uniforms: { 
                                    "tDiffuse": { type: "t", value: null }, 
                                    "rPower":  { type: "f", value: 0.2126 }, 
                                    "gPower":  { type: "f", value: 0.7152 }, 
                                    "bPower":  { type: "f", value: 0.0722 } 
                                  }, 
                                 
                                  vertexShader: [ 
                                    "varying vec2 vUv;", 
                                    "void main() {", 
                                      "vUv = uv;", 
                                      "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );", 
                                    "}" 
                                  ].join("\n"), 
                                 
                                  fragmentShader: [ 
                                 
                                    "uniform float rPower;", 
                                    "uniform float gPower;", 
                                    "uniform float bPower;", 
                                    "uniform sampler2D tDiffuse;", 
                                 
                                    "varying vec2 vUv;", 
                                 
                                    "void main() {", 
                                      "vec4 texel = texture2D( tDiffuse, vUv );", 
                                      "float gray = texel.r*rPower + texel.g*gPower + texel.b*bPower;", 
                                      "gl_FragColor = vec4( vec3(gray), texel.w );", 
                                    "}" 
                                  ].join("\n") 
                                }; 
                        
                        //console.log(scene, zelf);
                        
                        var renderPass = new THREE.RenderPass(scene, zelf.camera); 
                        var effectCopy = new THREE.ShaderPass(THREE.CopyShader); 
                        effectCopy.renderToScreen = true; 
                         
                        var shaderPass = new THREE.ShaderPass(THREE.CustomGrayScaleShader); 
                         
                        this.composer = new THREE.EffectComposer(zelf.renderer); //OJO changing my renderer completely!!!
                        this.composer.addPass(renderPass); 
                        this.composer.addPass(shaderPass); 
                        this.composer.addPass(effectCopy);
                        this.shader = false;

                      }
                      
                        compatibility.requestAnimationFrame(this.updateAR.bind(this));
                        this.composer.render();
                        //console.error(composer)

                        //shaderPass.enabled = controls.grayScale; 
                        //shaderPass.uniforms.rPower.value = controls.rPower; 
                        //shaderPass.uniforms.gPower.value = controls.gPower; 
                        //shaderPass.uniforms.bPower.value = controls.bPower;

                      cameraCtrl.update();
                      TWEEN.update();
                      if (this.objects.butterflies[0]) {
                        for (var i = 0; i < this.objects.butterflies.length; i++) {
                          //console.log(this.objects.butterflies[i].velocityLimit);
                          if (this.objects.butterflies[i].velocityLimit == 1.2) {
                          //  //code
                            this.objects.butterflies[i].velocitySetter(.4);
                          };
                          this.objects.butterflies[i].move();
                        };
                        if (Math.random() <= .1) {
                          scene.remove(this.objects.butterflies[0].meshObj);
                          this.objects.butterflies.shift();
                        };
                      } else {
                        //$("#intro_text2").css("display", "none");
                        $("#scene2html").css("display","none");
                        $('#scene3html').width("100%");
                        $("#section3--content__paragraph1").css("animation-name", "paragraphs_opacity");
                        $("#section3--content__paragraph2").css("animation-name", "paragraphs_opacity");
                        $("#section3--content__paragraph3").css("animation-name", "paragraphs_opacity2");
                      };

                
                
                    }else{
                      compatibility.requestAnimationFrame(this.updateAR.bind(this));
                      this.renderer.render(scene, this.camera);
                    };

              },
              
            };


  /////////////////////////////////////////////////////
  /// sceneelements4 == entryscene4: END (butterflies flying everywhere)
  /////////////////////////////////////////////////////            
            
            var sceneelements4 = {
              renderer: null,
              camera: null,
              //cameraCtrl: null,
              opacitybackground: 0.0,
              arToolkitSource: null,
              shader: true,
              composer: null,
              init: function(){
                          this.renderer = sceneelements1.renderer;
                          this.camera = this.camera_init();
                          this.camera.position.z = 5;
                          cameraCtrl = new THREE.OrbitControls(this.camera);
                          scene.add(this.camera);
                          //sceneelements1.cameraCtrl = sceneelements1.cameraCtrls1_init.orbit.call(sceneelements1);
                          
                          scene.add(this.lights_init.ambient());
                          this.objects.bttfls_init();
                          
                          document.body.appendChild(this.renderer.domElement);
                          window.addEventListener('onresize', this.listeners_init.onResize.bind(this));
                    
                    },
              initAR: function(){

                          scene.remove(sceneelements2.objects.f._Object);
                          scene.remove(sceneelements2.objects.markerRoot1);
                          this.renderer = sceneelements1.renderer;
                          this.arToolkitSource = sceneelements1.arToolkitSource;
                          scene.remove(sceneelements2.camera);
                          //sceneelements2.arToolkitContext = null;
 
                          /*CHECKS*/
                          //console.log(Butterfly);

                          /*
                          //TEST OBJECT
                          let geometry1	= new THREE.CubeGeometry(1,1,1);
                          let material1	= new THREE.MeshNormalMaterial({
                              transparent: true,
                              opacity: 0.5,
                              side: THREE.DoubleSide
                          }); 
                          
                          var mesh1 = new THREE.Mesh( geometry1, material1 );
                          mesh1.position.y = 0.5;
                          mesh1.rotation.y = Math.PI/4;
                          scene.add(mesh1);
                          */                          
                          
                          /**************/
                          //$("#intro_text2").hide();
                          $("#entryscene4").css("display","inline-block");
                          $("#section1in2--content2").css("opacity", 0.0);
                          this.renderer = this.renderer_init();
                          this.camera = this.camera_init();
                          this.camera.position.z = 35;
                          cameraCtrl = new THREE.OrbitControls(this.camera);
                          scene.add(this.camera);
                          scene.add(this.lights_init.ambient());


                          
                          this.objects.bttfls_init();
                          
                          //document.body.appendChild(this.renderer.domElement);
                          ////window.addEventListener('onresize', this.listeners_init.onResize.bind(this));
                          //////E: a simple solution for onResize not look for the window scope from arToolkitSource.onResizeElement() method in onResize listener,
                          ////// needed a wrapper function, and to pass context as argument to onResize after context normalization (`var zelf = this`)
                          //////https://stackoverflow.com/questions/1338599/the-value-of-this-within-the-handler-using-addeventlistener
                          //////console.error(this);
                          //////onResize.bind(this); //trying binding `this` to onResize didn't work :(
                          //this.arToolkitSource = new THREEx.ArToolkitSource({ //arToolkitSource for camera search can be set as window
                          //    sourceType : 'webcam',
                          //});
                          //var zelf = this;
                          //var onResize = this.listeners_init.onResizeAR;
                          //function intheeventlistenerhandler(){
                          //    onResize(zelf);  
                          //}                     
                          //
                          //this.arToolkitSource.init(function onReady(){
                          //    intheeventlistenerhandler();
                          //});
                          //
                          //// handle resize event
                          //window.addEventListener('resize', intheeventlistenerhandler);                    
                    },
              renderer_init: function(){
                            var renderer = new THREE.WebGLRenderer({
                                antialias : true,
                                alpha: true
                            });
                            renderer.setPixelRatio( window.devicePixelRatio );
                            renderer.setClearAlpha(0.0);
                            renderer.setSize(globalWidth, globalHeight); //set CANVAS size
                            renderer.domElement.style["display"]  = "block";
                            renderer.domElement.style["position"] = "fixed";
                            //renderer.domElement.style["width"]    = "100%";
                            //renderer.domElement.style["height"]   = "100%";
                            renderer.domElement.style["width"]    = globalWidth; //set RENDERING AREA size (not the same as canvas size!); it can overflow the canvas size.
                            renderer.domElement.style["height"]   = globalHeight;
                            renderer.domElement.style["top"] = '0px';
                            renderer.domElement.style["left"] = '0px'; 
                            return renderer;                        
                      },
              camera_init: function(){
                    var cam = new THREE.PerspectiveCamera(50, globalWidth / globalHeight, 0.1, 1000);
                    cam.name = "perspectivecamerascene1"
                    return cam;
                      },
              lights_init: {
                          ambient: function(){
                            var ambient = new THREE.AmbientLight( 0xcccccc, 1.5 );
                            ambient.name = "ambientlight1scene1"
                            return ambient;
                          },
                      },
              cameraCtrls_init: {
                          orbit: function(){
                            var camera = this.camera;
                            var orbit = new THREE.OrbitControls(camera);
                            orbit.name = "orbitcontrolscene1"
                            return orbit
                            }
                      },
              listeners_init: {
                onResize: function(){
                    var camera = this.camera;
                    camera.aspect = globalWidth / globalHeight;
                    camera.updateProjectionMatrix();
                    this.renderer.setSize(globalWidth , globalHeight);
                },
                onResizeAR: function(t){
                    //console.error(t);
                    t.arToolkitSource.onResizeElement(); //this function involves a non-explicit while-loop that is hard to handle with `this`!!	
                    t.arToolkitSource.copyElementSizeTo(t.renderer.domElement);
                    if ( t.arToolkitContext !== undefined && t.arToolkitContext.arController !== null )
                    {
                        //console.log(t.arToolkitContext.arController);
                        t.arToolkitSource.copyElementSizeTo(t.arToolkitContext.arController.canvas)	
                    } else { // is this ok???
                        var camera = t.camera;
                        camera.aspect = globalWidth / globalHeight;
                        camera.updateProjectionMatrix();
                        //t.renderer.setSize(globalWidth , globalHeight);
                    };

                },
              },
              objects: {
                butterflies : [],
                
                nbButterflies: 50,
                
                bttfls_init : function(){
                    for(let i = 0; i < this.butterflies.length; i++){
                            scene.remove(this.butterflies[i].meshObj);
                    };
                    this.butterflies = [];
                                   
                     
                    const nbButterflies = this.nbButterflies;
                    
                    function shuffle(_b){
                        for (var i = 0; i < _b.length; i++) {
                          _b[i].shuffleHELPER();
                        };
                    };
                    
                    for (var i = 0; i < nbButterflies; i++) {
                      var b = new Butterfly();
                      this.butterflies.push(b);
                      b.meshObj.name = "butterfly"+i;
                      scene.add(b.meshObj);
                    };
                   
                    shuffle(this.butterflies);
                    //console.log(this.butterflies);                  
                }
                
              },
              update: function(){
                    var zelf = this;
                    //console.error(zelf.objects1.butterflies.length);
                    //statsGlobal.begin();
                    compatibility.requestAnimationFrame(this.update.bind(this));
                    //this.cameraCtrl.update();
                    cameraCtrl.update();
                    TWEEN.update();
                    for (var i = 0; i < this.objects.butterflies.length; i++) {
                      this.objects.butterflies[i].move();
                    };
                    //statsGlobal.end();
                    this.renderer.render(scene, this.camera);
              },
              updateAR: function(){
                    var zelf = this;
                   
                    cameraCtrl.update();
                    TWEEN.update();
                    for (var i = 0; i < this.objects.butterflies.length; i++) {
                      this.objects.butterflies[i].move();
                    };
                    compatibility.requestAnimationFrame(this.updateAR.bind(this));
                    this.renderer.render(scene, this.camera);

              },
              
            };


  /////////////////////////////////////////////////////
  /// scene 3 (???)
  /////////////////////////////////////////////////////            
            
            var sceneelements3 = {
              renderer: null,
              camera: null,
              //cameraCtrl: null,
              opacitybackground: 0.0,
              arToolkitSource: null,
              init: function(){
                   
                    },
              initAR: function(){
                          scene.remove(sceneelements2.objects.f._Object);
                          scene.remove(sceneelements2.objects.markerRoot1);
                          this.renderer = sceneelements1.renderer;
                          this.renderer.clippingPlanes = [];
                          this.camera = this.camera_init();
                          this.camera.position.z = 35;
                          this.arToolkitSource = sceneelements1.arToolkitSource;
                          scene.remove(sceneelements2.camera);
                          sceneelements2.arToolkitContext = null;
                          this.camera = this.camera_init();
                          scene.add(this.camera);
                          cameraCtrl = new THREE.OrbitControls(this.camera);
                          scene.add(this.camera);
                          scene.add(this.lights_init.ambient());

                          /*
                          //TEST OBJECT
                          let geometry1	= new THREE.CubeGeometry(1,1,1);
                          let material1	= new THREE.MeshNormalMaterial({
                              transparent: true,
                              opacity: 0.5,
                              side: THREE.DoubleSide
                          }); 
                          
                          var mesh1 = new THREE.Mesh( geometry1, material1 );
                          mesh1.position.y = 0.5;
                          mesh1.rotation.y = Math.PI/4;
                          scene.add(mesh1);
                          */
                          
                          this.objects.bttfls_init();
   
                    },
              renderer_init: function(){
                      },
              camera_init: function(){
                    var cam = new THREE.PerspectiveCamera(35, globalWidth / globalHeight , 0.1, 1000); //000
                    cam.name = "perspectivecamerascene3"
                    return cam;
                      },
              lights_init: {
                          ambient: function(){
                            var ambient = new THREE.AmbientLight( 0xcccccc, 1.5 );
                            ambient.name = "ambientlight1scene3"
                            return ambient;
                          },
                      },
              cameraCtrls_init: {
                          orbit: function(){
                            var camera = this.camera;
                            var orbit = new THREE.OrbitControls(camera);
                            orbit.name = "orbitcontrolscene3"
                            return orbit
                            }
                      },
              listeners_init: {
                onResize: function(){
                    var camera = this.camera;
                    camera.aspect = globalWidth / globalHeight;
                    camera.updateProjectionMatrix();
                    this.renderer.setSize(globalWidth , globalHeight);
                },
                onResizeAR: function(t){
                },
              },
              objects: {
                butterflies : [],
                
                nbButterflies: 35,
                
                bttfls_init : function(){
                    for(let i = 0; i < this.butterflies.length; i++){
                            scene.remove(this.butterflies[i].meshObj);
                    };
                    this.butterflies = [];
                                   
                     
                    const nbButterflies = this.nbButterflies;
                    
                    function shuffle(_b){
                        for (var i = 0; i < _b.length; i++) {
                          _b[i].shuffleHELPER();
                        };
                    };
                    
                    for (var i = 0; i < nbButterflies; i++) {
                      var b = new Butterfly();
                      this.butterflies.push(b);
                      b.meshObj.name = "butterfly"+i;
                      scene.add(b.meshObj);
                    };
                   
                    shuffle(this.butterflies);
                    //console.log(this.butterflies);                  
                }
                
              },
              update: function(){
              },
              updateAR: function(){
                    var zelf = this;
                    cameraCtrl.update();
                    TWEEN.update();
                    if (this.objects.butterflies[0]) {
                      for (var i = 0; i < this.objects.butterflies.length; i++) {
                        this.objects.butterflies[i].move();
                      };
                    };
                    compatibility.requestAnimationFrame(this.updateAR.bind(this));
                    this.renderer.render(scene, this.camera);

              },
              
            };
            
            

            
  /////////////////////////////////////////////////////
  /// sceneelements2 = scene4html: AR.js section: finding markers; burying factory; calls sceneelements4
  /////////////////////////////////////////////////////            
            
            //////////////////////
            //TEMPORARY VARIABLES!
            //////////////////////
            var countfoundHiro = 0;
            var verifierEvt = 0;
            var colorFactoryObj = {};
            var opened_scene4html = false;
            colorFactoryObj.r = 1.0;
            
            var sceneelements2 = {
              renderer: null,
              camera: null,
              //cameraCtrl: null,
              opacitybackground: 0.0,
              arToolkitContext: null,
              arToolkitSource: null,
              init: function(){
                      //NA                   
                    },
              initAR: function(){
                          /*
                           *OBSERVATIONS:
                           * renderer, arToolkitSource were already initialized, passed to document and added as listener in scene1
                           * what is left is the arToolkitContext, markerscontrol and markerRoot obj, that should be also included in the update
                           * there are also some objects to be removed from scene, like the scene1's camera
                          */
                         
                          this.arToolkitSource = sceneelements1.arToolkitSource;
                          this.renderer = sceneelements1.renderer;
                          scene.remove(sceneelements1.camera);
                          
                          this.camera = this.camera_init();
                          scene.add(this.camera);
                          //console.log(this.camera);
                          /*
                          //TEST OBJECT
                          let geometry1	= new THREE.CubeGeometry(1,1,1);
                          let material1	= new THREE.MeshNormalMaterial({
                              transparent: true,
                              opacity: 0.5,
                              side: THREE.DoubleSide
                          }); 
                          
                          var mesh1 = new THREE.Mesh( geometry1, material1 );
                          mesh1.position.y = 0.5;
                          mesh1.rotation.y = Math.PI/4;
                          scene.add(mesh1);
                          */

                          
                          ////////////////////////////////////////////////////////////
                          // setup arToolkitContext
                          ////////////////////////////////////////////////////////////	
                      
                          // create atToolkitContext
                          this.arToolkitContext = new THREEx.ArToolkitContext({
                              cameraParametersUrl: '../../arjs-resources/data/camera_para.dat',
                              detectionMode: 'mono'
                          });
                          
                          var zelf = this;
                          this.arToolkitContext.init( function onCompleted(){
                            zelf.camera.projectionMatrix.copy(zelf.arToolkitContext.getProjectionMatrix());
                          });

                          console.log(this.camera);
                          
                          
                          ////////////////////////////////////////////////////////////
                          // setup MarkerControls
                          ////////////////////////////////////////////////////////////	
                          
                          var patternArray = ["letterA", "letterB", "letterC", "letterD"];
                          var colorArray   = [0xff0000, 0xff8800, 0xffff00, 0x00cc00];
                          for (let i = 0; i < 4; i++)
                          {
                              let markerRoot2 = new THREE.Group();
                              scene.add(markerRoot2);
                              let markerControls1 = new THREEx.ArMarkerControls(
                                                            this.arToolkitContext,
                                                            markerRoot2,
                                                            {
                                                              type : 'pattern',
                                                              patternUrl : "../../arjs-resources/data/" + patternArray[i] + ".patt",
                                                    });
                              this.objects.testcube_init(colorArray[i], markerRoot2);

                          };
                          
                          var markerControls1 = new THREEx.ArMarkerControls(
                                                  this.arToolkitContext,
                                                  this.objects.markerRoot1,
                                                  {
                                                    type: 'pattern',
                                                    patternUrl: "../../arjs-resources/data/hiro.patt",
                                                  });

                          this.objects.factory_init();
                          this.objects.clippinghole_init();
                          
                          for (let i=0;i < 100;i++){
                            var p = this.objects.particle_init(i);
                            this.objects.smokeparticles[i] = {particle:null, start:false}
                            this.objects.smokeparticles[i].particle = p;
                          };
                          
                          this.objects.markerRoot1.name = "groupFactory";
                          scene.add(this.objects.markerRoot1);

                          ////////////////////////////////////////////////////////////
                          // ZDOG changes
                          ////////////////////////////////////////////////////////////                          
                          
                          mouth.closed = true;
                          mouth.fill = true;
                          mouth.translate = {y: 80, z: -50};
                          mouth.rotate = { z: TAU/4, x: -Math.PI/2.3 };
                          
                          
                          ////////////////////////////////////////////////////////////
                          // setup Listeners
                          //I should redo this, currently not inheritance; needed to recall it because `this` is now for scene2
                          ////////////////////////////////////////////////////////////
                          var zelf = this;
                          var onResize = sceneelements1.listeners_init.onResizeAR;
                          function intheeventlistenerhandler(){
                              onResize(zelf);  
                          }                     
                          
                          this.arToolkitSource.init(function onReady(){
                              intheeventlistenerhandler();
                          });
                          
                          // handle resize event
                          window.addEventListener('resize', intheeventlistenerhandler);
                          this.renderer.localClippingEnabled = true;
                    },
              renderer_init: function(){
                          //same as in scene1                      
                      },
              camera_init: function(){
                        var cam = new THREE.Camera();
                        cam.name = "camerascene2"
                        return cam;
                      },
              lights_init: {
                          ambient: function(){
                            //same as in scene1
                            },
                      },
              cameraCtrls_init: {
                          orbit: function(){
                            //same as in scene1 or none
                            }
                      },
              listeners_init: {
                onResize: function(){
                      //NA
                },
                onResizeAR: function(t){
                      //same as in scene1
                },
              },
              objects: {
                markerRoot1: new THREE.Group(),
                test: null,
                smokeparticles: {},
                f : [],
               factory_init: function(){
                          this.f.push(new FactoryObj(this.markerRoot1));
                          //console.log(2222, Object.keys(this.f));
                       },
                particle_init: function(i){
                        var p = new Particle();
                        p._subScene.name = "smokeparticle"+i;
                        this.markerRoot1.add(p._subScene);
                        return p;
                },
                clippinghole_init: function(){
                          /////////////////////////////////////////
                          // Clipping
                          /////////////////////////////////////////
                          
                          // the inside of the hole
                          let geometry1	= new THREE.CubeGeometry(2,2,2);
                          let loader = new THREE.TextureLoader();
                          //let texture = loader.load( 'assets/grph/tiles.jpg' );
                          let material1	= new THREE.MeshLambertMaterial({
                              transparent : true,
                              //map: texture,
                              color: 'white',
                              side: THREE.BackSide //E: this is KEY
                          }); 
                          
                          mesh1 = new THREE.Mesh( geometry1, material1 );
                          
                          // the invisibility cloak (box with a hole)
                          let geometry0 = new THREE.BoxGeometry(2,2,2);
                          //geometry0.faces.splice(4, 2); // make hole by removing top two triangles
                          
                          let material0 = new THREE.MeshBasicMaterial({
                              colorWrite: false
                          });
                          
                          let mesh0 = new THREE.Mesh( geometry0, material0 );
                          mesh0.scale.set(1,1,1).multiplyScalar(1.01);
                          
                          mesh1.position.y = -2.8;
                          mesh0.position.y = -2.8;
                          mesh1.position.z = -1.2;
                          mesh0.position.z = -1.2;
                          
                          
                          this.markerRoot1.add( mesh0 );
                          this.markerRoot1.add( mesh1 );
                          this.f.push(mesh0, mesh1);
                
                },
                testcube_init: function(cubecolor, mr){
                              var mesh = new THREE.Mesh( 
                                      new THREE.CubeGeometry(1.25,1.25,1.25), 
                                      new THREE.MeshBasicMaterial(
                                                  {
                                                    color:cubecolor,
                                                    //transparent:true,
                                                    opacity:0.5
                                                  }) 
                                    );
                              mesh.position.y = 1.25/2;
                              mr.add( mesh );                          
                }
              },
              update: function(){
                  //NA
              },
              updateAR: function(){
                
                  //testing position factory
                  if (this.objects.f[0]._Object !== null) {
                    //code
                    //console.log(5555, this.objects.f._Object.getWorldDirection());
                    console.log(5555, this.renderer.getClearAlpha());
                  }
                  
                 
                  /////
                  document.getElementById("scene3html").style.width = "0";
                  //emitter.unsubscribe('event:close-nav');
                  //console.log(3333, colorFactoryObj.r);
                  if (colorFactoryObj.r > 0.001) {
                    for (let i = 0; i < 100; i++) {
                     if (this.objects.smokeparticles[i].start === false) {
                       this.objects.smokeparticles[i].start = Math.random() > .2? false:true;
                       //console.log(this.objects.smokeparticles[i].start);
                       if (colorFactoryObj.r < 1.0 && colorFactoryObj.r >= .75) {
                          //console.log('changing color smoke ', colorFactoryObj);
                          this.objects.smokeparticles[i].particle._subScene.material.color.setHex(0x626262);
                          this.renderer.setClearAlpha(.75);
                       } else if (colorFactoryObj.r < .75 && colorFactoryObj.r >= .50) {
                        //code
                        this.objects.smokeparticles[i].particle._subScene.material.color.setHex(0x989898);
                        this.renderer.setClearAlpha(.50);
                       } else if (colorFactoryObj.r < .50 && colorFactoryObj.r >= .25) {
                        //code
                        this.objects.smokeparticles[i].particle._subScene.material.color.setHex(0xbebebe);
                        this.renderer.setClearAlpha(.25);
                       } else if (colorFactoryObj.r > 0. && colorFactoryObj.r < .25) {
                        //code
                        this.objects.smokeparticles[i].particle._subScene.material.color.setHex(0xededed);
                        this.renderer.setClearAlpha(.0);
                       };
                       
                     } else {
                       let s_a = this.objects.smokeparticles[i].particle._subScene;
                       s_a.position.y += .01;
                   
                       if (s_a.position.y > 1.6){
                           this.objects.markerRoot1.remove(s_a);
                           var p = this.objects.particle_init(i);
                           this.objects.smokeparticles[i] = {particle:null, start:false}
                           this.objects.smokeparticles[i].particle = p;
                       };
                     };
                   };
                } else {
                   if (this.objects.f[0]._Object != null) {
                    //code
                    this.objects.f[0]._Object.position.y -= 0.01;
                    if (this.objects.f[0]._Object.position.y < -3.) {
                      this.objects.f[0]._Object = null;
                      this.objects.f[1] = null;
                      this.objects.f[2] = null;
                      //scene.traverse(function(child){ //cleaning up a bit...
                      //    if (child) {
                      //      //code
                      //      scene.remove(child);
                      //    }
                      //  });
                      //console.log(scene);
                      //https://stackoverflow.com/questions/29417374/threejs-remove-all-together-object-from-scene
                      for(let i = scene.children.length - 1; i >= 0; i--){
                        scene.remove(scene.children[i]);
                      };
                      //$('#entryscene3').width("0px");
                      //document.getElementById("entryscene3").style.width = "0px";
                      $("#scene4html").css("display","none");
                      $('#entryscene4').width("100%");
                      sceneelements4.initAR();
                      sceneelements4.updateAR();                      
                    }
                   }
                   
                   for (let i = 0; i < 100; i++) { 
                       let s_a = this.objects.smokeparticles[i].particle._subScene;
                       s_a.position.y += .01;
                   
                       if (s_a.position.y > 1.6){
                           this.objects.markerRoot1.remove(s_a);
                           //var p = this.objects.particle_init(i);
                           //this.objects.smokeparticles[i] = {particle:null, start:false}
                           //this.objects.smokeparticles[i].particle = p;
                       };                
                   };
                   
                };
                if ( this.arToolkitSource.ready !== false) this.arToolkitContext.update( this.arToolkitSource.domElement );
                if (this.arToolkitContext.arController !== null) {
                  var zelf = this;
                  if (this.arToolkitContext._arMarkersControls[4].object3d.visible) {
                  //this.renderer.clippingPlanes[0].setFromNormalAndCoplanarPoint(
                  //    new THREE.Vector3(1,0,0).applyQuaternion(scene.getWorldQuaternion()),
                  //    scene.getWorldPosition());
                    //console.log('found ', this.arToolkitContext._arMarkersControls[4].object3d);
                    countfoundHiro += 1;
                    if (countfoundHiro > 20) { //approx. 20 frames
                      if (!opened_scene4html) {
                          ////////////////////////////////////////////////////////////
                          // running ZDOG animation
                          ////////////////////////////////////////////////////////////	
                          

                          
                          //illoElem = document.querySelector("#section1in4--zdog-canvas");
                          //illo.element = illoElem;
                          
                          
                          //CANVAS 1. Parameter initialization
var illoElem = document.querySelector('#section1in4--zdog-canvas');
const illoSize = 230;
const minWindowSize = Math.min(window.innerWidth, window.innerHeight);
const zoomSize = (minWindowSize / illoSize);
const zoom = (zoomSize < 1) ? zoomSize : Math.floor(zoomSize);

//ZDOG 1. Initialize animation parameters (eg. rotation)
const sceneStartRotation = { x: 0.25, y: 0.2};
const TAU = Zdog.TAU; // == 2*Pi
let isSpinning = true;
const c_01 = '#e89e21';
const c_02 = '#b52f24';
const c_03 = '#fffffd';
const c_04 = '#713b39';
const c_05 = '#fae3d9';


//CANVAS 2. Parameter initialization (cont)
illoElem.setAttribute('width', (illoSize * zoom) + 20);
illoElem.setAttribute('height', (illoSize * zoom) - 20);


//ZDOG 2. Instance of ZDOG - affects CANVAS; global configuration (includes zooming, dragging and rotation)
var illo = new Zdog.Illustration( {
	element: illoElem,
 rotate: sceneStartRotation,
	zoom: zoom/1.5,
	dragRotate: true,
	onDragStart: function() {
		isSpinning = false;
	},
	onDragEnd: function() {
		isSpinning = true;
	},
});

//ZDOG 3. Instantiation of a GROUP using an anchor (An VOID item that can be added to another item, and have other items added to it.)
const shroom = new Zdog.Anchor({
	addTo: illo,
	rotate: { x: TAU/4.4, z: -TAU/20 },
});

//ZDOG 4. Instantion of parts of the figure, each added to a PARENT shape
const cap = new Zdog.Hemisphere({
	addTo: shroom,
	diameter: 160,
	stroke: 10,
	color: c_01,
	backface: c_04,
});

// Let's draw the schroom's gills as well
new Zdog.Ellipse({
	addTo: shroom,
	diameter: 160,
	stroke: 10,
	color: c_04,
	fill: true,
});

const stem = new Zdog.Cylinder({
	addTo: shroom,
	diameter: 80,
	length: 100,
	stroke: false,
	color: c_03,
	translate: { z: -50 },
	backface: c_04,
});

const scalesZ = (cap.diameter / 2);
const scalesAnchor = new Zdog.Anchor({
	addTo: cap,
	translate: { z: scalesZ },
});
const aTop = new Zdog.Hemisphere({
	addTo: scalesAnchor,
 diameter: 15,
 stroke: 10,
	color: c_02,
	translate: { z: 5 },
	/*backface: c_02,*/
});

const aScale = new Zdog.Ellipse({
	addTo: scalesAnchor,
 diameter: 30,
 stroke: 10,
	color: c_02,
	translate: { z: 5 },
	backface: c_02
});
aScale.copy({
 diameter: 4,
 stroke: 10,
	translate: { 
		x: (scalesZ / 1.3), 
		y: 40,
		z: (scalesZ / -1.8) 
	},
});
aScale.copy({
 diameter: 4,
 stroke: 10,
	translate: { 
		x: -75, 
		y: -10,
		z: (scalesZ / -1.7) 
	},
});
aScale.copy({
 diameter: 4,
 stroke: 10,
	translate: { 
		y: 73,
		z: (scalesZ / -2)
	},
});
aScale.copy({
 diameter: 4,
 stroke: 10,
	translate: { 
		x: (scalesZ / -2.7),
		y: (scalesZ / -1.1), 
		z: (scalesZ / -1.3) 
	},
});
aScale.copy({
 diameter: 4,
 stroke: 10,
	translate: { 
		x: (scalesZ / -1.8),
		y: (scalesZ * 0.75),
		z: (scalesZ / -1.5) 
	},
});
aScale.copy({
 diameter: 4,
 stroke: 10,
	translate: { 
		x: (scalesZ / 1.8),
		y: (scalesZ * -0.75),
		z: (scalesZ / -1.7) 
	},
});
aScale.copy({
 diameter: 4,
 stroke: 10,
	translate: { 
		x: 53,
		y: -10,
		z: -20
	},
});
aScale.copy({
 diameter: 4,
 stroke: 10,
	translate: { 
		x: -34,
		y: -40,
		z: -15
	},
});
aScale.copy({
 diameter: 4,
 stroke: 10,
	translate: { 
		x: -40,
		y: 20,
		z: -10
	},
});
aScale.copy({
 diameter: 4,
 stroke: 10,
	translate: { 
		x: 30,
		y: 30,
		z: -8
	},
});
aScale.copy({
 diameter: 4,
 stroke: 10,
	translate: { 
		x: 80,
		z: -60
	},
});
aScale.copy({
 diameter: 4,
 stroke: 10,
	translate: { 
		x: 10,
		y: -50,
		z: -17
	},
});

	//eye
	var left_eye = new Zdog.Ellipse({
		addTo: scalesAnchor,
		width: 5,
		height: 20,		
		fill: true,
		color: 'black',
		translate: {x: 9, y: 65, z: -30},
  rotate: {x: Math.PI/1.4}
	});

	var right_eye = new Zdog.Ellipse({
		addTo: scalesAnchor,
		width: 5,
		height: 20,		
		fill: true,
		color: 'black',
		translate: {x: -9, y: 65, z: -30},
  rotate: {x: Math.PI/1.4}
	});

	//eyebrow
	var eyebrow = new Zdog.Ellipse({
		addTo: scalesAnchor,
		diameter: 6,
		quarters: 2,
		color: 'black',
		translate: {x: -9, y: 50, z: -15},
		rotate: {z: -TAU/4, x: -Math.PI/2},
		stroke: 1.5
	});

	eyebrow.copy({
		translate: {x: 9, y: 50, z: -15},
  //rotate: {y:3*Math.PI/4, z: TAU/5, x: Math.PI/4}
	});

	//mouth
	var mouth = new Zdog.Ellipse({
		addTo: scalesAnchor,
		diameter: 40,
		quarters: 2,
		closed: true,
		fill: true,
		color: 'brown',
		translate: {y: 80, z: -50},
		rotate: { z: TAU/4, x: -Math.PI/2.3 },
        //translate: {y: 80, z: -70},
		//rotate: { x: Math.PI/1.8, z: TAU/4 },
		backface: false,
  backface:'brown',
	});
    
//const aScale2 = new Zdog.Shape({
//	addTo: scalesAnchor,
//	stroke: 12,
//	color: 'blue',
//	translate: { z: 5 },
//	backface: c_02,
//});

//aScale2.copy({
//	stroke: 22,
//	translate: { 
//		x: 10,
//		y: 30,
//		z: -70
//	},
//});

	// ---- GSAP ---- //
 //GSAP 1. instantiation and global configuration
const tlEyes = new TimelineMax({repeat: -1, repeatDelay: 2});

//GSAP 2. local (object-specific) initialization
const animationObject = {
 LeftEyeHeight: 20,
 RightEyeHeight: 20
};

//GSAP 3. local (object-specific) animation (start-end)
tlEyes.to(animationObject, .1, {
		LeftEyeHeight: .1,
		RightEyeHeight: .1
	})
	.to(animationObject, .1,{
		LeftEyeHeight: 20,
		RightEyeHeight: 20
	})
	.to(animationObject, .1, {
		LeftEyeHeight: .1,
		RightEyeHeight: .1
	})
	.to(animationObject, .1,{
		LeftEyeHeight: 20,
		RightEyeHeight: 20
	})

 //ZDOG ANIMATION SECTION
 //ZDOG 5. public variable declaration (eg. time)
 let t = 0;

function render_zdog2(){

  
  //GSAP
  //GSAP 4. value assigned to object (!) 
		left_eye.height = animationObject.LeftEyeHeight; 
		right_eye.height = animationObject.RightEyeHeight;
		
  //GSAP 5. canvas update
  left_eye.updatePath();
  right_eye.updatePath();


  //if set to spin...
  if (isSpinning) {
   //ZDOG 6. update time variable
   t += 1/240;
   
   //ZDOG 7. estimate parameters based on time (in this case, rotation)
   const theta = Zdog.easeInOut(t % 1) * TAU;
   
   //ZDOG 8. interpolation (trigonometric one)
   illo.rotate.y = (Math.cos(theta) / -3);
   //console.log(111);
	 }  
    
  
  //ZDOG 9. re-rendering of the whole figure
		illo.updateRenderGraph(); 
}

var tlMaster;
    
    
                          ////GSAP 6. Master instantiation for onUpdate
                          tlMaster = new TimelineMax({onUpdate: render_zdog2});
                        
                          ////GSAP 7. add animation instance to Master instance
                          tlMaster.add(tlEyes);
                         
                          document.getElementById("scene4html").style.width = "100%";
                          opened_scene4html = true;                         
 
                      }
                      emitter.subscribe('event:greener', function(data){
                        //console.log(data);
                        //if (data.value) {
                          verifierEvt += 1;
                          //console.log(data.value, countfoundHiro, verifierEvt);
                          //console.log(6666, zelf.objects.f._Object);                         //console.log(zelf.arToolkitContext._arMarkersControls[4].object3d.children[0].children[0].material);
                          //colorFactoryObj = zelf.arToolkitContext._arMarkersControls[4].object3d.children[0].children[0].material.color
                          //console.log(zelf.objects.f._Object.children[0].material.color);
                          colorFactoryObj = zelf.objects.f[0]._Object.children[0].material.color;
                          //if (this.objects.markerRoot1.children[0].material.color.r >= 0.001) {
                          ////  //code
                          //  this.objects.markerRoot1.children[0].material.color.r -= 0.001;
                          //}
                          //if (colorFactory.r >= 0.001) {
                          ////  //code
                          //  colorFactory.r -= 0.001;
                          //}
                          if (colorFactoryObj.r >= 0.0001) {
                          //  //code
                            colorFactoryObj.r -= 0.0001;
                          }
                          //return

                        //}
                      });
                    }
                  }
                }
                
                //this.arToolkitContext.arController
                compatibility.requestAnimationFrame(this.updateAR.bind(this));
                this.renderer.render(scene, this.camera);                  
              },
              
            };
            

  
            function app_init(app_canvas, app_video, gl_w, gl_h) {
                ////window scope variables and functions
                ///* Set the width of the side navigation to 0 */
                //window.closeEntryImg = (function() {
                //    //document.getElementById("mySidenav2").style.width = "0";
                //    // Removes an element from the document
                //    var element = document.getElementById("entryscene1");
                //    element.parentNode.removeChild(element);
                //    this.canvas_init();
                //    this.arjsvideo_init();
                //});
                //
                //  
                ////  /* Set the width of the side navigation to 0 */
                //window.closeNav = (function() {
                //    document.getElementById("entryscene2").style.width = "0";
                //    //console.log(this);
                //    this.initAR();
                //    this.updateAR();
                //});
              
              
                (function canvas_setup(){
                    globalWidth = gl_w;
                    globalHeight = gl_h;
                  }());
                //var cube = new Cube();
                scene = new THREE.Scene();
                clock = new THREE.Clock();
               //sceneelements1.init();
               //sceneelements1.update();               
               sceneelements1.initAR();
               sceneelements1.updateAR();
               //console.log(scene.children);
               //window.closeNav.bind(sceneelements2);
               emitter.subscribe('event:close-nav', function(data) {
                    //console.error('event:close-nav was successfully called');
                    sceneelements2.initAR();
                    //console.error(scene);
                    sceneelements2.updateAR();                    
                });
                //window.closeNav = function() {
                //    document.getElementById("entryscene2").style.width = "0";
                //    //console.log(this);
                //    sceneelements2.initAR();
                //    sceneelements2.updateAR();
                //};


            };
            
            
        return {app_init: app_init, tick: ()=> console.log('tick'), video: null};
        
    }());


///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

/**********************
  HTML SETUP MODULE
 ********************/

(function HTMLSETUPmodule(app_EXTERNAL){
  
   /**********************
      VIEWPORT UTILS
   ********************/
    (function() {
        
        var _w = window,
            _s = window.screen,
            _b = document.body,
            _d = document.documentElement;
        
        window.Utils = {
        
            // screen info 
            screen: function() 
            {
                var width  = Math.max( 0, _w.innerWidth || _d.clientWidth || _b.clientWidth || 0 );
                var height = Math.max( 0, _w.innerHeight || _d.clientHeight || _b.clientHeight || 0 );
                
                return {
                    width   : width, 
                    height  : height, 
                    centerx : width / 2, 
                    centery : height / 2, 
                    ratio   : width / height, 
                };
            }, 
        }; 
    })();  

    var SCREENGlobal = Utils.screen();  
    const constWidth = 640;
    const constHeight = 480;
    var CANVASGlobal;
    var VIDEOGlobal;

    /*--- mobile device detection ---*/
    function _detectmob(){
        if( navigator.userAgent.match(/Android/i)
        || navigator.userAgent.match(/webOS/i)
        || navigator.userAgent.match(/iPhone/i)
        || navigator.userAgent.match(/iPad/i)
        || navigator.userAgent.match(/iPod/i)
        || navigator.userAgent.match(/BlackBerry/i)
        || navigator.userAgent.match(/Windows Phone/i)
        ){
           return true;
         }
        else {
           return false;
         }        
    }
    

    

    
    /*--- Middleware ---*/
    function _findVideoSizeMiddleW(){
        //default
        var gl_w = 100;
        var gl_h = 100;
        if (VIDEOGlobal != undefined && VIDEOGlobal.videoWidth > 0 && VIDEOGlobal.videoHeight > 0) {
            gl_w = VIDEOGlobal.videoWidth;
            gl_h = VIDEOGlobal.videoHeight;
            //_onDimensionsReadyMiddleW(gl_w, gl_h);
            VIDEOGlobal.removeEventListener('loadeddata', function(e){_findVideoSizeMiddleW()});
        } else if (attempts !== false) { // what happens with `attempts`?? why must be a global?????
              if(attempts < 10) {
                  attempts++;
                  setTimeout(_findVideoSizeMiddleW, 200);
              } else {
                gl_w = constWidth;
                gl_h = constHeight;                
                //_onDimensionsReadyMiddleW(gl_w, gl_h); //set a fixed size
              }
        } else {
            gl_w = SCREENGlobal.width;
            gl_h = SCREENGlobal.height;           
            //_onDimensionsReadyMiddleW(gl_w, gl_h); //always enter this one; only for testing
        };
        _onDimensionsReadyMiddleW(gl_w, gl_h); //always enter this one; only for testing
    };
      
    function _onDimensionsReadyMiddleW(gl_w, gl_h){
          app_EXTERNAL.app_init(CANVASGlobal, VIDEOGlobal, gl_w, gl_h);
          var counter = 0;
          app_EXTERNAL.tick();
          //console.error(init_obj);
    };
    
    var init_obj = {
        canvas_init : function(){
                  var THIS = this;
                  CANVASGlobal = document.getElementById('canvas');
                },
        video_init : function(){
                  var THIS = this;
                  VIDEOGlobal = document.getElementById('webcam');
                  app_EXTERNAL.video = VIDEOGlobal;
                  try{
                      //console.log(video);
                      var attemps = 0;
                      var voptions = {};
                      var mob = _detectmob();
                      VIDEOGlobal.addEventListener(
                                                    'loadeddata',
                                                    function(e){
                                                     _findVideoSizeMiddleW()
                                                    }
                                                    );
                      if (mob) {
                        //voptions = { video: { facingMode: { exact: "environment" }, width: WIDTH, height: HEIGHT }, audio:false };
                        voptions = { video: { facingMode: { exact: "environment" } }, audio:false };
                      }else{
                        //voptions = {video: {width: WIDTH, height: HEIGHT}, audio: false};
                        voptions = { video: true, audio: false }
                      };
                      compatibility.getUserMedia(voptions,
                                                  function(stream){
                                                    //const videoS = document.querySelector('video');
                                                    try {
                                                        //deprecated
                                                        VIDEOGlobal.src = compatibility.URL.createObjectURL(stream);
                                                      }catch(error){
                                                        VIDEOGlobal.srcObject = stream;
                                                      };
                                                      setTimeout(function(){VIDEOGlobal.play();},500);
                                                  },
                                                  function(error){
                                                      $('#canvas').hide();
                                                      $('#log').hide();
                                                      $('#no_rtc').html('<h4>WebRTC not available.</h4>');
                                                      $('#no_rtc').show();
                                                  });
                      
                    }catch(error){
                      $('#canvas').hide();
                      $('#log').hide();
                      $('#no_rtc').html('<h4>Something went wrong...</h4>');
                      $('#no_rtc').show();                        
                    }
                },
        arjsvideo_init : function(){
                  var THIS = this;
                  try{
                      window.attempts = false;
                    ////////////////////////////////////////////////////////////
                    // setup arToolkitSource as global for easy access
                    //all settings will be managed by arJS, so go straight to app with no many setups
                    ////////////////////////////////////////////////////////////

                      _findVideoSizeMiddleW();
                    }catch(error){
                      $('#canvas').hide();
                      $('#log').hide();
                      $('#no_rtc').html('<h4>Something went wrong...</h4>');
                      $('#no_rtc').show();                        
                    }          
                }
      };
      
    $(window).load(function(){
        'use strict';
        ////window scope variables and functions
        ///* Set the width of the side navigation to 0 */
        window.closeEntryImg = (function() {
            //document.getElementById("mySidenav2").style.width = "0";
            // Removes an element from the document
            var element = document.getElementById("scene1html");
            element.parentNode.removeChild(element);
            this.canvas_init();
            this.arjsvideo_init();
        }).bind(init_obj);
        
        window.emitter = new CustomEventEmitter(); //it must be public or something that can travel between modules
        
        window.closeNav = function(){
            document.getElementById("scene2html").style.width = "0px";
            emitter.emit('event:close-nav', {});
        };
        var countclks = 0;
        window.greenerButton = function(){
            countclks += 1;
            emitter.emit('event:greener', {value:countclks});
        };

        //$("#intro_text1").delay(350).fadeOut(6000);
        //$("#intro_text2").delay(6500).fadeIn(3000);
        ////  /* Set the width of the side navigation to 0 */
        //window.closeNav = (function() {
        //    document.getElementById("entryscene2").style.width = "0";
        //    //console.log(this);
        //    this.initAR();
        //    this.updateAR();
        //});
        
        //window.closeEntryImg.bind(init_obj);
        
        ////canvas and video initialization
        //init_obj.canvas_init();
        ////init_obj.video_init();
        //init_obj.arjsvideo_init();
    
    })
  }(app))