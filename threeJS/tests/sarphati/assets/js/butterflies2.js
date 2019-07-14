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
                    
var Cube = function () {
    //E:
    /*  FUNCTION OBJECT: Smoke */
    function Cube(options) {

      _classCallCheck(this, Cube); //E: this is in this case var Smoke defined AS GLOBAL; the question is if that variable is defined as Smoke Constructor
      
      var defaults = {
        width: 5,
        height: 5,
        depth: 5,
        _mesh:null
      };
  
      Object.assign(this, options, defaults);
      this.init();
    }
  
    //E: it is HERE where the Constructor type is assigned and the real class created
    // notice that the design by this author consists in passing all the properties as OBJECTS to the FACTORY
    _createClass(Cube, [
            { 
            key: 'init',
            value: function init() {
                    var meshGeometry = new THREE.CubeGeometry(200, 200, 200);
                    var meshMaterial = new THREE.MeshBasicMaterial({
                    color:0x0000ff,
                    wireframe: false
                    });
                    _mesh = new THREE.Mesh(meshGeometry, meshMaterial);
                }
            },
            {
            key: 'mesh',
            value: function mesh(){
                return _mesh
              }
            },
            {
            //E: evolveSmoke gets every smokeParticles and rotate them on z relative to time (not frame)
            key: 'evolveCube',
            value: function evolveCube() {
                }
            }
      ]);
  
    //E: return the class!
    return Cube;
}(); //<--- run ALL the functions at instantiation

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
                      bodyTexture: new THREE.TextureLoader().load('https://klevron.github.io/codepen/butterflies/b1.png'),
                      bodyW: 10,
                      bodyH: 15,
                      wingTexture: new THREE.TextureLoader().load('https://klevron.github.io/codepen/butterflies/b1w.png'),
                      wingW: 10, wingH: 15,
                      wingX: 5.5
                    },
                    {
                      bodyTexture: new THREE.TextureLoader().load('https://klevron.github.io/codepen/butterflies/b1.png'),
                      bodyW: 6,
                      bodyH: 9,
                      wingTexture: new THREE.TextureLoader().load('https://klevron.github.io/codepen/butterflies/b2w.png'),
                      wingW: 15,
                      wingH: 20,
                      wingX: 7.5
                    },
                    {
                      bodyTexture: new THREE.TextureLoader().load('https://klevron.github.io/codepen/butterflies/b1.png'),
                      bodyW: 8,
                      bodyH: 12,
                      wingTexture: new THREE.TextureLoader().load('https://klevron.github.io/codepen/butterflies/b3w.png'),
                      wingW: 10,
                      wingH: 15,
                      wingX: 5.5
                    },
                    {
                      bodyTexture: new THREE.TextureLoader().load('https://klevron.github.io/codepen/butterflies/b4.png'),
                      bodyW: 6,
                      bodyH: 10,
                      bodyY: 2,
                      wingTexture: new THREE.TextureLoader().load('https://klevron.github.io/codepen/butterflies/b4w.png'),
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
                    var material = new THREE.MeshBasicMaterial({ transparent: false, color: 'yellow', side: THREE.DoubleSide, depthTest: false });
                    
                    var lwmesh = new THREE.Mesh(geometry, material);
                    lwmesh.position.x = -bconf.wingX;
                    this.lwing.add(lwmesh);
                  
                    var rwmesh = new THREE.Mesh(geometry, material);
                    rwmesh.rotation.y = Math.PI;
                    rwmesh.position.x = bconf.wingX;
                    this.rwing.add(rwmesh);
                  
                    geometry = new THREE.PlaneGeometry(bconf.bodyW, bconf.bodyH);
                    material = new THREE.MeshBasicMaterial({ transparent: false, map: bconf.bodyTexture, side: THREE.DoubleSide, depthTest: false });
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

var Scene = function(){ //adding parameters here and then calling them will have NO effect over defaults
        function Scene(options){
            _classCallCheck(this, Scene);
            var defaults = {
              width: window.innerWidth, // currently pointing to a outer-scoped variable: TODO as getter/setter?
              height: window.innerHeight
            };
            Object.assign(this, options, defaults);
            this.onResize = this.onResize.bind(this);
            this.addEventListeners();
            //this.init();            
        };
        
        _createClass(Scene,
                     [{
                        key: 'init',
                        value: function init(){
                            
                            var width = this.width;
                            var height = this.height;
                            
                            this.clock = new THREE.Clock();
                            
                            var renderer = this.renderer = new THREE.WebGLRenderer({alpha:true}); //make background transparent with alpha
                            renderer.setClearAlpha(0.0);
                            
                            renderer.setSize(width, height);
                            
                            this.scene = new THREE.Scene();
                            this.addCamera();
                            this.addLights();
                            this.addButterflies();
                      
                            document.body.appendChild(renderer.domElement);
                        }
                     },
                    {
                      //E: addLight is exactly that; it is pointing close to the center and difuse
                      key: 'addMesh',
                      value: function addMesh(mesh) {
                        var scene = this.scene;
                        scene.add(mesh);
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
                  
                        camera.position.z = 10;
                        scene.add(camera);
                      }
                    },
                    {
                      key: 'render',
                      value: function render() {
                        this.renderer.render(this.scene, this.camera);
                      }
                    },
                    {
                      //E: addBackground is exactly that, with some modifications of texture (blending, map.minFilter as linear);
                      //-- it is VERY up front
                      //-- it also reflects LIGHT
                      key: 'addBackground',
                      value: function addBackground(video) {
                        //var scene = this.scene;
                        //var textureLoader = new THREE.TextureLoader();
                        //var textGeometry = new THREE.PlaneBufferGeometry(600, 320);
                        //var texture = new THREE.VideoTexture( video );
                        //var textMaterial = new THREE.MeshBasicMaterial( { map: texture } );
                        //textMaterial.map.minFilter = THREE.LinearFilter;
                        //var text = new THREE.Mesh(textGeometry, textMaterial);
                        //text.position.z = 800;
                      }
                    },
                    {
                     key: 'butterflies',
                     value: []
                    },
                    {
                     key: 'addButterflies',
                     value: function addButterflies(){
                        var scene = this.scene;
                        const nbButterflies = 15;
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
                    {
                      //E: runs evolveSmoke and re-render; assign update function to requestAnimationFrame
                      key: 'update',
                      value: function update() {
                        var zelf = this;
                        var scene = this.scene;
                        //console.error(zelf);
                        requestAnimationFrame(update.bind(this));
                        TWEEN.update();
                        for (var i = 0; i < this.butterflies.length; i++) {
                          this.butterflies[i].move();
                        };
                        this.render();
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
                    }
                     ]);
        
        return Scene;
    
    }();


var app = (function APPmodule(){
            /*--- misc var ---*/
            var _guiGlobal;
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
                var cube = new Cube();
                var scene = new Scene();
                scene.width = _canvasWidthGraphics;
                scene.height = _canvasHeightGraphics;
                //console.log(scene.width, _canvasWidthGraphics, scene.height, _canvasHeightGraphics);
                scene.init(); //if instantiated at CLASS, this will instantiate another canvas!; but if not previous instantiation, I can modify defaults
                //scene.addBackground(_app_vid);
                //scene.addMesh(cube.mesh());
                scene.render();
                scene.update();
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