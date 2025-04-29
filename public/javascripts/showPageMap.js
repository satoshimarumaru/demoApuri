

mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: Campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 9, // starting zoom
});




new mapboxgl.Marker()
    .setLngLat(Campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 }) 
            .setHTML(
                `<h5>${Campground.title}</h5><p>${Campground.location}</p>`
            )
    )

    .addTo(map)