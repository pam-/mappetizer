function ready(){
	var events = [];
	$('.container input[type="text"]').keypress(function(event){
		if(event.which === 13) {
			event.preventDefault();
			var userLocation = $(this).val();
			console.log(userLocation)
			$.ajax({
				type: 'POST',
				url: '/outings',
				dataType: 'json',
				data: {
					outing: {
						// name: 
						// date:
						city: userLocation
					}
				},
				success: mapGen(userLocation)
			})
			eventUrl = 'https://www.eventbriteapi.com/v3/events/search/?venue.city='+userLocation+'&categories=103&start_date.range_start=2014-10-10T15%3A21%3A13Z&start_date.range_end=2014-10-12T15%3A03%3A22Z&token=4AP25GNUCXVYPVTGLP3V'
			$.ajax({
				type: 'GET',
				url: eventUrl,
				success: function(result){
					console.log(result)
				}
			})
		}
	})
}

// function render(result){
// 	for(i=0; i < result.length; i++){

// 	}
// }

function mapGen(userLocation){

	L.mapbox.accessToken = 'pk.eyJ1IjoicGFtLSIsImEiOiJNT09NSzgwIn0.AWl1AY_kO1HMnFHwxb9mww';

	var geocoder = L.mapbox.geocoder('mapbox.places-v1'),
  map = L.mapbox.map('map', 'pam-.jmeb29bh');
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
