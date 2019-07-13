/**
 * @author richt / http://richt.me
 * @author WestLangley / http://github.com/WestLangley
 *
 * W3C Device Orientation control (http://w3c.github.io/deviceorientation/spec-source-orientation.html)
 */

THREE.DeviceOrientationControls = function( object ) {

	var scope = this;

	this.object = object;
    //E: based on https://w3c.github.io/deviceorientation/, the matrix "YXZ" represents the rotational frame of those axes, IN THAT ORDER (relevant)
    // the rotational data is device compass heading - preliminary information
	this.object.rotation.reorder( "YXZ" );

	this.enabled = true;

	this.deviceOrientation = {};
	this.screenOrientation = 0;

    //E: alpha == angles of Z-rotation (horizontal device, the axis perpendicular to the screen)
	this.alpha = 0;
	this.alphaOffsetAngle = 0;

    //E: https://en.wikipedia.org/wiki/Quaternion
	var onDeviceOrientationChangeEvent = function( event ) {

		scope.deviceOrientation = event;

	};

	var onScreenOrientationChangeEvent = function() {

		scope.screenOrientation = window.orientation || 0;

	};

	// The angles alpha, beta and gamma form a set of intrinsic Tait-Bryan angles of type Z-X'-Y''
    // E: https://en.wikipedia.org/wiki/Euler_angles
    // " three angles introduced by Leonhard Euler to describe the orientation of a rigid body with respect to a fixed coordinate system"
    // also "https://en.wikipedia.org/wiki/Davenport_chained_rotations" - rotation as a matrix decomposition problem into 3 steps
	// in our case, the decomposition is one of "<pitch, yaw, roll>" (YZX): rotate first Y, then Z, then X to obtain the final position
    // The transformation is Eulerian, but they are Tait-Bryan because the first and third axes are perpendicular (actually all are)
    // The treatment of the rotations is with QUATERNIONS (https://en.wikipedia.org/wiki/Quaternion)
    // the reason is that it is more simple to operate with quaternions for rotation calcuation that with rotation matrices
    // additionally, working with Euler angles may lead to a sort of "local minimum" solution named "gymbal lock"
    // the Euler transformation used here is likely based on the following: https://en.wikipedia.org/wiki/Conversion_between_quaternions_and_Euler_angles
    var setObjectQuaternion = function() {

		var zee = new THREE.Vector3( 0, 0, 1 );

		var euler = new THREE.Euler();

		var q0 = new THREE.Quaternion();

		var q1 = new THREE.Quaternion( - Math.sqrt( 0.5 ), 0, 0, Math.sqrt( 0.5 ) ); // - PI/2 around the x-axis

		return function( quaternion, alpha, beta, gamma, orient ) { // a closure...

			euler.set( beta, alpha, - gamma, 'YXZ' ); // 'ZXY' for the device, but 'YXZ' for us //<---- E: RELEVANT!!

			quaternion.setFromEuler( euler ); // orient the device

			quaternion.multiply( q1 ); // camera looks out the back of the device, not the top

			quaternion.multiply( q0.setFromAxisAngle( zee, - orient ) ); // adjust for screen orientation

		}

	}();

	this.connect = function() {

		onScreenOrientationChangeEvent(); // run once on load

		window.addEventListener( 'orientationchange', onScreenOrientationChangeEvent, false );
		window.addEventListener( 'deviceorientation', onDeviceOrientationChangeEvent, false );

		scope.enabled = true;

	};

	this.disconnect = function() {

		window.removeEventListener( 'orientationchange', onScreenOrientationChangeEvent, false );
		window.removeEventListener( 'deviceorientation', onDeviceOrientationChangeEvent, false );

		scope.enabled = false;

	};

	this.update = function() {

		if ( scope.enabled === false ) return;
        
        //E: why an offset angle for Z? probably to do with this: https://www.reddit.com/r/threejs/comments/6x5ub8/augmented_reality_controls/?
		var alpha = scope.deviceOrientation.alpha ? THREE.Math.degToRad( scope.deviceOrientation.alpha ) + this.alphaOffsetAngle : 0; // Z
		var beta = scope.deviceOrientation.beta ? THREE.Math.degToRad( scope.deviceOrientation.beta ) : 0; // X'
		var gamma = scope.deviceOrientation.gamma ? THREE.Math.degToRad( scope.deviceOrientation.gamma ) : 0; // Y''
		var orient = scope.screenOrientation ? THREE.Math.degToRad( scope.screenOrientation ) : 0; // O

		setObjectQuaternion( scope.object.quaternion, alpha, beta, gamma, orient );
		this.alpha = alpha;

	};

	this.updateAlphaOffsetAngle = function( angle ) {

		this.alphaOffsetAngle = angle;
		this.update();

	};

	this.dispose = function() {

		this.disconnect();

	};

	this.connect();

};