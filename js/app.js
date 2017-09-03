function openCloseStateLog(){
var object = document.getElementById("state_log_tr");
if(object.style.display == "none"){
object.style.display ="";
}else{
object.style.display ="none";
}
}


/************** old *****************/
function orientationChange(e) {
    var orientation="portrait";

    if(window.orientation == -90 || window.orientation == 90) orientation = "landscape";
    document.getElementById("status").innerHTML+=orientation+"<br>";
}

var dateObj = new Date();

(function() {
  'use strict';
  var injectedState = {
    key: 'CON307XYZ',
    label: 'CON307XYZ',
    shipmentCode:'12GF239',
	departureDate:'2016-01-01',
	vessel:'unknown',
	portOfLoad:'unknown',
	portOfDischarge:'unknown',
	transhipment:'No',
    currently: {
      time: ((dateObj.getTime())/1000),
      summary: 'Empty to Shipper',
      icon: 'state-1',
      size: 40,
      finalPOD: 'Egypt-DK',
      shippedTo: 'Egypt-DK'
    },
    logData: {
      data: [
        {date: '01/01/2017', state: "state 1", vessel: "vessel 1",Voyage:"Voyage 1",port:"Port1"},
        {date: '02/01/2017', state: "state 2", vessel: "vessel 2",Voyage:"Voyage 2",port:"Port2"},
        {date: '03/01/2017', state: "state 3", vessel: "",Voyage:"",port:"Port3"},
        {date: '04/01/2017', state: "state 4", vessel: "vessel 4",Voyage:"Voyage 4",port:"Port4"}
      ]
    }
  };

  var TrackingAPIUrlBase = 'http://egcan.com/SmartBusiness/tracking.php?tracknumber=';

  var app = {
    isLoading: true,
    visibleCards: {},
    selectedCodes: [],
    spinner: document.querySelector('.loader'),
    cardTemplate: document.querySelector('.cardTemplate'),
    ShipmentCardTemplate: document.querySelector('.cardTemplateShipment'),
    container: document.querySelector('.contents'),
    addDialog: document.querySelector('.dialog-container')
  };


  /*****************************************************************************
   *
   * Event listeners for UI elements
   *
   ****************************************************************************/

  /* Event listener for refresh button */
  document.getElementById('butRefresh').addEventListener('click', function() {
    app.updateTracking();
  });

  /* Event listener for add new code button */
  document.getElementById('butAdd').addEventListener('click', function() {
    // Open/show the add new code dialog
    app.toggleAddDialog(true);
  });

  /* Event listener for add city button in add city dialog */
  document.getElementById('butAddCode').addEventListener('click', function() {
    var select = document.getElementById('TrackingNumber');
    var selected = select.value;
    var key = select.value;
    var label = select.value;
    app.getTracking(key, label);
    app.selectedCodes = [];
    app.visibleCards = {};
    app.selectedCodes.push({key: key, label: label});
    app.saveSelectedCodes();
    app.container.textContent = '';
    app.toggleAddDialog(false);
  });

  /* Event listener for cancel button in add city dialog */
  document.getElementById('butAddCancel').addEventListener('click', function() {
    app.toggleAddDialog(false);
  });


  /*****************************************************************************
   *
   * Methods to update/refresh the UI
   *
   ****************************************************************************/

  // Toggles the visibility of the add new code dialog.
  app.toggleAddDialog = function(visible) {
    if (visible) {
      app.addDialog.classList.add('dialog-container--visible');
    } else {
      app.addDialog.classList.remove('dialog-container--visible');
    }
  };
  
	app.toggleLog = function(key){

		if (app.visibleCards[key].querySelector('.log').getAttribute('hidden') == null) {
	      app.visibleCards[key].querySelector('.log').setAttribute('hidden','yes');
	    } else {
	      app.visibleCards[key].querySelector('.log').removeAttribute('hidden');
	    }
	}  
  
	app.toggleContent = function(){

		if (app.ShipmentCardTemplate.querySelector('.contents').getAttribute('hidden') == null) {
	      app.ShipmentCardTemplate.querySelector('.contents').setAttribute('hidden','yes');
	    } else {
	      app.ShipmentCardTemplate.querySelector('.contents').removeAttribute('hidden');
	    }
	}
  // Updates a Tracking card with the latest data. If the card
  // doesn't already exist, it's cloned from the template.
  app.updateTrackCard = function(data) {
    var card = app.visibleCards[data.key];
    if (!card) {
      card = app.cardTemplate.cloneNode(true);
      card.classList.remove('cardTemplate');
      card.querySelector('.TrackingCode').textContent = data.label;
      card.removeAttribute('hidden');
      app.container.appendChild(card);
      app.visibleCards[data.key] = card;
	  card.querySelector('.current .icon').addEventListener('click',function(key){app.toggleLog(data.key)});
	  }

  var dateElem = card.querySelector('.date');
    if (dateElem.getAttribute('data-dt') >= (data.currently.time*1000)) {
      //return;
    }
    dateElem.setAttribute('data-dt', (data.currently.time*1000));
    dateElem.textContent = new Date((data.currently.time*1000));
	
	
    card.querySelector('.description').textContent = data.currently.summary;
    card.querySelector('.date').textContent =  new Date(data.currently.time*1000).toGMTString();
    card.querySelector('.current .icon').classList.add(data.currently.icon);

	/********* shipment *****/
	app.ShipmentCardTemplate.querySelector('.TrackingCode').textContent = data.shipmentCode;
	app.ShipmentCardTemplate.querySelector('.date').textContent = new Date(data.currently.time*1000).toGMTString();
	app.ShipmentCardTemplate.querySelector('.current .TrackingNumber').textContent = data.shipmentCode;
	app.ShipmentCardTemplate.querySelector('.current .departureDate').textContent = data.departureDate;
	app.ShipmentCardTemplate.querySelector('.current .vessel').textContent = data.vessel;
	app.ShipmentCardTemplate.querySelector('.current .portOfLoad').textContent = data.portOfLoad;
	app.ShipmentCardTemplate.querySelector('.current .portOfDischarge').textContent = data.portOfDischarge;
	app.ShipmentCardTemplate.querySelector('.current .transhipment').textContent = data.transhipment;
	/********* end of shipment *****/    

    
    card.querySelector('.size .value').textContent =  data.currently.size;
    card.querySelector('.current .finalPOD').textContent = data.currently.finalPOD;
    card.querySelector('.current .shippedTo').textContent = data.currently.shippedTo;
    card.querySelector('.current .TrackingNumber').textContent = '[' + data.key+ ']';
    card.querySelector('.current .CurState').textContent = data.currently.summary;
	var oldLog = card.querySelector('.log table');
	var len = oldLog.childNodes.length;
	for(var y = 0 ; y < (len); y++){
		if(oldLog.childNodes[(oldLog.childNodes.length-1)].getAttribute('hidden') != 'yes'){
		oldLog.removeChild(oldLog.childNodes[(oldLog.childNodes.length-1)]);
		}
	}
    var nextDays = card.querySelectorAll('.future .oneday');
	for(var x= 0 ; x < data.logData.data.length; x++){
	var action = card.querySelector('.log .actionTemplate').cloneNode(true);
	action.classList.remove('actionTemplate');

	action.querySelector(".log_date").textContent = data.logData.data[x].date;
	action.querySelector(".log_location").textContent = data.logData.data[x].port;
	action.querySelector(".log_state").textContent = data.logData.data[x].state;
	action.querySelector(".log_vessel").textContent = data.logData.data[x].vessel;
	action.querySelector(".log_voyage").textContent = data.logData.data[x].Voyage;
	action.removeAttribute('hidden');
	card.querySelector('.log table').appendChild(action);
	}

    if (app.isLoading) {
      app.spinner.setAttribute('hidden', true);
      app.container.removeAttribute('hidden');
      app.isLoading = false;
    }
  };


  /*****************************************************************************
   *
   * Methods for dealing with the model
   *
   ****************************************************************************/

  // Gets a forecast for a specific city and update the card with the data

  app.getTracking = function(key, label) {
    var url = TrackingAPIUrlBase + key;
    // Make the XHR to get the data, then update the card
/*
    if ('caches' in window) {
      caches.match(url).then(function(response) {
        if (response) {
          response.json().then(function(json) {
			//if(app.hasRequestPending){	
	            json.key = key;
	            json.label = label;
	            app.updateTrackCard(json);
			//}
          });
        }
      });
    }
*/
	//app.hasRequestPending = true;
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (request.readyState === XMLHttpRequest.DONE) {
        if (request.status === 200) {
          var response = JSON.parse(request.response);

for(var k in response) {
//console.log(k, response[k]);
var r = new Array();
          r = response[k];
          r.key = response[k].key;
          r.label = response[k].label;
          app.updateTrackCard(r);
}
//          response.key = key;
//          response.label = label;
//          app.updateTrackCard(response);


        }
      }
    };
    request.open('GET', url);
    request.send();
  };

  // Iterate all of the cards and attempt to get the latest forecast data
  app.updateTracking = function() {
    var keys = Object.keys(app.visibleCards);
    keys.forEach(function(key) {
      app.getTracking(key);
    });
  };

  app.saveSelectedCodes = function() {
  //  window.localforage.setItem('selectedCodes', app.selectedCodes);
  };

  document.addEventListener('DOMContentLoaded', function() {
/*
    window.localforage.getItem('selectedCities', function(err, cityList) {
      if (cityList) {
        app.selectedCities = cityList;
        app.selectedCities.forEach(function(city) {
          app.getForecast(city.key, city.label);
        });
      } else {
        app.updateForecastCard(injectedForecast);
        app.selectedCities = [
          {key: injectedForecast.key, label: injectedForecast.label}
        ];
        app.saveSelectedCities();
      }
    });    
*/    
app.updateTrackCard(injectedState);    
app.ShipmentCardTemplate.querySelector('.current .icon').addEventListener('click',function(key){app.toggleContent()});
 window.addEventListener("orientationchange", orientationChange, true);
  });

/*
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
     .register('service-worker.js')
     .then(function() { 
        console.log('Service Worker Registered 2'); 
      });
  }

*/

})();
