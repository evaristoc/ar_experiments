'use strict';

        /** cloned from https://codepen.io/rainner/details/LREdXd **/
		/**
            * Global utils 
        */
		
		        /** cloned from https://codepen.io/rainner/details/LREdXd **/
                
    /**********************
        PRE-GLOBALS
     ********************/
        
      var arToolkitSource, arToolkitContext;
      var markerRoot;

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

    /**********************
        TEST: WHITE CUBE
     ********************/
    
    /*=========== object creation ===========*/
    (function(){
      var TestObj = function(markerRoot){
         this._subScene = markerRoot;
         this._x = 0;
         this._y = 0;
         this._z = 0;
         this.launch();
        };
      
      TestObj.prototype = {
        constructor: TestObj,
        material: function(){
            return new THREE.MeshBasicMaterial();
          },
        geometry: function(){
            return new THREE.BoxGeometry(1,1,1);
          },
        launch: function(){
            let z = this;
            let mat = z.material();
            let geo = z.geometry();
            let mesh = new THREE.Mesh(geo, mat);
            mesh.position.x = z._x;
            mesh.position.y = z._y;
            mesh.position.z = z._z;
            //markerRoot.add(mesh);
            this._subScene.add(mesh);
            //console.log('scene inside object', markerRoot);
        }
      };
      
      window.TestObj = TestObj;
      
    })();
    
    /*=========== basic scene ============*/
    //var width = window.innerWidth;
    //var height = window.innerHeight;
    //var color = new THREE.Color("#f9f4ee");
    //var cubeColor = new THREE.Color("#f9f4ee");
    //
    //// ste up our camera
    //var camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10000);
    //camera.position.y = 1.2;
    //camera.position.z = 8;
    //
    //// create our scene
    //var scene = new THREE.Scene();
    //
    //// create a renderer and then append it to the dom
    //var renderer = new THREE.WebGLRenderer({antialias: true});
    //renderer.setSize(width, height);
    //renderer.setPixelRatio(devicePixelRatio);
    //renderer.setClearColor(0x282828);
    //document.body.appendChild(renderer.domElement);
    //
    //// add our cube to our scene
    ////scene.add(cube);
    //
    //// create a light
    //var pointLight = new THREE.PointLight(0xffffff);
    //pointLight.position.set(0, 500, 300);
    //scene.add(pointLight);
    //
    ////renderer.render(scene, camera);
    //
    //new FactoryObj(scene, function(){renderer.render(scene, camera);})
    //
    //function onWindowResize( event ) {
    //    renderer.setSize( window.innerWidth, window.innerHeight );
    //    camera.aspect = window.innerWidth / window.innerHeight;
    //    camera.updateProjectionMatrix();
    //};
    //
    //window.addEventListener( 'resize', onWindowResize, false );

    /**********************
        FACTORY OBJECT
     ********************/
    
    (function(){
     //constructor parameters
     
      var FactoryObj = function(markerRoot){
         this._subScene = markerRoot;
         this._textureLoader = new THREE.TextureLoader();
         this._textureLoad = this._textureLoader.load('./public/assets/PUSHILIN_factory.png');
         this._mtlLoader = new THREE.MTLLoader();
         this._objLoader = new THREE.OBJLoader();
         this._mtlLoader.setPath( 'public/assets/' );
         this._objLoader.setPath( 'public/assets/' );
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
                          let z = this; //<----------------------------- RELEVANT: OTHER USES OF `this` BECOME `undefined`
                          
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
                          z._mtlLoader.load(z._url+'.mtl', function(materials){ // this function doesn't require to return
                                                        //materials.preload();
                                                        //console.log(materials, z, z.objLoading);
                                                        z._objLoader.setMaterials( materials );
                                                        z.objLoading();
                                  })                          
                      },
        objLoading : function(){
                        let z = this;
                        console.log(this); //<---- USEFUL...
                        z._objLoader.load(z._url+'.obj', function(obj) {
                            obj.position.x = z.to.x;
                            obj.position.y = z.to.y;
                            obj.position.z = z.to.z;
                            //https://stackoverflow.com/questions/39850083/three-js-objloader-texture
                            obj.traverse(function (child) {   // aka setTexture
                                if (child instanceof THREE.Mesh) {
                                    child.material.map = z._textureLoad;
                                }
                            });                         
                            //console.log('who', this, z); //<---- USEFUL...
                            z._subScene.add(obj);
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
            let z = this;
            let mat = z.material(z._color);
            let geo = z.geometry(z._radius);
            let mesh = new THREE.Mesh(geo, mat);
            let _diffx = Math.random()*.01*(Math.random() > .5? 1:-1);
            let _diffz = Math.random()*.01*(Math.random() > .5? 1:-1);
            mesh.position.x = z._x + _diffx;
            mesh.position.y = z._y;
            mesh.position.z = z._z + _diffz;
            //markerRoot.add(mesh);
            this._subScene.add(mesh);
            //console.log('scene inside object', markerRoot);
            z._particle = mesh;
        }
      };
      
      window.Particle = Particle;
      
    })();
   
    
    /**********************
        SCENE SETUP
     ********************/
    (function(){
        var screen    = Utils.screen(); 
        var renderer  = null;
        var camera    = null;
        var scene     = null;
        //to        = { px: 0, py: 0, pz: 2 };
        try {
            renderer = new THREE.WebGLRenderer( { alpha: true, antialias: true } ); 
            camera = new THREE.Camera();
            scene    = new THREE.Scene();
        }
        catch( e ) {
            alert( "THREE.JS Error: " + e.toString() ); 
            return; 
        }
        
        var ambientLight = new THREE.AmbientLight(0xffffff);
        ambientLight.position.set(0, 5, 3);
        scene.add(ambientLight);
        
       // // ste up our camera
       // var camera2 = new THREE.PerspectiveCamera(45, 1300 / 800, 0.1, 10000);
       // camera2.position.y = 1.2;
       // camera2.position.z = 8;
       //
       //// create our scene
       //var scene2 = new THREE.Scene();
       //
       //scene2.add(camera2);
       //scene.add(scene2);
        
        function render() {
          renderer.setPixelRatio( window.devicePixelRatio );
          renderer.setClearColor( 0x000000, 0 );
          renderer.sortObjects = true;
          renderer.setSize( 640, 480 );
          renderer.domElement.style["display"]  = "block";
          renderer.domElement.style["position"] = "fixed";
          //renderer.domElement.style["position"] = "absolute";
          renderer.domElement.style["width"]    = "100%";
          renderer.domElement.style["height"]   = "100%";
          renderer.domElement.style["z-index"]  = "-1";
          //
          renderer.domElement.style["top"] = '0px';
          renderer.domElement.style["left"] = '0px';
          
          document.body.appendChild( renderer.domElement );
          //renderer.render(scene, camera);
        };
    
    
        function setup() {
        
            camera.position.set( 0, 0, 0 );
            camera.rotation.set( 0, 0, 0 );
        
    
        
        
            ////////////////////////////////////////////////////////////
            // setup arToolkitSource
            ////////////////////////////////////////////////////////////
        
            arToolkitSource = new THREEx.ArToolkitSource({
                sourceType : 'webcam',
            });
        
            function onResize()
            {
                console.log('onResize');
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
                cameraParametersUrl: '../../arjs/data/camera_para.dat',
                detectionMode: 'mono'
            });
            
            // copy projection matrix to camera when initialization complete
            // E: this means the camera is under total control of arToolkit: I can't use it for any other thing :(
            arToolkitContext.init( function onCompleted(){
                camera.projectionMatrix.copy( arToolkitContext.getProjectionMatrix() );
            });
            
            ////////////////////////////////////////////////////////////
            // setup markerRoots
            ////////////////////////////////////////////////////////////
            
            
            // build markerControls
            markerRoot = new THREE.Object3D();
            scene.add(markerRoot);
            let markerControls = new THREEx.ArMarkerControls(arToolkitContext, markerRoot, {
                type: 'pattern', patternUrl: "../../arjs/data/hiro.patt",
            })
        };
        
        /**********************
            DRAW/ANIMATION LOOP
         ********************/
        function draw() 
        {
            
            //requestAnimationFrame(draw);
            
            if ( arToolkitSource.ready !== false ){
                //console.log('ready');
                arToolkitContext.update( arToolkitSource.domElement );
            }
            //console.log(factoryObj._render);
            //factoryObj._render();
           
            //for (let i = 0; i < 100; i++) {
            //  if (smokeParticles[i].start === false) {
            //    smokeParticles[i].start = Math.random() > .2? false:true;
            //    console.log(smokeParticles[i].start);
            //  }
            //  else {
            //    let s_a = smokeParticles[i].particle._particle;
            //    s_a.position.y += .01;
            //
            //    if (s_a.position.y > 1.6){
            //        markerRoot.remove(s_a);
            //        smokeParticles[i] = {particle:null, start:false}
            //        smokeParticles[i].particle = new Particle(markerRoot);
            //    }
            //  }
            //}
            //new TestObj(scene2);
            //console.log(scene);
            if (!factoryObj) {
              //factoryObj = new FactoryObj(markerRoot);
              //new Particle(markerRoot);
              //new FactoryObj1(markerRoot);
            }else{
              renderer.render(scene, camera); //<--- PUBLIC `scene` AND `camera`
            };
            
        };
        
        render();
        setup();
        let factoryObj;
        //var smokeParticles = {};
        //for (let i=0;i < 100;i++){
        //  smokeParticles[i] = {particle:null, start:false}
        //  smokeParticles[i].particle = new Particle(markerRoot);
        //};                
        draw();
        console.log(markerRoot);
    
      
    })();