function calculateRoute() {

	const app = document.getElementById('map1');
	var x=document.getElementById("form1") ;
	var fahrtID =x.elements["FahrtID"].value;
	var url = 'http://cumo4.mobilesticket.de/lecibo/tour/reconstructionbest?fahrtID=' + fahrtID + '&includeShape=false'

	console.log("url: ", url);

	var request = new XMLHttpRequest();

	var map = L.map('map1').setView([51.51796, 7.458452 ], 15);

	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
		    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		    maxZoom: 40,
		    id: 'mapbox.streets',
		    accessToken: 'pk.eyJ1IjoiYWFtYWxpazE0IiwiYSI6ImNqaHp2cTNxYzB5ZXIzcXBnOXRpbmM3bnMifQ.XHF7nVhTYLVAcuv2iq8l_Q'
		}).addTo(map);

	request.open('GET', url, false);

	var maxLat = 0;
	var maxLon = 0;
	var minLat = 55; 
	var minLon = 12;

	request.onload = function () {
		  // Begin accessing JSON data here
		var output = JSON.parse(this.response);

		console.log("request1 status: " + request.status);

		if (request.status >= 200 && request.status < 400) {
			// console.log("apiProvider: ", output.apiProvider)
			// console.log("arrivalTime: ", output.legDTO[0].arrivalTime)
			// console.log("lat: ", output.legDTO[0].stopSequence[0].lat)

			var stopOutput = new Array();

			output.legDTO.forEach(leg => {
				leg.stopSequence.forEach(stop => {

				if(stop.lat > maxLat){
					maxLat = stop.lat;
				}
				if(stop.lon > maxLon){
					maxLon = stop.lon;
				}
				if(stop.lat < minLat){
					minLat = stop.lat;
				}
				if(stop.lon < minLon){
					minLon = stop.lon;
				}

				var stopArray = new Array(stop.name, stop.lat, stop.lon);
				stopOutput.push(stopArray);

				}); 
			});

			console.log("stopOutput: ", stopOutput);

			//Change the size and color of circular markers here
			for (var i = 0; i < stopOutput.length; i++) {
				circle = new L.circle([stopOutput[i][1],stopOutput[i][2]], 50, {
				  fillOpacity: 0.5,
				  color: '#f06315',
				  fillColor: "#f06315",
				}).bindPopup(stopOutput[i][0])
				.addTo(map);
			}

		} else {
			const errorMessage = document.createElement('marquee');
			errorMessage.textContent = `Bad Request Executed. Recheck if you inputted the correct fahrtID`;
			app.appendChild(errorMessage);
		}		
	}
	request.send();

//------------------------------------ Region: All stations in a Square ----------------------------------------------------
	var urlRegion = 'http://cumo4.mobilesticket.de/lecibo/geo/stations/box?';
	var param = 'latMin=' + minLat + '&lonMin=' + minLon + '&latMax=' + maxLat + '&lonMax=' + maxLon;
	var finalUrl = urlRegion + param;

	console.log("finalUrl: ", finalUrl);
	var requestRegion = new XMLHttpRequest();
	requestRegion.open('GET', finalUrl, true);

	requestRegion.onload = function () {
		var outputRegion = JSON.parse(this.response);
		console.log("request2 status: " + requestRegion.status);

		if (requestRegion.status >= 200 && requestRegion.status < 400) {
			var stopOutputRegion = new Array();
			
			outputRegion.forEach(out => {
				var stopArrayRegion = new Array(out.name, out.lat, out.lon);
				stopOutputRegion.push(stopArrayRegion);
			});

			for (var i = 0; i < stopOutputRegion.length; i++) {
				circle = new L.circle([stopOutputRegion[i][1],stopOutputRegion[i][2]], 50, {
				  fillColor: "##0000FF",
				  color: "#0000FF"
				}).bindPopup(stopOutputRegion[i][0])
				.addTo(map);
			}
		} 
		else {
			const errorMessage = document.createElement('marqueeRegion');
			errorMessage.textContent = `Bad Request Executed. Recheck if you inputted the correct fahrtID`;
			app.appendChild(errorMessage);
		}	
	}		
	requestRegion.send();

//------------------------------------ Region: All stations in a Square ----------------------------------------------------
	var urlGpsTrack = 'http://cumo4.mobilesticket.de/lecibo/tour/gpstrack?fahrtID=' + fahrtID;

	console.log("urlGpsTrack: ", urlGpsTrack);
	var requestGpsTrack = new XMLHttpRequest();
	requestGpsTrack.open('GET', urlGpsTrack, true);

	requestGpsTrack.onload = function () {
		var outputGpsTrack = JSON.parse(this.response);
		console.log("request2 status: " + requestGpsTrack.status);

		if (requestGpsTrack.status >= 200 && requestGpsTrack.status < 400) {
			var stopOutputGpsTrack = new Array();
			
			console.log("outputGpsTrack: " , outputGpsTrack);

			outputGpsTrack.track.forEach(out => {
				var stopArraysGpsTrack = new Array(out.accuracy, out.latitude, out.longitude);
				stopOutputGpsTrack.push(stopArraysGpsTrack);
			});

			for (var i = 0; i < stopOutputGpsTrack.length; i++) {
				circle = new L.circle([stopOutputGpsTrack[i][1],stopOutputGpsTrack[i][2]], stopOutputGpsTrack[i][0], {
				  fillOpacity: 0.6,
				  fillColor: "#f2fb1e",
				  color: "#f2fb1e"
				}).bindPopup('trails')
				.addTo(map);
			}
		} 
		else {
			const errorMessage = document.createElement('marqueeGpsTrack');
			errorMessage.textContent = `Bad Request Executed. Recheck if you inputted the correct fahrtID`;
			app.appendChild(errorMessage);
		}	
	}		
	requestGpsTrack.send();
}








