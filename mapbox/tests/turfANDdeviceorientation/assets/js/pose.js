const loadPlaces = function(coords) {
    // COMMENT FOLLOWING LINE IF YOU WANT TO USE STATIC DATA AND ADD COORDINATES IN THE FOLLOWING 'PLACES' ARRAY
    //const method = 'api';
    const method = '';
    const PLACES = [{
            name: "Your place name",
            location: {
                lat: 0, // add here latitude if using static data
                lng: 0, // add here longitude if using static data
            }
        },

        { name: 'Stadhouderskade 84', location: { lng: 4.8937512, lat: 52.3579159 } },
        { name: 'Van Ostadestraat 318', location: { lng: 4.9005937, lat: 52.3535972 } },
        { name: 'Van Ostadestraat 9', location: { lng: 4.8852473, lat: 52.3516922 } },
        { name: 'Van Ostadestraat 391', location: { lng: 4.9042466, lat: 52.3545299 } },
        { name: 'Van Ostadestraat 55', location: { lng: 4.8894377, lat: 52.3518622 } },
        { name: 'Dusarstraat 31', location: { lng: 4.8894046, lat: 52.3517817 } },
        { name: 'Van Ostadestraat 456', location: { lng: 4.9042454, lat: 52.3545294 } },
        { name: 'Van Ostadestraat 233B', location: { lng: 4.8987005, lat: 52.3532503 } },
        { name: 'Eenden Brug', location: { lng: 4.89563833, lat: 52.35376951 } },
        { name: 'Fontain West', location: { lng: 4.89449809, lat: 52.35385470 } },
        { name: 'Groen Gemaal', location: { lng: 4.89454245, lat: 52.3541381 } },
        { name: 'Fontain Oost', location: { lng: 4.89521298, lat: 52.3540528 } },
	{ name: 'TEST 1', location: { lng: 4.901282, lat: 52.352216 } },
	{ name: 'TEST 2', location: { lng: 4.8973946, lat: 52.3525223 } },
	{ name: 'TEST 3', location: { lng: 4.890723, lat: 52.3527649 } },
    ];

    if (method === 'api') {
        return loadPlaceFromAPIs(coords);
    }

    return Promise.resolve(PLACES);
};


navigator.geolocation.getCurrentPosition(function(position) {
                // than use it to load from remote APIs (E: Foursquare) some places nearby
            // E: in this case, Foursquare will fetch for 15 places (config at endpoint) around 300meters radius (initial config)
            loadPlaces(position.coords)
                .then((places) => {
                    places.forEach((place) => {
                        const latitude = place.location.lat;
                        const longitude = place.location.lng;

                        //// add place name
                        //// E: this is the a-frame part
                        //const text = document.createElement('a-link');
                        //text.setAttribute('href', 'http://www.example.com/');
                        //text.setAttribute('title', place.name);

                        ////E: the following, gps-entity-place, is a custom component
                        //text.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
                        //text.setAttribute('scale', '20 20 20');

                        //text.addEventListener('loaded', () => {
                        //    window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'))
                        //});

                        //scene.appendChild(text);
                        var eventName = getDeviceOrientationEventName();

                        //// if Safari
                        ////E: a good one! Bravo, Nicolo!!
                        //if (!!navigator.userAgent.match(/Version\/[\d.]+.*Safari/)) {
                        //    // iOS 13+
                        //    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
                        //        var handler = function() {
                        //            console.log('Requesting device orientation permissions...')
                        //            DeviceOrientationEvent.requestPermission();
                        //            document.removeEventListener('touchend', handler);
                        //        };
                        //
                        //        document.addEventListener('touchend', function() { handler() }, false);
                        //
                        //        alert('After camera permission prompt, please tap the screen to active geolocation.');
                        //    } else {
                        //        var timeout = setTimeout(function () {
                        //            alert('Please enable device orientation in Settings > Safari > Motion & Orientation Access.')
                        //        }, 750);
                        //        window.addEventListener(eventName, function () {
                        //            clearTimeout(timeout);
                        //        });
                        //    }
                        //}
                        
                        window.addEventListener(eventName, onDeviceOrientation, false);
                       
                        
                    });
                })
        },
        (err) => console.error('Error in retrieving position', err), {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 27000,
        }
    );


function getDeviceOrientationEventName(){

        
        //E: this method is more useful that I thought... required for removal as listened event
        
        //E: it appears to cope with the two types of magnetometer info that some devices can provide (https://hackernoon.com/building-a-compass-web-app-c79fec31e080):
        //E: -- absolute (value 0 of alpha parameter (rotation around z), points north)
        //E: -- relative (0 of alpha parameter is DEVICE's DIRECTION when page page is OPENED, eg when opening this code in a desktop)
        //E: both those values are useful to control page orientation and animations, but only the first is useful for geolocation
        //E: also better NOT A CONSOLE LOG, but an alert?
        
        if ('ondeviceorientationabsolute' in window) {
            var eventName = 'deviceorientationabsolute'
        } else if ('ondeviceorientation' in window) {
            var eventName = 'deviceorientation'
        } else {
            var eventName = ''
            console.error('Compass not supported');
            alert('Compass not supported');
        }

        return eventName
    }

    /**
     * Handler for device orientation event.
     *
     * @param {Event} event
     * @returns {void}
     */
function onDeviceOrientation(event) {
        if (event.webkitCompassHeading !== undefined) {
            if (event.webkitCompassAccuracy < 50) {
                this.heading = event.webkitCompassHeading;
            } else {
                console.warn('webkitCompassAccuracy is event.webkitCompassAccuracy');
            }
        } else if (event.alpha !== null) {
            if (event.absolute === true || event.absolute === undefined) {
                //this.heading = this._computeCompassHeading(event.alpha, event.beta, event.gamma); //E: my change
                this.heading = event.alpha - 90;
            } else {
                console.warn('event.absolute === false');
            }
        } else {
            console.warn('event.alpha === null');
        }
    }

   
   /**
     * Get current user position.
     *
     * @param {function} onSuccess
     * @param {function} onError
     * @returns {Promise}
     */
function initWatchGPS(onSuccess, onError) {
        
        //E: onSuccess and onError are the functions passed when FETCHING the geolocation data at init
        
        if (!onError) {
            onError = function (err) {
                console.warn('ERROR(' + err.code + '): ' + err.message)

                if (err.code === 1) {
                    // User denied GeoLocation, let their know that
                    alert('Please activate Geolocation and refresh the page. If it is already active, please check permissions for this website.');
                    return;
                }

                if (err.code === 3) {
                    alert('Cannot retrieve GPS position. Signal is absent.');
                    return;
                }
            };
        }

        if ('geolocation' in navigator === false) {
            onError({ code: 0, message: 'Geolocation is not supported by your browser' });
            return Promise.resolve();
        }

        // https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/watchPosition
        //E: if there is no error when looking for geolocation, start watching!
        //E: onSucess is passed at init on THIS component from data gathered from `gps-entity-place` component
        //E: above:
        /*
        function (position) {
            this.currentCoords = position.coords;
            this._updatePosition();
        }
        */
        //E: _updatePosition is also a method coming from the other component
        return navigator.geolocation.watchPosition(onSuccess, onError, {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 27000,
        });
    }

    /**
     * Update user position.
     *
     * @returns {void}
     */
function updatePosition() {
        // don't update if accuracy is not good enough
        if (this.currentCoords.accuracy > this.data.positionMinAccuracy) {
            if (this.data.alert && !document.getElementById('alert-popup')) {
                var popup = document.createElement('div');
                popup.innerHTML = 'GPS signal is very poor. Try move outdoor or to an area with a better signal.'
                popup.setAttribute('id', 'alert-popup');
                document.body.appendChild(popup);
            }
            return;
        }
       //E: interesting! show this alert ONLY when the min accuracy is not met (cool..)
        var alertPopup = document.getElementById('alert-popup');
        if (this.currentCoords.accuracy <= this.data.positionMinAccuracy && alertPopup) {
            document.body.removeChild(alertPopup);
        }

        //E: current and origin coords are global variables to this component (see all the way to the top)
        if (!this.originCoords) {
            this.originCoords = this.currentCoords;
        }

        //E: AHA! get the current updated PLACE COORD data from the gps-entity-place entity's `position` attribute...
        var position = this.el.getAttribute('position');

        //E:... and do the same calculations for DISTANCE as done in that entity component; X first, then Z (again, the plane to check is XZ)
        // compute position.x
        var dstCoords = {
            longitude: this.currentCoords.longitude,
            latitude: this.originCoords.latitude, //E: will give 0; this is making the calculation without caring for entry
            
        };
        position.x = this.computeDistanceMeters(this.originCoords, dstCoords);
        position.x *= this.currentCoords.longitude > this.originCoords.longitude ? 1 : -1; //E: move right or left

        // compute position.z
        var dstCoords = {
            longitude: this.originCoords.longitude, //E: will give 0; this is making the calculation without caring for entry
            latitude: this.currentCoords.latitude,
        }
        position.z = this.computeDistanceMeters(this.originCoords, dstCoords);
        position.z *= this.currentCoords.latitude > this.originCoords.latitude ? -1 : 1; //E: move up or down

        // update position
        //E:... and then UPDATE the position of THIS entity
        this.el.setAttribute('position', position);

    }
    
    /**
     * Returns distance in meters between source and destination inputs.
     *
     *  Calculate distance, bearing and more between Latitude/Longitude points
     *  Details: https://www.movable-type.co.uk/scripts/latlong.html
     *
     * @param {Position} src
     * @param {Position} dest
     * @param {Boolean} isPlace
     *
     * @returns {number} distance
     *
     *--------------------------------------------------
     * E: the haversine distance calculation...
     * -------------------------------------------------
     */
function computeDistanceMeters(src, dest, isPlace) {
        var dlongitude = THREE.Math.degToRad(dest.longitude - src.longitude);
        var dlatitude = THREE.Math.degToRad(dest.latitude - src.latitude);

        var a = (Math.sin(dlatitude / 2) * Math.sin(dlatitude / 2)) + Math.cos(THREE.Math.degToRad(src.latitude)) * Math.cos(THREE.Math.degToRad(dest.latitude)) * (Math.sin(dlongitude / 2) * Math.sin(dlongitude / 2));
        var angle = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var distance = angle * 6378160;

        // if function has been called for a place, and if it's too near and a min distance has been set,
        // set a very high distance to hide the object
        if (isPlace && this.data.minDistance && this.data.minDistance > 0 && distance < this.data.minDistance) {
            return Number.MAX_SAFE_INTEGER;
        }

        return distance;
    }

    /**
     * Compute compass heading.
     *
     * @param {number} alpha
     * @param {number} beta
     * @param {number} gamma
     *
     * @returns {number} compass heading
     *
     * --------------------------------
     *E: standard; example: https://stackoverflow.com/questions/18112729/calculate-compass-heading-from-deviceorientation-event-api
     *E: a good explanations of the coordinates is found HERE (also WHY is RELATIVE and NOT ABSOLUTE:
     *E: --- "the TOP of the device face North", not the Z+ coordinate as measured from the center of the device): https://developers.google.com/web/fundamentals/native-hardware/device-orientation
     *E: computeHeading likely applicable only to devices with the webkidCompassHeading (https://developer.apple.com/documentation/webkitjs/deviceorientationevent/1804777-webkitcompassheading)
     *E: TODO: try the following solution? https://developer.mozilla.org/en-US/docs/Web/API/Coordinates/heading
     *E: --- found as a comment in the same stackoverflow that served as direction for this project: https://stackoverflow.com/a/19222883/3675901
     * --------------------------------
     */
function computeCompassHeading(alpha, beta, gamma) {

        // Convert degrees to radians
        var alphaRad = alpha * (Math.PI / 180); //E rotation around Z
        var betaRad = beta * (Math.PI / 180);   //E: rotation around Y
        var gammaRad = gamma * (Math.PI / 180); //E: rotation around X

        // Calculate equation components
        //E: standard rotation matrix elements:
        //E: --- https://en.wikipedia.org/wiki/Rotation_matrix
        //E: --- http://w3c.github.io/deviceorientation/spec-source-orientation.html#worked-example
        /*
          
          As stated in the W3C documention:
          "we wish to determine the compass heading of the horizontal component of a vector
          which is orthogonal to the device’s screen and pointing out of the back of the screen."
          
          such a vector is v = [0,0,-1]T
          
          Its representation in the different coordinates is as follows:
          
          Rx = [[1,0,0],
                [0,cos(beta),-sin(beta)],
                [0,sin(beta),cos(beta)]]
          
          Ry = [[cos(gamma),0,sin(gamma)],
                [0,1,0],
                [-sin(gamma),0,cos(gamma)]]

          Rz = [[cos(alpha),-sin(alpha),0],
                [sin(alpha),cos(alpha),0],
                [0,0,1]]
          
          Again, as stated in the W3C documentation:
          "If R represents the full rotation matrix of the device in the earth frame XYZ,
          then since the initial body frame is aligned with the earth, R is as follows:"
          
          R = Rz*Rx*Ry
          
          "If v' represents the vector v in the earth frame XYZ, then since the initial body frame
          is aligned with the earth, v' is as follows."
          
          v' = Rv (the transformation matrix R by the vector to be represented in the WORLD coordinates)
          
          "The compass heading theta is given by"
          
          theta = arctan(v'(sub_x)/v'(sub_y)) (beta and gamma <> 0)
          
         */
        var cA = Math.cos(alphaRad);
        var sA = Math.sin(alphaRad);
        var sB = Math.sin(betaRad);
        var cG = Math.cos(gammaRad);
        var sG = Math.sin(gammaRad);

        // Calculate A, B, C rotation components
        var rA = - cA * sG - sA * sB * cG;
        var rB = - sA * sG + cA * sB * cG;

        // Calculate compass heading
        var compassHeading = Math.atan(rA / rB);

        // Convert from half unit circle to whole unit circle
        if (rB < 0) {
            compassHeading += Math.PI;
        } else if (rA < 0) {
            compassHeading += 2 * Math.PI;
        }

        // Convert radians to degrees
        compassHeading *= 180 / Math.PI;

        return compassHeading;
    }



    /**
     * Update user rotation data.
     *
     * @returns {void}
     */
function updateRotationfunction () {
        var heading = 360 - this.heading;
        var cameraRotation = this.el.getAttribute('rotation').y;
        var yawRotation = THREE.Math.radToDeg(this.lookControls.yawObject.rotation.y);
        var offset = (heading - (cameraRotation - yawRotation)) % 360;
        this.lookControls.yawObject.rotation.y = THREE.Math.degToRad(offset);
    }