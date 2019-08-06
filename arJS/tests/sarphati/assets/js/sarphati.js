/*
--- _createClass and _classCheck are util functions
--- _createClass seems to be a factory or a builder
--- _classCallCheck is a private function to check for class as a function (function instantiated as Constructor in this case)
*/

const statsGlobal = new Stats();
//const guiGlobal = new dat.GUI();
//guiGlobal.close();

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
            //var wWidth = window.innerWidth;
            //var wHeight = window.innerHeight;
            var wWidth;
            var wHeight;
            var cameraCtrl;
            
            
            var sceneelements1 = {
              renderer: null,
              camera: null,
              cameraCtrl: null,
              opacitybackground: 1.0,
              init: function(){
                          this.renderer = this.renderer_init();
                          this.camera = this.camera_init();
                          this.camera.position.z = 10;
                          cameraCtrl = new THREE.OrbitControls(this.camera);
                          scene.add(this.camera);
                          //sceneelements1.cameraCtrl = sceneelements1.cameraCtrls1_init.orbit.call(sceneelements1);
                          
                          scene.add(this.lights_init.ambient());
                          this.objects.bttfls_init();
                          
                          document.body.appendChild(this.renderer.domElement);
                          window.addEventListener('onresize', this.listeners_init.onResize.bind(this));
                    
                    },
              renderer_init: function(){
                            var renderer = new THREE.WebGLRenderer({
                                antialias : true,
                                alpha: true
                            });
                            renderer.setPixelRatio( window.devicePixelRatio );
                            renderer.setClearAlpha(this.opacitybackground);
                            renderer.setSize(wWidth, wHeight); //set CANVAS size
                            renderer.domElement.style["display"]  = "block";
                            renderer.domElement.style["position"] = "fixed";
                            //renderer.domElement.style["width"]    = "100%";
                            //renderer.domElement.style["height"]   = "100%";
                            renderer.domElement.style["width"]    = wWidth; //set RENDERING AREA size (not the same as canvas size!); it can overflow the canvas size.
                            renderer.domElement.style["height"]   = wHeight;
                            renderer.domElement.style["top"] = '0px';
                            renderer.domElement.style["left"] = '0px'; 
                            return renderer;                        
                      },
              camera_init: function(){
                    return new THREE.PerspectiveCamera(50, wWidth / wHeight, 0.1, 1000)
                      },
              lights_init: {
                          ambient: function(){ return new THREE.AmbientLight( 0xcccccc, 0.5 )},
                      },
              cameraCtrls_init: {
                          orbit: function(){
                            var camera = this.camera;
                            return new THREE.OrbitControls(camera);
                            }
                      },
              listeners_init: {
                onResize: function(){
                    var camera = this.camera;
                    //var windowWidth = window.innerWidth;
                    //var windowHeight = window.innerHeight;
                    //camera.aspect = windowWidth / windowHeight;
                    //camera.updateProjectionMatrix();
                    //this.renderer.setSize(windowWidth, windowHeight);
                    camera.aspect = wWidth / wHeight;
                    camera.updateProjectionMatrix();
                    this.renderer.setSize(wWidth , wHeight);
                },
              },
              objects: {
                butterflies : [],
                
                nbButterflies: 100,
                
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
              }
              
            };
            
            var sceneelements2 = {
              renderer: null,
              camera: null,
              arToolkitSource: null,
              arToolkitContext: null,
              init: function(){

                   
                    this.camera = this.camera_init();
                    scene.add(this.camera);

                    ////////////////////////////////////////////////////////////
                    // setup arToolkitContext
                    ////////////////////////////////////////////////////////////	
                
                    // create atToolkitContext
                    this.arToolkitContext = new THREEx.ArToolkitContext({
                        cameraParametersUrl: '../../arjs-resources/data/camera_para.dat',
                        detectionMode: 'mono'
                    });
                    //E: a simple solution for onResize not look for the window scope from arToolkitSource.onResizeElement() method in onResize listener,
                    // needed a wrapper function, and to pass context as argument to onResize after context normalization (`var zelf = this`)
                    //https://stackoverflow.com/questions/1338599/the-value-of-this-within-the-handler-using-addeventlistener
                    //console.error(this);
                    //onResize.bind(this); //trying binding `this` to onResize didn't work :(
                    var zelf = this;
                    var onResize = this.listeners_init.onResize;
                    function intheeventlistenerhandler(){
                        onResize(zelf);  
                    }                     

                    arToolkitSource.init(function onReady(){
                        intheeventlistenerhandler();
                    });

                    // handle resize event
                    window.addEventListener('resize', intheeventlistenerhandler);
                  
                },
              renderer_init: function(){
                    //same as sceneelements1
                },
              camera_init: function(){
                  return new THREE.Camera();
                },
              lights_init: {
                    //same as sceneelements1
                },
              cameraCtrls_init: {
                    //not required for this part
                },
              listeners_init: {
                  //onResize: function(){
                  //  console.error(this);
                  //  this.arToolkitSource.onResize()	
                  //  this.arToolkitSource.copySizeTo(this.renderer.domElement)	
                  //  if ( this.arToolkitContext.arController !== null )
                  //  {
                  //      this.arToolkitSource.copySizeTo(this.arToolkitContext.arController.canvas)	
                  //  }	
                  //},
                  onResize: function(t){
                    //console.error(t);
                    arToolkitSource.onResizeElement(); //this function involves a non-explicit while-loop that is hard to handle with `this`!!	
                    arToolkitSource.copyElementSizeTo(t.renderer.domElement);
                    if ( t.arToolkitContext.arController !== null )
                    {
                        console.log(t.arToolkitContext.arController);
                        arToolkitSource.copyElementSizeTo(t.arToolkitContext.arController.canvas)	
                    };
                  }
                },
              objects:{
                  factory: function(){
                    var markerRoot1 = new THREE.Group();
                    scene.add(markerRoot1);
                    var markerControls1 = new THREEx.ArMarkerControls(
                                                                      this.arToolkitContext,
                                                                      markerRoot1,
                                                                      {
                                                                        type: 'pattern',
                                                                        patternUrl: "../../arjs-resources/data/hiro.patt",
                                                                      });
                    
                  }
                },
              update:function(){
                    	if ( this.arToolkitSource.ready !== false ) this.arToolkitContext.update( this.arToolkitSource.domElement );
                }
            };
            

            function app_init(app_canvas, app_video, videoWidth, videoHeight) {
                (function canvas_setup(){
                    //_canvasWidthGraphics  = app_canvas.width;
                    //_canvasHeightGraphics = app_canvas.height;
                    //_ctxGraphics = app_canvas.getContext('2d');
                    //_ctxGraphics.fillStyle = "rgb(0,255,0)";
                    //_ctxGraphics.strokeStyle = "rgb(0,255,0)";
                    //_app_vid = app_video;
                    wWidth = videoWidth;
                    wHeight = videoHeight;                    
                  }());
                //var cube = new Cube();
                scene = new THREE.Scene();
                clock = new THREE.Clock();
               sceneelements1.init();
               //sceneelements1.update();
               sceneelements2.renderer = sceneelements1.renderer; //both renderers are the same
               sceneelements2.init();
               //sceneelements2.update();

            };
            
            
        return {app_init: app_init, tick: ()=>console.log('tick'), video: null};
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
        //console.error(333);
        //console.error(attempts);
        if (VIDEOGlobal != undefined && VIDEOGlobal.videoWidth > 0 && VIDEOGlobal.videoHeight > 0) {
            //console.error(3331);
            _onDimensionsReadyMiddleW(VIDEOGlobal.videoWidth, VIDEOGlobal.videoHeight);
            VIDEOGlobal.removeEventListener('loadeddata', function(e){_findVideoSizeMiddleW()});
        } else if (attempts !== false) { // what happens with `attempts`?? why must be a global?????
              //console.error(3332);
              if(attempts < 10) {
                  attempts++;
                  setTimeout(_findVideoSizeMiddleW, 200);
              } else {
                 _onDimensionsReadyMiddleW(640, 480);
              }
        } else {
          //console.error(3333);
          //arjs entry
          _onDimensionsReadyMiddleW(null, null); //always enter this one; only for testing
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
                      window.arToolkitSource = new THREEx.ArToolkitSource({ //arToolkitSource for camera search can be set as window
                          sourceType : 'webcam',
                      });
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
        init_obj.canvas_init();
        //init_obj.video_init();
        init_obj.arjsvideo_init();
    })
  }(app))