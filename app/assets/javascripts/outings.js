var myLayer;
var geocoder;
function ready(){

	L.mapbox.accessToken = 'pk.eyJ1IjoicGFtLSIsImEiOiJNT09NSzgwIn0.AWl1AY_kO1HMnFHwxb9mww';
	geocoder = L.mapbox.geocoder('mapbox.places-city-v1'),
  map = L.mapbox.map('map', 'pam-.jmeb29bh');

	var locationConfirm = $('.save_location');
	var date = $('input[type="date"]').val();
	locationConfirm.hide();
	$('#outing_name').hide();

	$('.container input[type="time"]').keypress(function(event){
		if(event.which === 13) {
			event.preventDefault();
			var userLocation = $('#location').val();
			var startDate = $('#start_date').val();
			var startTime = $('#start_time').val();
			var endDate = $('#end_date').val();
			var endTime = $('#end_time').val();
			var outingName = userLocation + ' Outing';
			var nameField = $('#outing_name input[type="text"]');

			// console.log(startTime)
			// console.log(defaultName)
			mapGen(userLocation)
			eventUrl = 'https://www.eventbriteapi.com/v3/events/search/?venue.city='+userLocation+'&categories=103&start_date.range_start=' + startDate + 'T' + startTime + '%3A00Z&start_date.range_end=' + endDate + 'T' + endTime + '%3A00Z&token=4AP25GNUCXVYPVTGLP3V'
			$.ajax({
				type: 'GET',
				url: eventUrl,
				success: function(result){
					console.log(result.events)
					return render(result.events)
				}
			})			

			$('#outing_name').show();
			nameField.attr('placeholder', outingName);

			nameField.keypress(function(event){
				if(event.which === 13){
					event.preventDefault();
					outingName = $(this).val();
				}
			})
			locationConfirm.show()
			locationConfirm.html('<p>Save ' + userLocation + ' outing.</p>');
			locationConfirm.on('click', function(event){
				sideBar(userLocation, startDate, startTime, endDate, endTime, outingName);				
			});
		}
	})
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

function render(result){
	for(i=0; i < result.length; i++){
		event = result[i];
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

function sideBar(userLocation, startDate, startTime, endDate, endTime, outingName){
	var userId = $('.row').data('id');
	$('.save_location').hide();
	$.ajax({
		type: 'POST',
		url: '/outings',
		dataType: 'json',
		data: {
			outing: {
				name: outingName,  
				date: startDate,
				user_id: userId,
				city: userLocation
			}
		},
		success: function(){
			$('.new_outing').hide();
			displayOutingInfo(outingName, startDate, startTime, endDate, endTime, userLocation)
		}
	})
}

function displayOutingInfo(name, start, sTime, end, eTime, location){
	var infoContainer = $('.new_outing_info');
	infoContainer.addClass('active');

	$(infoContainer, 'h2').html(name);

}

$(document).ready(ready);
