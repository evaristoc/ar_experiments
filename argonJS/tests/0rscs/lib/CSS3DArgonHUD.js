/**
 * @author mrdoob / http://mrdoob.com/
 * @author blairmacintyre / http://blairmacintyre.me/
 */

THREE.CSS3DArgonHUD = function () {

	console.log( 'THREE.CSS3DArgonHUD', THREE.REVISION );

	var _viewPortWidth = 0;
	var _viewPortHeight = 0;
	
	var _viewWidth = [1, 1];
	var _viewHeight = [1, 1];
	var _viewX = [0, 0];
	var _viewY = [0, 0];
    var _visible = [false, false];

	var domElement = document.createElement( 'div' );
	domElement.style.width = '0px';
	domElement.style.height = '0px';
	this.domElement = domElement;
	this.domElement.style.pointerEvents = 'none';

	var hudElements = [];
	this.hudElements = hudElements;
	hudElements[0] = document.createElement( 'div' );
	hudElements[0].style.display = 'none'; // start hidden
	hudElements[0].style.position = 'absolute';
	hudElements[0].style.overflow = 'hidden';
	hudElements[0].style.pointerEvents = 'none';
	hudElements[0].style.bottom = '0px';
	hudElements[0].style.left = '0px';
	hudElements[0].style.width = '1px';
	hudElements[0].style.height = '1px';
	domElement.appendChild( hudElements[0] );

	hudElements[1] = document.createElement( 'div' );
	hudElements[1].style.display = 'none'; // start hidden
	hudElements[1].style.position = 'absolute';
	hudElements[1].style.overflow = 'hidden';
	hudElements[1].style.pointerEvents = 'none';
	hudElements[1].style.bottom = '0px';
	hudElements[1].style.left = '0px';
	hudElements[1].style.width = '1px';
	hudElements[1].style.height = '1px';
	domElement.appendChild( hudElements[1] );

	this.appendChild = function (element, element2) {
		if (!element2) {
			element2 = element.cloneNode( true );
		}
		this.hudElements[0].appendChild(element);
		this.hudElements[1].appendChild(element2);
	}

    this.setViewport = function ( x, y, width, height, side ) {
		if (_viewX[side] != x) {
			hudElements[side].style.left = x + 'px';
			_viewX[side] = x;
		}
		if (_viewY[side] != y) {
			hudElements[side].style.bottom = y + 'px';
			_viewY[side] = y;
		}
		if (_viewWidth[side] != width) {
			hudElements[side].style.width = width + 'px';
			_viewWidth[side] = width;
		}
		if (_viewHeight[side] != height) {
			hudElements[side].style.height = height + 'px';
			_viewHeight[side] = height;
		}
	}
		
	this.showViewport = function (side) {
		if (!_visible[side]) {
			hudElements[side].style.display = 'inline-block';
			_visible[side] = true;
		}
	}
	
	this.hideViewport = function (side) {
		if (_visible[side]) {
			hudElements[side].style.display = 'none';
			_visible[side] = false;
		}
	}

	this.setSize = function ( width, height ) {
		// size of overall DOM
		if (_viewPortWidth != width) {
			domElement.style.width = width + 'px';
			_viewPortWidth = width;
		}
		if (_viewPortHeight != height) {
			domElement.style.height = height + 'px';
			_viewPortHeight = height;
		}
		/*
		 * do not reset the subviews.  
		 */ 		
		// default viewports for left and right eyes.
		//hudElements[0].style.display = 'none';
		//hudElements[1].style.display = 'none';
	};

	this.render = function ( side ) {
		if (!_visible[side]) {
			hudElements[side].style.display = 'inline-block';
			_visible[side] = true;
		}

		// the only way I can think to actually hide the 
		// second eye when not in stereo mode
		if (side == 0 && _viewPortWidth == _viewWidth[0]) {
			this.hideViewport(1);
		}
	};
};