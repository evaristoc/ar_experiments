import * as THREEx from "../../../../libs/arjs-resources/threex/threex-artoolkitsource.js";
console.log(typeof THREEx);
import { TestTask } from "./testtask.js";

//// create atToolkitContext
//this.arToolkitContext = new THREEx.ArToolkitContext({
//    cameraParametersUrl: '../../arjs-resources/data/camera_para.dat',
//    detectionMode: 'mono'
//});

self.addEventListener("message", ( e ) => {
  //const newcolor = TestTask.changecolor(data.currentcolor);
  const d = e.data
  //console.log(typeof THREE.Color());
  //console.log(d);
  self.postMessage("not ready");
  //THREEx.ArToolkitSource.init(onReady(){self.postMessage("Ready")}));
});

//onmessage = e => postMessage('PONG');