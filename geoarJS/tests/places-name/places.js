const loadPlaces = function (coords) {
    // COMMENT FOLLOWING LINE IF YOU WANT TO USE STATIC DATA AND ADD COORDINATES IN THE FOLLOWING 'PLACES' ARRAY
    //const method = 'api';

    const PLACES = [
        {
            name: "Your place name",
            location: {
                lat: 0, // add here latitude if using static data
                lng: 0, // add here longitude if using static data
            }
        },
    
    {name:'Stadhouderskade 84',location:{lng:4.8937512,lat:52.3579159}},
{name:'Van Ostadestraat 318',location:{lng:4.9005937,lat:52.3535972}},
{name:'Van Ostadestraat 9',location:{lng:4.8852473,lat:52.3516922}},
{name:'Van Ostadestraat 391',location:{lng:4.9042466,lat:52.3545299}},
{name:'Van Ostadestraat 55',location:{lng:4.8894377,lat:52.3518622}},
{name:'Dusarstraat 31',location:{lng:4.8894046,lat:52.3517817}},
{name:'Van Ostadestraat 456',location:{lng:4.9042454,lat:52.3545294}},
{name:'Van Ostadestraat 233B',location:{lng:4.8987005,lat:52.3532503}},
   
    ];

    if (method === 'api') {
        return loadPlaceFromAPIs(coords);
    }

    return Promise.resolve(PLACES);
};

// getting places from REST APIs
function loadPlaceFromAPIs(position) {
    const params = {
        radius: 300,    // search places not farther than this value (in meters)
        clientId: 'HZIJGI4COHQ4AI45QXKCDFJWFJ1SFHYDFCCWKPIJDWHLVQVZ',
        clientSecret: 'QWT2HBMQ1LUC4BYQHZWO2UQNEEANJENUIMYBG4JH32AC1OGA',
        version: '20300101',    // foursquare versioning, required but unuseful for this demo
    };

    // CORS Proxy to avoid CORS problems
    const corsProxy = 'https://cors-anywhere.herokuapp.com/';

    // Foursquare API
    // E: using proxy for cors handling; ES6 text formatting
    const endpoint = `${corsProxy}https://api.foursquare.com/v2/venues/search?intent=checkin
        &ll=${position.latitude},${position.longitude}
        &radius=${params.radius}
        &client_id=${params.clientId}
        &client_secret=${params.clientSecret}
        &limit=15
        &v=${params.version}`;
    
    return fetch(endpoint)
        .then((res) => {
            return res.json()
                .then((resp) => {
                    return resp.response.venues;
                })
        })
        .catch((err) => {
            console.error('Error with Foursquare Places API', err);
        })
};


window.onload = () => {
    const scene = document.querySelector('a-scene');

    // first get current user location
    return navigator.geolocation.getCurrentPosition(function (position) {

        // than use it to load from remote APIs (E: Foursquare) some places nearby
        // E: in this case, Foursquare will fetch for 15 places (config at endpoint) around 300meters radius (initial config)
        loadPlaces(position.coords)
            .then((places) => {
                places.forEach((place) => {
                    const latitude = place.location.lat;
                    const longitude = place.location.lng;

                    // add place name
                    // E: this is the a-frame part
                    const text = document.createElement('a-link');
                    text.setAttribute('href', 'http://www.example.com/');
                    text.setAttribute('title', place.name);
                    
                    //E: the following, gps-entity-place, is a custom component
                    text.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
                    text.setAttribute('scale', '20 20 20');

                    text.addEventListener('loaded', () => {
                        window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'))
                    });

                    scene.appendChild(text);
                });
            })
    },
        (err) => console.error('Error in retrieving position', err),
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 27000,
        }
    );
};
