var myLayer;
var geocoder;
function ready(){

	L.mapbox.accessToken = 'pk.eyJ1IjoicGFtLSIsImEiOiJNT09NSzgwIn0.AWl1AY_kO1HMnFHwxb9mww';
	geocoder = L.mapbox.geocoder('mapbox.places-city-v1'),
  map = L.mapbox.map('map', 'pam-.jmeb29bh');

	var locationConfirm = $('.save_location');
	locationConfirm.hide();
	// $('#outing_name').hide();

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

			// Generating map
			mapGen(userLocation)

			//Generating markers
			eventUrl = 'https://www.eventbriteapi.com/v3/events/search/?venue.city='+userLocation+'&start_date.range_start=' + startDate + 'T' + startTime + '%3A00Z&start_date.range_end=' + endDate + 'T' + endTime + '%3A00Z&token=7LJ23Y6JWNBM7WUIJ424'
			$.ajax({
				type: 'GET',
				url: eventUrl,
				success: function(result){
					console.log(result.events)
					return render(result.events)
					//use event resource_uri to make other get request
				}
			})			

			// $('#outing_name').show();
			// nameField.attr('placeholder', outingName);
			// nameField.keypress(function(event){
			// 	if(event.which === 13){
			// 		event.preventDefault();
			// 		outingName = $(this).val();
			// 	}
			// })

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
		longitude = event.venue.longitude;
		latitude = event.venue.latitude;
		name = event.name.text;
		description = event.description.html;
		venue = event.venue.name;
		start = event.start.utc;
		end = event.end.utc;
		url = event.resource_uri;

		markerGen(longitude, latitude, name, description, venue, start, end, url);
	}
}

function markerGen(longitude, latitude, event_name, event_description, event_venue, event_start, event_end, event_url){
	myLayer = L.mapbox.featureLayer().addTo(map);
	var geojson = {
		type: 'FeatureCollection',
		features: [{
			type: 'Feature',
			properties: {
				title: event_name,
				// description: event_description,
				// venue: event_venue,
				// start: event_start,
				// end: event_end,
				'marker-color': '#D79488',
				'marker-size': 'large',
				url: event_url
			},
			geometry: {
				type: 'Point',
				coordinates: [longitude, latitude]
			}
		}]
	}
	console.log('here') 

	myLayer.setGeoJSON(geojson);

	myLayer.on('mouseover', function(event){
		var marker = event.layer;
	feature = marker.feature;
	popupContent = '<p>' + feature.event_name + '</p><p>Click me to confirm this event</p>';
		event.layer.openPopup(popupContent);
	});
	myLayer.on('mouseout', function(event){
		event.layer.closePopup();
	});

	myLayer.on('click', function(event){
		event.layer.unbindPopup();
		url = event.layer.feature.properties.url + '?token=4AP25GNUCXVYPVTGLP3V'
		console.log(url)
		$.ajax({
			type: 'GET',
			url: url,
			success: function(result){
				save(result);
			}
		})
	})
}

function save(result){
	var name = result.name.text;
	var category = result.category.name;
	var id = result.id;
	var url = result.url;

	if (!category) {
		category = "no category";
	}
	if (!url) {
		url = "no url"
	};
	$.ajax({
		type: 'POST',
		url: '/activities',
		data: {
			activity: {
				name: name,
				category: category,
				event_id: id,
				event_url: url
			}
		},
		success: function(){
			console.log('success of save')
			$('.new_outing').hide();
			displayActivityInfo(name, category, url)
		}
	})
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
			console.log('success of sidebar')
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

// This is the function that displays the activies under the outing name
function displayActivityInfo(name, category, url){
	console.log('reached inside of display activity info');
	var actInfoContainer = $('.new_activity_info');
	actInfoContainer.addClass('active');

	$(actInfoContainer, 'h2').html(name + category + url);
}

$(document).ready(ready);
