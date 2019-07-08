/*
--- _createClass and _classCheck are util functions
--- _createClass seems to be a factory or a builder
--- _classCallCheck is a private function to check for class as a function (function instantiated as Constructor in this case)
*/
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
                    
var Smoke = function () {
    //E:
    /*  FUNCTION OBJECT: Smoke */
    function Smoke(options) {
  
    
    
      _classCallCheck(this, Smoke); //E: this is in this case var Smoke defined AS GLOBAL; the question is if that variable is defined as Smoke Constructor
  
      
      
      
      var defaults = {
        width: window.innerWidth,
        height: window.innerHeight
      };
  
      Object.assign(this, options, defaults);
      //this.onResize = this.onResize.bind(this);
  
  
    
      
      
      //this.addEventListeners();
      this.init();
    }
  
    //E: it is HERE where the Constructor type is assigned and the real class created
    // notice that the design by this author consists in passing all the properties as OBJECTS to the FACTORY
    _createClass(Smoke, [
      { 
      //E: init is a mesh in a form of a cube; it is the container of the scene
      //-- the cube role is unclear; it seems to be a trick to generate artifical holes in the smoke screen
      //-- later in the rendering function it can be seen that the the cube move cyclically around z (back and forwad)
      //-- however, commenting the code doesnt seem to change anything
      key: 'init',
      value: function init() {
        var width = this.width,
            height = this.height;
  
  
        this.clock = new THREE.Clock();
  
        var renderer = this.renderer = new THREE.WebGLRenderer({alpha:true}); //make background transparent with alpha
        renderer.setClearAlpha(0.0);
  
        renderer.setSize(width, height);
        //renderer.setClearColor( 0xffffff, 0);
        
        
        this.scene = new THREE.Scene();
        //this.scene.background = new THREE.Color( 0xffffff );
  
        //var meshGeometry = new THREE.CubeGeometry(200, 200, 200);
        ////var meshGeometry = new THREE.SphereGeometry(200, 200, .1);
        ////var meshMaterial = new THREE.MeshLambertMaterial({
        //var meshMaterial = new THREE.MeshBasicMaterial({
        //  //color: 0xaa6666,
        //  //color: 0x000000,
        //  color:0x0000ff,
        //  wireframe: false
        //});
        //this.mesh = new THREE.Mesh(meshGeometry, meshMaterial);
        //
        ////// wireframe
        //////https://stackoverflow.com/questions/31539130/display-wireframe-and-solid-color
        ////var geo = new THREE.EdgesGeometry( this.mesh.geometry ); // or WireframeGeometry
        ////var mat = new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 20 } );
        ////var wireframe = new THREE.LineSegments( this.geo, this.mat );
        ////this.mesh.add( wireframe );
        //
        //this.cubeSineDriver = 0;
  
        this.addCamera();
        this.addLights();
        this.addParticles();
        this.addBackground();
  
        document.body.appendChild(renderer.domElement);
      }
    },
    {
      //E: evolveSmoke gets every smokeParticles and rotate them on z relative to time (not frame)
      key: 'evolveSmoke',
      value: function evolveSmoke(delta) {
        var smokeParticles = this.smokeParticles;
  
  
        var smokeParticlesLength = smokeParticles.length;
  
        while (smokeParticlesLength--) {
          smokeParticles[smokeParticlesLength].rotation.z += delta * .2;
        }
      }
    },
    {
      //E: addLight is exactly that; it is pointing close to the center and difuse
      key: 'addLights',
      value: function addLights() {
        var scene = this.scene;
  
        var light = new THREE.DirectionalLight(0xffffff, 0.75);
  
        light.position.set(-1, 0, 1);
        scene.add(light);
      }
    },
    {
      //E: addCamera is exactly that; usual settings
      key: 'addCamera',
      value: function addCamera() {
        var scene = this.scene;
  
        var camera = this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 1, 10000);
  
        camera.position.z = 1000;
        scene.add(camera);
      }
    },
    {
      //E: particles are actually PANELS (planes); here is where smokeParticles are defined
      key: 'addParticles',
      value: function addParticles() {
        var scene = this.scene;
  
        var textureLoader = new THREE.TextureLoader();
        var smokeParticles = this.smokeParticles = []; //<--- smokeParticles is an attribute of the class
  
        textureLoader.load('public/assets/clouds.png', function (texture) {
          var smokeMaterial = new THREE.MeshLambertMaterial({
            //color: 0xffffff,
            color:'red',
            map: texture,
            transparent: true
          });
          smokeMaterial.map.minFilter = THREE.LinearFilter;
          var smokeGeometry = new THREE.PlaneBufferGeometry(500, 500);
          //var smokeGeometry = new THREE.BoxBufferGeometry(0, 0, 5, 5);
          
          var smokeMeshes = [];
          var limit = 50;
          //var limit = 2000;
          while (limit--) {
            smokeMeshes[limit] = new THREE.Mesh(smokeGeometry, smokeMaterial);
            smokeMeshes[limit].position.set(Math.random() * 500 - 250, Math.random() * 500 - 250, Math.random() * 1000 - 100);
            smokeMeshes[limit].rotation.z = Math.random() * 360;
            smokeParticles.push(smokeMeshes[limit]);
            scene.add(smokeMeshes[limit]);
          }
        });
      }
    },
    {
      //E: addBackground is exactly that, with some modifications of texture (blending, map.minFilter as linear);
      //-- it is VERY up front
      //-- it also reflects LIGHT
      key: 'addBackground',
      value: function addBackground() {
        var scene = this.scene;
  
        var textureLoader = new THREE.TextureLoader();
        var textGeometry = new THREE.PlaneBufferGeometry(600, 320);
  
        //textureLoader.load('background.jpg', function (texture) {
        //  var textMaterial = new THREE.MeshLambertMaterial({
        //    blending: THREE.AdditiveBlending,
        //    color: 0xffffff,
        //    //color:'red',
        //    map: texture,
        //    opacity: 1,
        //    transparent: true
        //  });
        //  textMaterial.map.minFilter = THREE.LinearFilter;
        //  var text = new THREE.Mesh(textGeometry, textMaterial);
        //
        //  text.position.z = 800;
        //  //scene.add(text);
        //});
        
        var texture = new THREE.VideoTexture( video );
        var textMaterial = new THREE.MeshBasicMaterial( { map: texture } );
        textMaterial.map.minFilter = THREE.LinearFilter;
        var text = new THREE.Mesh(textGeometry, textMaterial);
        text.position.z = 800;
        //scene.add(text);
      }
    },
    {
      //E: update position and rotation of the cube background and render scene and camera
      key: 'render',
      value: function render() {
        //var mesh = this.mesh;
        //var cubeSineDriver = this.cubeSineDriver;
  
  
        //cubeSineDriver += 0.2;
  
        //mesh.rotation.x += 0.005;
        //mesh.rotation.y += 0.01;
        //mesh.position.z = 100 + Math.sin(cubeSineDriver) * 500;
        //mesh.position.x = 0 + Math.sin(cubeSineDriver) * 500;
  
        this.renderer.render(this.scene, this.camera);
      }
    },
    {
      //E: runs evolveSmoke and re-render; assign update function to requestAnimationFrame
      key: 'update',
      value: function update() {
        this.evolveSmoke(this.clock.getDelta());
        this.render();
  
        requestAnimationFrame(this.update.bind(this));
      }
    },
    {
      //E: helper for resizing parameters
      key: 'onResize',
      value: function onResize() {
        var camera = this.camera;
  
  
        var windowWidth = window.innerWidth;
        var windowHeight = window.innerHeight;
  
        camera.aspect = windowWidth / windowHeight;
        camera.updateProjectionMatrix();
  
        this.renderer.setSize(windowWidth, windowHeight);
      }
    },
    {
      //E: helper for adding listeners (resizing)
      key: 'addEventListeners',
      value: function addEventListeners() {
        window.addEventListener('resize', this.onResize);
      }
    }]);
  
    //E: return the class!
    return Smoke;
}(); //<--- run ALL the functions at instantiation

var Scene = function(){
        function Scene(options){
            _classCallCheck(this, Scene);
            var defaults = {
              width: window.innerWidth,
              height: window.innerHeight
            };
            Object.assign(this, options, defaults);
            //this.onResize = this.onResize.bind(this);
            //this.addEventListeners();
            this.init();            
        };
        
        _createClass(Scene,
                     [{
                        key: 'init',
                        value: function init(){
                            
                        }
                     }
                     ]);
    
    };


var app = (function APPmodule(){
            /*--- misc var ---*/
            var _guiGlobal;
            var _optionsGlobal;
            var _ctxGraphics;
            function app_init(videoWidth, videoHeight) {
                (function canvas_setup(){
                    _canvasWidthGraphics  = CANVASGlobal.width;
                    _canvasHeightGraphics = CANVASGlobal.height;
                    _ctxGraphics = CANVASGlobal.getContext('2d');
                    _ctxGraphics.fillStyle = "rgb(0,255,0)";
                    _ctxGraphics.strokeStyle = "rgb(0,255,0)";            
                  }());
            };
        return {app_init: app_init, tick: ()=>console.log('tick')};
    }());



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
          app_EXTERNAL.app_init(widthGlobal, heightGlobal);
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