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
animate();

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
//		if ( arToolkitContext.arController !== null )
//		{
//            arToolkitSource.copySizeTo(arToolkitContext.arController.canvas)	
//		}	
	}

	arToolkitSource.init(function onReady(){
		//onResize()
	});
	
	// handle resize event
	window.addEventListener('resize', function(){
		onResize()
	});

	initButterflies();

}


function update1() //just a bit of house-keeping: moving some functionality not strictly related to animation here 
{

    stats.update();
    cameraCtrl.update();
    TWEEN.update();


    if (butterflies.length === 0) {
        //scene.remove(butterflies[0].o3d);
        alert(333);
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



function render()
{
	renderer.render( scene, camera );
}


function animate()
{
    update1();
}

