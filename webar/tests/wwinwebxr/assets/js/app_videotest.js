import * as THREE from '../../../../libs/three/three.module.js';
import { OrbitControls } from '../../../../libs/three/jsm/OrbitControls.js';
import { Stats } from '../../../../libs/stats.module.js';
import { _instanceARButton } from './ARButton.js';
import { CanvasUI } from '../../../../libs/CanvasUI.js'; //E: coming from UI section



const ARButton = _instanceARButton;

class App{
	constructor(){
		const container = document.createElement( 'div' );
		document.body.appendChild( container );
		
		this.rotation = 0.0;
        
        this.clock = new THREE.Clock();
        
		this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 20 );
		
		this.scene = new THREE.Scene();
       
		this.scene.add( new THREE.HemisphereLight( 0x606060, 0x404040 ) );

		const zelf = this;
		this.workertest = new Worker('./assets/js/ww_fast.js', {type:'module'});
        this.workertest.addEventListener("message", ( e ) => {
			console.log('in worker color:', e.data);
			zelf.rotation = Math.random();
        });
		//window.workertest.onmessage = (e) => console.log(e.data);
		
        const light = new THREE.DirectionalLight( 0xffffff );
        light.position.set( 1, 1, 1 ).normalize();
		this.scene.add( light );
			
		this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true } );
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        
		container.appendChild( this.renderer.domElement );
        
        this.controls = new OrbitControls( this.camera, this.renderer.domElement );
        this.controls.target.set(0, 3.5, 0);
        this.controls.update();
        
        this.stats = new Stats();
        
        this.initScene();
        this.setupVR();
        
        window.addEventListener('resize', this.resize.bind(this) );
	}	
    
    createUI() { //E: coming from UI section
        
        const config = {
            panelSize: { width: 0.6, height: 0.3 },
            width: 512,
            height: 256,
            opacity: 0.7,
            body:{
                fontFamily:'Arial', 
                fontSize:20, 
                padding:20, 
                backgroundColor: '#000', 
                fontColor:'#fff', 
                borderRadius: 6,
                opacity: 0.7
            },
            info:{
                type: "text",
                position:{ x:0, y:0 },
                height: 128
            },
            msg:{
                type: "text",
                position:{ x:0, y:128 },
                fontSize: 30,
                height: 128
            }
        }
        const content = {
            info: "info",
            msg: "controller"
        }
        
        const ui = new CanvasUI( content, config );
        ui.mesh.material.opacity = 0.7;
        
        this.ui = ui;
    }
	
	initScene(){
        this.geometry = new THREE.BoxBufferGeometry( 0.06, 0.06, 0.06 ); 
        this.meshes = [];
    }
    
    setupVR(){
        this.renderer.xr.enabled = true; 
        
        const self = this;
        let controller;
        
        function onSessionStart(){ //E: coming from UI section
            
        }
        
        function onSessionEnd(){ //E: coming from UI section
            
        }       
        
        
        function onSelect() {
            const material = new THREE.MeshPhongMaterial( { color: 0xffffff * Math.random() } );
            const mesh = new THREE.Mesh( self.geometry, material );
            mesh.position.set( 0, 0, - 0.3 ).applyMatrix4( controller.matrixWorld );
            mesh.quaternion.setFromRotationMatrix( controller.matrixWorld );
            self.scene.add( mesh );
            self.meshes.push( mesh );

        }
        

        //const btn = new ARButton( this.renderer );
        const btn = new ARButton(this.renderer, {onSessionStart, onSessionEnd, sessionInit: {optionalFeatures:['dom-overlay'], domOverlay:{root:document.body}}})
        
        
        controller = this.renderer.xr.getController( 0 );
        controller.addEventListener( 'select', onSelect );
        this.scene.add( controller );
        
        this.renderer.setAnimationLoop( this.render.bind(this) );
    }
    
    resize(){
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight );  
    }
    
	render( ) {
		const zelf = this;
        this.stats.update();
		//console.log('mesh color render: ', mesh.material.color.getHex());
		//zelf.workertest.postMessage({data:mesh.material.color.getHex()});
        this.meshes.forEach( (mesh, i) => {
			//mesh.rotateY( 0.01 );
			setTimeout(() => {mesh.rotateY( zelf.rotation );}, 713*i);
			//workertest.postMessage('PING');
			//zelf.workertest.postMessage(mesh); //can't be cloned, because it has methods: https://stackoverflow.com/questions/7704323/passing-objects-to-a-web-worker
			zelf.workertest.postMessage(mesh.material.color.getHex());
		});
        this.renderer.render( this.scene, this.camera );
    }
}

export { App };