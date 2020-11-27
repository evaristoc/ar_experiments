/**
 * @author mrdoob / http://mrdoob.com
 * @author Mugen87 / https://github.com/Mugen87
 * @author NikLever / http://niklever.com
 */

class _instanceARButton{

	constructor( renderer, options ) {
        _instanceARButton.renderer = renderer;
        
        if (options !== undefined){
            _instanceARButton.onSessionStart = options.onSessionStart;
            _instanceARButton.onSessionEnd = options.onSessionEnd;
            _instanceARButton.sessionInit = options.sessionInit;
        }
        
        const zelfinstanceARbutton = this;
        
        if ( 'xr' in navigator ) {

			const button = document.createElement( 'button' );
			button.style.display = 'none';
            button.style.height = '40px';

			navigator.xr.isSessionSupported( 'immersive-ar' ).then( ( supported ) => {

				supported ? zelfinstanceARbutton.showStartAR( button ) : zelfinstanceARbutton.showARNotSupported( button );

			} );
            
            document.body.appendChild( button );

		} else {

			const message = document.createElement( 'a' );

			if ( window.isSecureContext === false ) {

				message.href = document.location.href.replace( /^http:/, 'https:' );
				message.innerHTML = 'WEBXR NEEDS HTTPS'; 

			} else {

				message.href = 'https://immersiveweb.dev/';
				message.innerHTML = 'WEBXR NOT AVAILABLE';

			}

			message.style.left = '0px';
			message.style.width = '100%';
			message.style.textDecoration = 'none';

			_instanceARButton.stylizeElement( message, false );
            message.style.bottom = '0px';
            message.style.opacity = '1';
            
            document.body.appendChild ( message );

		}

    }

	showStartAR( button ) {

        let currentSession = null;
        //const _instanceARButton = this;
        
        this.stylizeElement( button, true, 30, true );
        
        function onSessionStarted( session ) {

            session.addEventListener( 'end', onSessionEnded );

            _instanceARButton.renderer.xr.setReferenceSpaceType( 'local' );
            _instanceARButton.renderer.xr.setSession( session );
            this.stylizeElement( button, false, 12, true );
            
            button.textContent = 'STOP AR';

            currentSession = session;
            
            if (_instanceARButton.onSessionStart !== undefined && _instanceARButton.onSessionStart !== null) _instanceARButton.onSessionStart();

        }

        function onSessionEnded( ) {

            currentSession.removeEventListener( 'end', onSessionEnded );

            _instanceARButton.stylizeElement( button, true, 12, true );
            button.textContent = 'START AR';

            currentSession = null;
            
            if (_instanceARButton.onSessionEnd !== undefined && _instanceARButton.onSessionEnd !== null) _instanceARButton.onSessionEnd();

        }

        //

        button.style.display = '';
        button.style.right = '20px';
        button.style.width = '80px';
        button.style.cursor = 'pointer';
        button.innerHTML = '<i class="fas fa-camera"></i>';
        

        button.onmouseenter = function () {
            
            button.style.fontSize = '12px'; 
            button.textContent = (currentSession===null) ? 'START AR' : 'STOP AR';
            button.style.opacity = '1.0';

        };

        button.onmouseleave = function () {
            
            button.style.fontSize = '30px'; 
            button.innerHTML = '<i class="fas fa-camera"></i>';
            button.style.opacity = '0.5';

        };

        button.onclick = function () {

            if ( currentSession === null ) {

                // WebXR's requestReferenceSpace only works if the corresponding feature
                // was requested at session creation time. For simplicity, just ask for
                // the interesting ones as optional features, but be aware that the
                // requestReferenceSpace call will fail if it turns out to be unavailable.
                // ('local' is always available for immersive sessions and doesn't need to
                // be requested separately.)
                
                navigator.xr.requestSession( 'immersive-ar', _instanceARButton.sessionInit ).then( onSessionStarted );

            } else {

                currentSession.end();

            }

        };

    }

    disableButton(button) {

        button.style.cursor = 'auto';
        button.style.opacity = '0.5';
        
        button.onmouseenter = null;
        button.onmouseleave = null;

        button.onclick = null;

    }

    showARNotSupported( button ) {
        this.stylizeElement( button, false );
        
        this.disableButton(button);

        button.style.display = '';
        button.style.width = '100%';
        button.style.right = '0px';
        button.style.bottom = '0px';
        button.style.border = '';
        button.style.opacity = '1';
        button.style.fontSize = '13px';
        button.textContent = 'AR NOT SUPPORTED';

    }

    stylizeElement( element, active = true, fontSize = 13, ignorePadding = false ) {

        element.style.position = 'absolute';
        element.style.bottom = '20px';
        if (!ignorePadding) element.style.padding = '12px 6px';
        element.style.border = '1px solid #fff';
        element.style.borderRadius = '4px';
        element.style.background = (active) ? 'rgba(20,150,80,1)' : 'rgba(180,20,20,1)';
        element.style.color = '#fff';
        element.style.font = `normal ${fontSize}px sans-serif`;
        element.style.textAlign = 'center';
        element.style.opacity = '0.5';
        element.style.outline = 'none';
        element.style.zIndex = '999';

    }

		

};

export { _instanceARButton };
