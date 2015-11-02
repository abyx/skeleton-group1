var Q = require('q');
var express = require('express');
var listOfRides = require('./getData');
 

module.exports = { 

	checkRides : function  (response) 
{
	var response = [];
	var listOfRides = [];
  

   for (i=0; i<listOfRides.length ;i++)
	{
		if (listOfRides[i].user_type == "passenger")  { 
	   		checkRide({"Passenger": listOfRides[i] , "Rides" : listOfRides}, resolute)
	   		{ 
	   			if (resolute == true) 
	   			{
	   				response.push(listOfRides[i]);
	   			}

	   		};
		} 
	}
 
}

,
checkRide: function  (request, response) 
{
	if (request.Passenger.status_match == "no") {
     var rides = request.Rides;

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

}


 
