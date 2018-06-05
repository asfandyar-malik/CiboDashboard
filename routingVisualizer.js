function calculateRoute() {

	const app = document.getElementById('map1');
	var x=document.getElementById("form1") ;
	var fahrtID =x.elements["FahrtID"].value;
	var url = 'http://cumo4.mobilesticket.de/lecibo/tour/reconstructionbest?fahrtID=' + fahrtID + '&includeShape=false'

	var request = new XMLHttpRequest();

	request.open('GET', url, true);

	request.onload = function () {
	  // Begin accessing JSON data here
	  var output = JSON.parse(this.response);
	  console.log("outputX: ", output);

	  var maxLat, maxLon, minLat, minLon;

	  if (request.status >= 200 && request.status < 400) {
			console.log("apiProvider: ", output.apiProvider)
			console.log("arrivalTime: ", output.legDTO[0].arrivalTime)
			console.log("lat: ", output.legDTO[0].stopSequence[0].lat)

			var stopOutput = new Array();

			output.legDTO.forEach(leg => {
				console.log("destinationName", leg.destinationName);
				leg.stopSequence.forEach(stop => {
				  var stopArray = new Array(stop.name, stop.lat, stop.lon);
				  console.log("stopArray: ", stopArray);
				  stopOutput.push(stopArray);
				}); 
			});

			console.log("stopOutput: ", stopOutput);

			var map = L.map('map1').setView([51.51796, 7.458452 ], 15);

			L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
				    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
				    maxZoom: 40,
				    id: 'mapbox.streets',
				    accessToken: 'pk.eyJ1IjoiYWFtYWxpazE0IiwiYSI6ImNqaHp2cTNxYzB5ZXIzcXBnOXRpbmM3bnMifQ.XHF7nVhTYLVAcuv2iq8l_Q'
				}).addTo(map);


			//Change the size and color of circular markers here
			for (var i = 0; i < stopOutput.length; i++) {
				circle = new L.circle([stopOutput[i][1],stopOutput[i][2]], 50, {
				  fillOpacity: 0.5
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
}

