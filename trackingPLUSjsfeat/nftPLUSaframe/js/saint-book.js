const WIDTH = 480;
const HEIGHT = 360;

const width = Math.round(60 * WIDTH / HEIGHT);
const height = 60;

// Adjust camera frustum near and far clipping plane to match these distances.
// E: this is the calibration issue - he is APPROXIMATING it
// --- the distances he mentions, they are the near and far attributes of the fustrum as in the aframe a-camera element
const MIN_DETECTED_HEIGHT = 0.3; // At about 2.5m
const MAX_DETECTED_HEIGHT = 0.8; // At about 0.5m

const MAX_HALOS = 3;

AFRAME.registerComponent('all-saints-ar', { //E: all-saints-ar will be called as component into the tag element a-scene
  init: function() {
    const sceneEl = this.el; //E: this is aframe

    const video = document.createElement('video');
    sceneEl.insertAdjacentElement('beforebegin', video); //E: insert in the sceneEl (=== AFRAME.el) a video ELEMENT (not a video itself) before starting

    //E: this is the tracking library: initialized HERE
    //--- it is meant to work around a box (!), which it is approximated based on WIDTH and HEIGHT
    const detector = new objectdetect.detector(width, height, 1.1, objectdetect.frontalface_alt);

    const halos = [];

    //the following is pure aframe
    for (let i = 1; i <= MAX_HALOS; i++) {
      const halo = document.createElement('a-torus');
      halo.setAttribute('radius', '0.3');
      halo.setAttribute('radius-tubular', '0.03');
      halo.setAttribute('rotation', '90 0 0');
      halo.setAttribute('color', 'yellow');
      halo.setAttribute('visible', false);
      sceneEl.appendChild(halo);

      halos.push(halo);
    }

    //E: making some of the constructor accessible to other functions? remember: `this` is AFRAME, so I am adding to the component video, detector and halos
    this.video = video;
    this.detector = detector;
    this.halos = halos;

    
    //E: getting the webcam
    if (navigator.mediaDevices) {
      navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video: { width: WIDTH, height: HEIGHT },
        })
        .then((stream) => {
          const video = document.querySelector('video'); //E: get the video element and create a variable called... video
          video.srcObject = stream;
          video.onloadedmetadata = function() {
            //console.log(this);
            this.play(); //E: originally as video.play(), but apparently video is ALSO a public variable, so I am referring to THIS video
          };
        })
        .catch((err) => {
          console.log("The following error occurred: " + err.name);
        });
    }
  },

  tick: function() {
    const camera = this.el.camera; // E: this is the camera module of AFRAME.el
    
    //E: this.detector and this.video were already initialized and bound to AFRAME in the init function
    //-- here is when actually the dectector is called to run on the video
    //-- this are the coordinates extrated from detector when detected
    //-- coordinates are a box
    const coords = this.detector.detect(this.video, 1);

    // Hide all halos. This should be merged with the coords iteration code.
    // E: notice that halos are those already set at `init` function
    this.halos.forEach((halo) => {
      halo.setAttribute('visible', false);
    });

    coords.forEach((coord, i) => { //E: I think it was expecting to add halos for the number of dectections, max 3?, otherwise, no show
                  if (i >= MAX_HALOS) {
                    return;
                  }
                  // Sometime the detection stops working. <------ E: Relevant
                  if (isNaN(coord[0])) {
                    return;
                  }
                  //E: to find a position for the halo in 2D aframe needs 3 coordinates: x, y and z 
                  //-- the x,y pair is found based on the coordinates of the box: coord[0] and coord[2] are x1,x2 points; coord[1] and coord[3] are the y1,y2
                  //-- both are normalized because aframe is set to work in the range of -1 and 1 for the coordinates
                  const x = 2 * (coord[0] / width + coord[2] / width / 2) - 1;
                  const y = 1 - 2 * ((coord[1] / height) - (coord[3] / height) / 2);
                  // From -1 to 1 ; -1 = close ; 1 = far. <----- E: the coordinates in aframe are set to -1,1 in range!?
                  // Clamp from -1 to 1 to avoid faces getting clipped out.
                  //// E: weird!!! Math.max(-1, 1-x, 1)??? it is ALWAYS 1 !!! :) :)
                  //const z = Math.max(
                  //  -1, //min near
                  //  Math.min(
                  //    1 - 2 * ((coord[3] / height) - MIN_DETECTED_HEIGHT) / (MAX_DETECTED_HEIGHT - MIN_DETECTED_HEIGHT), //try to approximate DISTANCE by average (recall z is the equivalent to focal length, hard to find!!!)
                  //    1 // max far
                  //    ) 
                  //);
            
                  //E: this is a hack for the z value! totally approximated
                  //-- seems to be based on the lower y value, normalized
                  const z = 1 - 2 * ((coord[3] / height) - MIN_DETECTED_HEIGHT) / (MAX_DETECTED_HEIGHT - MIN_DETECTED_HEIGHT);
                  const pos = new THREE.Vector3(x, y, z).unproject(camera);
                  this.halos[i].setAttribute('position', pos);
                  this.halos[i].setAttribute('visible', true);
                }
    );
  },
});
