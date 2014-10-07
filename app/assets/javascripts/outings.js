var myLayer;
var geocoder;
function ready(){

	L.mapbox.accessToken = 'pk.eyJ1IjoicGFtLSIsImEiOiJNT09NSzgwIn0.AWl1AY_kO1HMnFHwxb9mww';

	geocoder = L.mapbox.geocoder('mapbox.places-city-v1'),
  map = L.mapbox.map('map', 'pam-.jmeb29bh');
	var userId = $('.row').data('id')
	$('.save_location').hide()
	$('#outing_name').hide()
	$('.container input[type="text"]').keypress(function(event){
		if(event.which === 13) {
			event.preventDefault();
			var userLocation = $(this).val();
			console.log(userLocation)
			mapGen(userLocation)
			$('.save_location').show()
			$('.save_location').html("<p>Save outing in " + userLocation + ".</p>");
			$('.save_location').on("click", function(event){
				$.ajax({
					type: 'POST',
					url: '/outings',
					dataType: 'json',
					data: {
						outing: {
							name: userLocation + 'Outing',  
							// date:
							user_id: userId,
							city: userLocation
						}
					},
					success: function(){
						sideBar();
					}
				})				
				});

			eventUrl = 'https://www.eventbriteapi.com/v3/events/search/?venue.city='+userLocation+'&categories=103&start_date.range_start=2014-10-10T15%3A21%3A13Z&start_date.range_end=2014-10-12T15%3A03%3A22Z&token=4AP25GNUCXVYPVTGLP3V'
			$.ajax({
				type: 'GET',
				url: eventUrl,
				success: function(result){
					console.log(result.events)
					return render(result.events)
				}
			})
		}
	})
}

function sideBar(){
	$('.save_location').hide()
	$('#outing_name').show().attr('placeholder', userLocation)	

}

function render(result){
	for(i=0; i < result.length; i++){
		event = result[i];
		// console.log(event.venue)
		markerGen(event.venue.longitude, event.venue.latitude, event.venue.name)
	}
}

function markerGen(longitude, latitude, venue_name){
	myLayer = L.mapbox.featureLayer().addTo(map);
	var geojson = {
		type: 'FeatureCollection',
		features: [{
			type: 'Feature',
			properties: {
				title: venue_name,
				'marker-color': '#D79488',
				'marker-size': 'large',
				// url
			},
			geometry: {
				type: 'Point',
				coordinates: [longitude, latitude]
			}
		}]
	}
	console.log('here')
	myLayer.setGeoJSON(geojson);
	myLayer.on('mouseover', function(e){
		e.layer.openPopup();
	});
	myLayer.on('mouseout', function(e){
		e.layer.closePopup();
	});
}

function mapGen(userLocation){
	geocoder.query(userLocation, showMap);

	function showMap(err, data) {
	  if (data.lbounds) {
	      map.fitBounds(data.lbounds);
	  } else if (data.latlng) {
	      map.setView([data.latlng[0], data.latlng[1]], 13);
	  }
	}
}


$(document).ready(ready);
