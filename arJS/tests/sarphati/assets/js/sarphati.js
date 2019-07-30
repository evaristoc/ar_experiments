/*
--- _createClass and _classCheck are util functions
--- _createClass seems to be a factory or a builder
--- _classCallCheck is a private function to check for class as a function (function instantiated as Constructor in this case)
*/

const statsGlobal = new Stats();
const guiGlobal = new dat.GUI();
guiGlobal.close();

var _createClass = function () {
                      function defineProperties(target, props) {
                        for (var i = 0; i < props.length; i++) {
                          var descriptor = props[i];
                          descriptor.enumerable = descriptor.enumerable || false;
                          descriptor.configurable = true;
                          if ("value" in descriptor) descriptor.writable = true;
                          Object.defineProperty(target, descriptor.key, descriptor);
                        }
                      }
                      return function (Constructor, protoProps, staticProps) {
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
                        zelf._subScene.add(obj);
                      })
                  }
    
  };
  
  window.FactoryObj = FactoryObj;  
  
})();


/**********************
  PSEUDO-PARTICLES OBJECTS
 ********************/

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


/**********************
  ARJS OBJECT (tool)
 ********************/
var ARJS = function(){
      
      function ARJS(options){
          _classCallCheck(this, ARJS);
          var defaults = {
            arToolkitSource: new THREEx.ArToolkitSource(),
            arToolkitContext: new THREEx.ArToolkitContext(),
            markerRoot: new THREE.Object3D(),
            markerControls : new THREEx.ArMarkerControls
          };
          Object.assign(this, options, defaults);
          this.init();
      };
      
      _createClass(ARJS,
      [
        {
          key:'init',
          value: function init(){
            console.log('ARJS');
            
            this.arToolkitSource.sourceType = 'webcam';
            
            this.arToolkitContext.cameraParametersUrl = '../../arjs-resources/data/camera_para.dat';
            this.arToolkitContext.detectionMode = 'mono';
          }
        },
        {
          key: 'artoolkitcontextinit',
          value: function artoolkitcontextinit(camera){
              function onCompleted(){
                camera.projectionMatrix.copy( this.arToolkitContext.getProjectionMatrix() );
              };
              
              this.arToolkitContext.init(onCompleted.bind(this)); //otherwise `this` of onCompleted is window
          }
        },
        {
          key: 'linkobjtomarker',
          value: function linkobjtomarker(){
            this.markerControls(
                                this.arToolkitContext,
                                this.markerRoot,
                                {
                                  type: 'pattern',
                                  patternUrl: "../../arjs-resources/data/hiro.patt"
                                }
                              );
          }
        },
        {
          key:'onResize',
          value: function onResize(renderer){
            this.arToolkitSource.onResize();
            this.arToolkitSource.copySizeTo(renderer.domElement);
            if ( this.arToolkitContext.arController !== null )
            {
                this.arToolkitSource.copySizeTo(this.arToolkitContext.arController.canvas);	
            };           
          }
        }
      ]
      );
      
      return ARJS;
}();

	
	// handle resize event
	window.addEventListener('resize', function(){
		onResize()
	});
    
        arToolkitContext.init( function onCompleted(){
            camera.projectionMatrix.copy( arToolkitContext.getProjectionMatrix() );
        });

///**********************
//  SCENE OBJECT
// ********************/
//var Scene = function(){ //adding parameters here and then calling them will have NO effect over defaults
//        function Scene(options){
//            _classCallCheck(this, Scene);
//            var defaults = {
//              width: window.innerWidth, // currently pointing to a outer-scoped variable: TODO as getter/setter?
//              height: window.innerHeight
//            };
//            Object.assign(this, options, defaults);
//            this.onResize = this.onResize.bind(this);
//            this.addEventListeners();
//            //this.init();            
//        };
//        
//        _createClass(Scene,
//                     [{
//                        key: 'init',
//                        value: function init(){
//                            
//                            var width = this.width;
//                            var height = this.height;
//                            
//                            this.clock = new THREE.Clock();
//                            
//                            var renderer = this.renderer = new THREE.WebGLRenderer({alpha:true}); //make background transparent with alpha
//                            renderer.setClearAlpha(0.0);
//                            
//                            renderer.setSize(width, height);
//                            
//                            this.scene = new THREE.Scene();
//                            this.addCamera();
//                            this.addLights();
//                            this.addButterflies();
//                      
//                            document.body.appendChild(renderer.domElement);
//                            document.body.appendChild(statsGlobal.domElement);
//                        }
//                     },
//                    {
//                      //E: addLight is exactly that; it is pointing close to the center and difuse
//                      key: 'addMesh',
//                      value: function addMesh(mesh) {
//                        var scene = this.scene;
//                        scene.add(mesh);
//                      }
//                    },                     
//                    {
//                      //E: addLight is exactly that; it is pointing close to the center and difuse
//                      key: 'addLights',
//                      value: function addLights() {
//                        var scene = this.scene;
//                  
//                        var light = new THREE.DirectionalLight(0xffffff, 0.75);
//                  
//                        light.position.set(-1, 0, 1);
//                        scene.add(light);
//                      }
//                    },
//                    {
//                      //E: addCamera is exactly that; usual settings
//                      key: 'addCamera',
//                      value: function addCamera() {
//                        var scene = this.scene;
//                  
//                        var camera = this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 1, 10000);
//                  
//                        camera.position.z = 10;
//                        scene.add(camera);
//                      }
//                    },
//                    {
//                      key: 'render',
//                      value: function render() {
//                        this.renderer.render(this.scene, this.camera);
//                      }
//                    },
//                    {
//                      //E: addBackground is exactly that, with some modifications of texture (blending, map.minFilter as linear);
//                      //-- it is VERY up front
//                      //-- it also reflects LIGHT
//                      key: 'addBackground',
//                      value: function addBackground(video) {
//                        //var scene = this.scene;
//                        //var textureLoader = new THREE.TextureLoader();
//                        //var textGeometry = new THREE.PlaneBufferGeometry(600, 320);
//                        //var texture = new THREE.VideoTexture( video );
//                        //var textMaterial = new THREE.MeshBasicMaterial( { map: texture } );
//                        //textMaterial.map.minFilter = THREE.LinearFilter;
//                        //var text = new THREE.Mesh(textGeometry, textMaterial);
//                        //text.position.z = 800;
//                      }
//                    },
//                    {
//                     key: 'butterflies',
//                     value: []
//                    },
//                    {
//                     key: 'nbButterflies',
//                     value: 15
//                    },
//                    {
//                     key: 'addButterflies',
//                     value: function addButterflies(){
//                        var scene = this.scene;
//                        for(let i = 0; i < this.butterflies.length; i++){
//                          scene.remove(this.butterflies[i].meshObj);
//                        };
//                        this.butterflies = [];
//                        
//                        const nbButterflies = this.nbButterflies;
//                        function shuffle(_b){
//                            for (var i = 0; i < _b.length; i++) {
//                              _b[i].shuffleHELPER();
//                            };
//                        };
//                        
//                        for (var i = 0; i < nbButterflies; i++) {
//                          var b = new Butterfly();
//                          this.butterflies.push(b);
//                          scene.add(b.meshObj);
//                        };
//                        
//                        shuffle(this.butterflies);
//                        //console.log(this.butterflies);
//                     }
//                    },
//                    {
//                      //E: runs evolveSmoke and re-render; assign update function to requestAnimationFrame
//                      key: 'update',
//                      value: function update() {
//                        var zelf = this;
//                        var scene = this.scene;
//                        //console.error(zelf);
//                        statsGlobal.begin();
//                        requestAnimationFrame(update.bind(this));
//                        TWEEN.update();
//                        for (var i = 0; i < this.butterflies.length; i++) {
//                          this.butterflies[i].move();
//                        };
//                        this.render();
//                        statsGlobal.end();
//                      }
//                    },
//                    {
//                      //E: helper for resizing parameters
//                      key: 'onResize',
//                      value: function onResize() {
//                        var camera = this.camera;
//                  
//                  
//                        var windowWidth = window.innerWidth;
//                        var windowHeight = window.innerHeight;
//                  
//                        camera.aspect = windowWidth / windowHeight;
//                        camera.updateProjectionMatrix();
//                  
//                        this.renderer.setSize(windowWidth, windowHeight);
//                      }
//                    },
//                    {
//                      //E: helper for adding listeners (resizing)
//                      key: 'addEventListeners',
//                      value: function addEventListeners() {
//                        window.addEventListener('resize', this.onResize);
//                      }
//                    }
//                     ]);
//        
//        return Scene;
//    
//    }();


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

            function app_init(app_canvas, app_video, videoWidth, videoHeight) {
                (function canvas_setup(){
                    _canvasWidthGraphics  = app_canvas.width;
                    _canvasHeightGraphics = app_canvas.height;
                    _ctxGraphics = app_canvas.getContext('2d');
                    _ctxGraphics.fillStyle = "rgb(0,255,0)";
                    _ctxGraphics.strokeStyle = "rgb(0,255,0)";
                    _app_vid = app_video;
                  }());
                //var cube = new Cube();
                var scene = new THREE.Scene();
                var clock = new THREE.Clock();
                
                var renderer1 = (function(){
                                  var renderer = new THREE.WebGLRenderer({
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
                                  return renderer;
                          }());
                
                
                scene.width = _canvasWidthGraphics;
                scene.height = _canvasHeightGraphics;
                var guicontroller = guiGlobal.add(scene, 'nbButterflies').step(1);
                guicontroller.onChange(function(val){
                          console.log(val);
                          scene.addButterflies();
                        });
                //console.log(scene.width, _canvasWidthGraphics, scene.height, _canvasHeightGraphics);
                scene.init(); //if instantiated at CLASS, this will instantiate another canvas!; but if not previous instantiation, I can modify defaults
                //scene.addBackground(_app_vid);
                //scene.addMesh(cube.mesh());
                scene.render();
                scene.update();
            };
        return {app_init: app_init, tick: ()=>console.log('tick')};
    }());


/**********************
  HTML SETUP MODULE
 ********************/

(function HTMLSETUPmodule(app_EXTERNAL){
    const WIDTHGlobal = 480;
    const HEIGHTGlobal = 360;
    var CANVASGlobal;
    var VIDEOGlobal;
    const widthGlobal = Math.round(60 * WIDTHGlobal / HEIGHTGlobal);
    const heightGlobal = 60;

    /*--- PRIVATE FUNCTIONS setup ---*/
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
        var THIS = this;
        if (VIDEOGlobal.videoWidth > 0 && VIDEOGlobal.videoHeight > 0) {
            _onDimensionsReadyMiddleW(VIDEOGlobal.videoWidth, VIDEOGlobal.videoHeight);
            VIDEOGlobal.removeEventListener('loadeddata', function(e){_findVideoSizeMiddleW()});
        } else {
              if(attempts < 10) {
                  attempts++;
                  setTimeout(_findVideoSizeMiddleW, 200);
              } else {
                 _onDimensionsReadyMiddleW(640, 480);
              }
          };
      };
      
      function _onDimensionsReadyMiddleW(widthGlobal, heightGlobal){
          var THIS = this;
          app_EXTERNAL.app_init(CANVASGlobal, VIDEOGlobal, widthGlobal, heightGlobal);
          var counter = 0;
          app_EXTERNAL.tick(); 
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
                      VIDEOGlobal.addEventListener('loadeddata', function(e){_findVideoSizeMiddleW()});
                      var attemps = 0;
                      var voptions = {};
                      var mob = _detectmob();
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
                      $('#no_rtc').html('<h4>Something goes wrong...</h4>');
                      $('#no_rtc').show();                        
                    }
                },
      };
      
    $(window).load(function(){
        'use strict';
        init_obj.canvas_init();
        init_obj.video_init();               
    })
  }(app))


///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////


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
const nbButterflies = 100;
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
        $('.sidenav').width(wWidth*1.5);

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
        renderer.setClearAlpha(lengthB/(1.2*nbButterflies));
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