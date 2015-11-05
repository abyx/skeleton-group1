var Q = require('q');
var express = require('express');
var listOfRidesData = require('./getData');
 

module.exports = { 
 
checkRides : function  () 
{
	var response = [];
	return listOfRidesData.GetData().then(function(listOfRides) {
    //console.log("list of rides is  = ",  listOfRides);
	//console.log("LENGTH="+listOfRides.length);
	
   for (i=0; i<listOfRides.length ;i++)
	{
		//console.log("listOfRides[i] = ",  listOfRides[i]);
	  //console.log("listOfRides[i].user_type  = ",  listOfRides[i].user_type);
		if (listOfRides[i].user_type == "passenger")  { 
			var passengerAttribute = {"Passenger": listOfRides[i] , "Rides" : listOfRides};
	   		var resolute = checkRide(passengerAttribute);
	   		 //console.log("resolute = ",  resolute);
	   			if (resolute != null && resolute != "undefined") 
	   			{
	   				var obj = { passenger : listOfRides[i], driver : resolute  } 
	   				response.push(obj);
	   			}
		} 
	}
 
  		return response;
	}) ;
	
}
}
 function checkRide (request) 
{
	//console.log("checkRide request is  = ",  request);
	//console.log("passenger is  = ",  request.Passenger);
	//console.log("Rides is  = ",  request.Rides);
	
	if (request.Passenger.status_match == false) {
  
     var rides = request.Rides;
 		
     for(j = 0; j < rides.length; j++) {
     	if (rides[j].user_type== "Driver" 
     		&& rides[j].source == request.Passenger.source 
     		&& rides[j].destination == request.Passenger.destination 
     		&& rides[j].time == request.Passenger.time
     		&& rides[j].date == request.Passenger.date
     		) {
     			 return rides[j];
     	  }
      }
	}
	
	return "undefined";
}







 
