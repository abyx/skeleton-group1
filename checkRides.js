var Q = require('q');
var express = require('express');
var listOfRidesData = require('./getData');
 

module.exports = { 



	checkRides : function  () 
{
	var response = [];
	var listOfRides = listOfRidesData.GetData() ;
  console.log("list of rides is  = " +  listOfRides);

   for (i=0; i<listOfRides.length ;i++)
	{
		if (listOfRides[i].user_type == "passenger")  { 
			var passengerAttribute = {"Passenger": listOfRides[i] , "Rides" : listOfRides};
	   		var resolute = checkRide(passengerAttribute);
	   		 console.log("resolute = " +  resolute);
	   			if (resolute == true) 
	   			{
	   				response.push(listOfRides[i]);
	   			}

	   		
		} 
	}
 
  return response;
}
}
 function checkRide (request) 
{
	 console.log("passenger is  = " +  request);
	if (request.Passenger.status_match == "no") {
     var rides = request.Rides;
 console.log("passenger is  = " +  request.Passenger);
     for(j=0;j<rides.length; j++) {
     	if (rides[j].user_type== "Driver" 
     		&& rides[j].source== request.Passenger.source 
     		&& rides[j].destination == request.Passenger.destination ) {
     		return true;
     	} 
      }

	}
	 return false;
}







 
