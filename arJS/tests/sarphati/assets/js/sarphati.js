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
            }
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
                                //var localPlane = new THREE.Plane( new THREE.Vector3( 0., 1., 0. ), 1.5 );
                                //child.material.clippingPlanes = [localPlane];
                            }
                        });                         
                        obj.name = "factory1";
                        zelf._subScene.add(obj); //because it is async... :(
                        var p = new Promise(function(resolve, reject){
                            resolve(obj);
                          });
                        console.log(4444, obj);
                        p.then((o)=>{zelf._Object = o;})
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
            /// scene 1
            /////////////////////////////////////////////////////            
            
            var sceneelements1 = {
              renderer: null,
              camera: null,
              //cameraCtrl: null,
              opacitybackground: 0.0,
              arToolkitSource: null,
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
                          //$("#intro_text2").hide();
                          $(".intro").css("display","inline-block");
                          $("#intro_text2").css("opacity", 0.0);
                          this.renderer = this.renderer_init();
                          this.camera = this.camera_init();
                          this.camera.position.z = 35;
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
                    //statsGlobal.update();
                    
                    //var p = $("#intro");
                    //p.delay(350).fadeOut(5000, function(){var p = $("#intro"); p.html("<p>HELLO</p>"); p.show(); p.fadeIn(6000);}); //generates a loop!!
                    //$("#intro").html("<p>HELLO</p>").fadeIn(15000);
                    //console.log($("#intro_text1").css("opacity"));
                    if (($("#intro_text1").css("opacity") - 1/800) <= 0) {
                      //code
                      $("#intro_text1").hide();
                      $("#intro_text2").css("opacity", 1.0)
                    }else{
                      $("#intro_text1").css("opacity", $("#intro_text1").css("opacity") - 1/800);
                      $("#intro_text2").css("opacity", Number($("#intro_text2").css("opacity")) + 1/1000);
                    };
                    
                    cameraCtrl.update();
                    TWEEN.update();
                    for (var i = 0; i < this.objects.butterflies.length; i++) {
                      this.objects.butterflies[i].move();
                    };
                    //if (this.objects.butterflies[0]) {
                    //  for (var i = 0; i < this.objects.butterflies.length; i++) {
                    //    this.objects.butterflies[i].move();
                    //  };
                    //  if (Math.random() <= .05) {
                    //    (function(_b){
                    //      //the setTimeout must be into a closure because the MESH WILL BE IMMEDIATELY DELETED! In this way it is kept in memory
                    //      //REMEMBER: setTimeout works correctly with CALLBACKS (also closures), so METHODS must be inside one
                    //      setTimeout(function(){scene.remove(_b)},8500); //find a better transition...             
                    //    }(this.objects.butterflies[0].meshObj));
                    //    this.objects.butterflies.shift();
                    //    this.renderer.setClearAlpha(this.opacitybackground/(1.2*this.objects.nbButterflies));
                    //    this.opacitybackground += 1;  
                    //  };
                    //  //if (conf.move) {
                    //  //  for (var i = 0; i < butterflies.length; i++) {
                    //  //    butterflies[i].move();
                    //  //  }
                    //  //};
                    //};
                    //if (this.objects.butterflies.length === 0) {
                    if ($("#intro_text2").css("opacity") == 1.0) {
                      //OBS: FIND A WAY TO RESET MOVE!
                      //code
                      //console.log(1111);
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
                                  ].join("n"), 
                                 
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
                                  ].join("n") 
                                }; 
                        
                        //console.log(scene, zelf);
                        
                        var renderPass = new THREE.RenderPass(scene, zelf.camera); 
                        var effectCopy = new THREE.ShaderPass(THREE.CopyShader); 
                        effectCopy.renderToScreen = true; 
                         
                        var shaderPass = new THREE.ShaderPass(THREE.CustomGrayScaleShader); 
                         
                        var composer = new THREE.EffectComposer(zelf.renderer); //OJO changing my renderer completely!!!
                        composer.addPass(renderPass); 
                        composer.addPass(shaderPass); 
                        composer.addPass(effectCopy);
                        
                        //shaderPass.enabled = controls.grayScale; 
                        //shaderPass.uniforms.rPower.value = controls.rPower; 
                        //shaderPass.uniforms.gPower.value = controls.gPower; 
                        //shaderPass.uniforms.bPower.value = controls.bPower;
                        
                        //$("#addedtext").hide();
                        //$("#intro_text2").css("display", "none");
                        //$('#entryscene2').width("100%");
                        //$('#log').html("test width "+globalWidth);
                
                
                    }else{
                      compatibility.requestAnimationFrame(this.updateAR.bind(this));
                      this.renderer.render(scene, this.camera);
                    };

              },
              
            };

            /////////////////////////////////////////////////////
            /// scene 3
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
                          
                          //document.body.appendChild(this.renderer.domElement);
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
                      },
              camera_init: function(){
                    var cam = new THREE.PerspectiveCamera(50, globalWidth / globalHeight, 0.1, 1000); //000
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
            /// scene 2
            /////////////////////////////////////////////////////            
            
            //////////////////////
            //TEMPORARY VARIABLES!
            //////////////////////
            var countfoundHiro = 0;
            var verifierEvt = 0;
            var colorFactoryObj = {};
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

                          //// default normal of a plane is 0,0,1. Apply mesh rotation to it.
                          //let clipPlane = new THREE.Plane().setFromNormalAndCoplanarPoint(
                          //    new THREE.Vector3(0,1,0), new THREE.Vector3(0,0,0) );
                          //this.renderer.clippingPlanes = [clipPlane];
                          //this.renderer.localClippingEnabled = true;
                          
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
                          //var c = this.camera.projectionMatrix.copy;
                          //var arcgpm = this.arToolkitContext.getProjectionMatrix;
                          //this.arToolkitContext.init( function onCompleted(){
                          //    c( arcgpm() );
                          //});
                          
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
                          ////////////////////////////////////////////////////////////
                          // setup MarkerControls
                          ////////////////////////////////////////////////////////////	                          
                          var markerControls1 = new THREEx.ArMarkerControls(
                                                  this.arToolkitContext,
                                                  this.objects.markerRoot1,
                                                  {
                                                    type: 'pattern',
                                                    patternUrl: "../../arjs-resources/data/hiro.patt",
                                                  });

                          this.objects.factory_init();
                          for (let i=0;i < 100;i++){
                            var p = this.objects.particle_init(i);
                            this.objects.smokeparticles[i] = {particle:null, start:false}
                            this.objects.smokeparticles[i].particle = p;
                          };
                          
                          this.objects.markerRoot1.name = "groupFactory";
                          scene.add(this.objects.markerRoot1);
                          
                          
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
                f : null,
                //factory_init: function(){
                //          var f = new FactoryObj();
                //          //console.error(f, f._subScene);
                //          //f._subScene.name = "factory";
                //          this.markerRoot1.add(f._subScene);
                //      },
                //factory_init: function(){
                //          var f = new FactoryObj();
                //          //console.error(f, f._subScene);
                //          //f._subScene.name = "factory";
                //          f._subScene.then(function(o){o.name = 'factory'; this.markerRoot1.add(o)}).catch(function(e){if(e===null){console.log('no factory object was built')};})
                //      },
                //factory_init: function(){
                //          var f = new FactoryObj();
                //          console.error(f, f._Object);
                //      },
               factory_init: function(){
                          this.f = new FactoryObj(this.markerRoot1);
                       },
                particle_init: function(i){
                        var p = new Particle();
                        p._subScene.name = "smokeparticle"+i;
                        this.markerRoot1.add(p._subScene);
                        return p;
                },
                testcube_init: function(cubecolor, mr){
                              var mesh = new THREE.Mesh( 
                                      new THREE.CubeGeometry(1.25,1.25,1.25), 
                                      new THREE.MeshBasicMaterial(
                                                  {
                                                    color:cubecolor,
                                                    transparent:true,
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
                  if (this.objects.f._Object !== null) {
                    //code
                    console.log(5555, this.objects.f._Object.getWorldDirection());
                  }
                  
                  /////
                  document.getElementById("entryscene2").style.width = "0";
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
                   if (this.objects.f._Object != null) {
                    //code
                    this.objects.f._Object.position.y -= 0.01;
                    //console.log(this.objects.f._Object.position.y);
                    if (this.objects.f._Object.position.y < -3.) {
                      document.getElementById("entryscene3").style.width = "0";

                      this.objects.f._Object = null;
                      sceneelements3.initAR();
                      sceneelements3.updateAR();                      
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
                if ( this.arToolkitSource.ready !== false ) this.arToolkitContext.update( this.arToolkitSource.domElement );
                if (this.arToolkitContext.arController !== null) {
                  //console.log(Object.keys(this.arToolkitContext));
                  //console.log(this.arToolkitContext);
                  //console.log(Object.keys(this.arToolkitContext.arController));
                  //console.log(this.arToolkitContext.arController.listeners);
                  //this.arToolkitContext.arController.addEventListener('getMarker',(evt)=>{console.log(evt)})
                  //console.log(this.arToolkitContext.arController.listeners.getMarker[0]);
                  //console.log(this.arToolkitContext.arMarkerControls[0].object3d.visible);
                  //sys.exit(0);
                  //console.log(this.objects.markerRoot1.children[0].material.color.r);
                  //var colorFactory = this.objects.markerRoot1.children[0].material.color;
                  //console.log(1111, this.objects.f)
                  var zelf = this;
                  if (this.arToolkitContext._arMarkersControls[4].object3d.visible) {
                  //this.renderer.clippingPlanes[0].setFromNormalAndCoplanarPoint(
                  //    new THREE.Vector3(1,0,0).applyQuaternion(scene.getWorldQuaternion()),
                  //    scene.getWorldPosition());
                    //console.log('found ', this.arToolkitContext._arMarkersControls[4].object3d);
                    countfoundHiro += 1;
                    if (countfoundHiro > 20) { //approx. 20 frames
                      document.getElementById("entryscene3").style.width = "100%";
                      emitter.subscribe('event:greener', function(data){
                        //console.log(data);
                        //if (data.value) {
                          verifierEvt += 1;
                          //console.log(data.value, countfoundHiro, verifierEvt);
                          //console.log(zelf.arToolkitContext._arMarkersControls[4].object3d.children[0].children[0].material);
                          colorFactoryObj = zelf.arToolkitContext._arMarkersControls[4].object3d.children[0].children[0].material.color
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
            
            
        return {app_init: app_init, tick: ()=>console.log('tick'), video: null};
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
            var element = document.getElementById("entryscene1");
            element.parentNode.removeChild(element);
            this.canvas_init();
            this.arjsvideo_init();
        }).bind(init_obj);
        
        window.emitter = new CustomEventEmitter(); //it must be public or something that can travel between modules
        
        window.closeNav = function(){
            document.getElementById("entryscene2").style.width = "0";
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