var myLayer;
var geocoder;
var newOutingId;
function ready(){

	L.mapbox.accessToken = 'pk.eyJ1IjoicGFtLSIsImEiOiJNT09NSzgwIn0.AWl1AY_kO1HMnFHwxb9mww';
	geocoder = L.mapbox.geocoder('mapbox.places-city-v1'),
  map = L.mapbox.map('map', 'pam-.jmeb29bh');

	var locationConfirm = $('.save_location');
	locationConfirm.hide();
	$('.new_outing_info').hide();
	$('.send-email').hide();

	$('.search').on('click', function(event){
		event.preventDefault();
		var userLocation = $('#location').val();
		var startDate = $('#start_date').val();
		var startTime = $('#start_time').val();
		var endDate = $('#end_date').val();
		var endTime = $('#end_time').val();
		var outingName = userLocation + ' Outing';
		var nameField = $('#outing_name input[type="text"]');

		if (nameField.val() != "") {
			outingName = nameField.val();
		} else {
			outingName = userLocation + 'Outing'
		}

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
			}
		})			

		locationConfirm.show()
		locationConfirm.html('<p>Save ' + userLocation + ' outing.</p>');
		locationConfirm.on('click', function(event){
			sideBar(userLocation, startDate, startTime, endDate, endTime, outingName);				
		});
	})


	// outing show page
	var outingId = $('.info').data('id')
	var outingCity = $('.info').data('city')

	if (outingId !== undefined) {
		$.ajax({
			type: 'GET',
			url: '/outings/' + outingId + '/activities',
			dataType: 'json',
			success: function(result){
				mapGen(outingCity)
				finalRender(result)
			}
		})
	};

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
				console.log(result.category.name)
				save(result);
			}
		})
	})
}

function save(result){
	console.log(result.category.name)
	var category;
	var name = result.name.text;
	var id = result.id;
	var url = result.url;
	var longitude = result.venue.longitude;
	var latitude = result.venue.latitude;
	console.log(longitude)
	if (!result.category) {
		category = "no category";
	} else {
		category = result.category;
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
				category: category.name,
				event_id: id,
				event_url: url,
				longitude: longitude,
				latitude: latitude
			}
		},
		success: function(){
			$('.new_outing').hide();
			displayActivityInfo(name)
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
		success: function(result){
			console.log('success of sidebar')
			newOutingId = result.id;
			$('.new_outing').hide();
			displayOutingInfo(outingName, startDate, startTime, endDate, endTime, userLocation)
		}
	})
}

function displayOutingInfo(name, start, sTime, end, eTime, location){
	var infoContainer = $('.new_outing_info');
	infoContainer.show();

	$(infoContainer).html('<h2>' + name + '</h2>');
	$(infoContainer).append( '<p>' + start + '-' + sTime + ' until ' + end + '-' + eTime + '</p>');


}

// This is the function that displays the activies under the outing name
function displayActivityInfo(name){
	console.log('reached inside of display activity info');
	$('.send-email').show();
	var actInfoContainer = $('.new_activity_info');
	actInfoContainer.addClass('active');

	$(actInfoContainer).append('<p>' + name + '</p>');
}

function finalRender(result, city) {
	for(var i = 0; i < result.length; i++){
		var activity = result[i];
		var longitude = activity.longitude;
		var latitude = activity.latitude;
		var name = activity.name;
		finalMarkers(longitude, latitude);
	}
}

function finalMarkers(longitude, latitude, name){
	myLayer = L.mapbox.featureLayer().addTo(map);
	var geojson = {
		type: 'FeatureCollection',
		features: [{
			type: 'Feature',
			properties: {
				title: name,
				'marker-color': '#D79488',
				'marker-size': 'large',
			},
			geometry: {
				type: 'Point',
				coordinates: [longitude, latitude]
			}
		}]
	}
	myLayer.setGeoJSON(geojson);
}

$('.send-email').on('click', function(){
	window.location.href = "/outings/" + newOutingId; 
})

$(document).ready(ready);
