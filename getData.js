var _ = require('lodash');
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({ host: 'localhost:9200', log: 'trace', apiVersion: '2.0' });
var exportArr = 
	
		
[

/*{
	  "user_type" : "Driver",
	  "user_id" : "10",
	  "name": "Noa Ben Driver",
	  "date": "17/11/15",
	  "time": "12:00:00",
	  "source": "Tel-Aviv",
	  "destination": "HAIFA",
	  "mail" : "noa_ben@mail.com",
	  "status_match": false,
	  "is_in_db":true,
	  "is_selected" : false,
	  "is_email_sent": false ,
	   "rank": 0
	},
	{
	  "user_type" : "passenger",
	  "user_id" : "1",
	  "name": "Noa Ben",
	  "date": "17/11/15",
	  "time": "12:00:00",
	  "source": "Tel-Aviv",
	  "destination": "HAIFA",
	  "mail" : "noa_ben@mail.com",
	  "status_match": false,
	  "is_in_db":true,
	  "is_selected" : false,
	  "is_email_sent": false ,
	   "rank": 0
	},
	{
	  "user_type" : "Driver",
	  "user_id": "2",
	  "name": "Miki Lev",
	  "date": "12/11/15",
	  "time": "10:00:00",
	  "source": "Tel-Aviv",
	  "destination": "HAIFA",
	  "mail" : "miki.lev@mail.com",
	  "status_match": false,
	  "is_in_db":true,
	  "is_selected" : false,
	  "is_email_sent": false,
	   "rank": 0
	},
	{
	  "user_type" : "Driver",
	  "user_id": "2",
	  "name": "Miki Lev",
	  "date": "15/11/15",
	  "time": "15:00:00",
	  "source": "HEIFA",
	  "destination": "Tel-Aviv",
	  "mail" : "miki.lev@mail.com",
	  "status_match": false,
	  "is_in_db":true,
	  "is_selected" : false,
	  "is_email_sent": false
	},
	{
	  "user_type" : "Driver",
	  "user_id": "2",
	  "name": "Miki Lev",
	  "date": "4/11/15",
	  "time": "08:00:00",
	  "source": "Tel-Aviv",
	  "destination": "HAIFA",
	  "mail" : "miki.lev@mail.com",
	  "status_match": false,
	  "is_in_db":true,
	  "is_selected" : false,
	  "is_email_sent": false
	},
	{
	  "user_type" : "passenger",
	  "user_id": "3",
	  "name": "Hen Shemesh",
	  "date": "2/11/15",
	  "time": "13:00:00",
	  "source": "HEIFA",
	  "destination": "TEL AVIV",
	  "mail" : "HEN111@mail.com",
	  "status_match": true,
	  "is_in_db":true,
	  	"is_selected" : false,
	  "is_email_sent": false
	},
	{
	  "user_type" : "Driver",
	  "user_id": "4",
	  "name": "danna jen",
	  "date": "3/11/15",
	  "time": "11:00:00",
	  "source": "Tel-Aviv",
	  "destination": "HAIFA",
	  "mail" : "danna555@mail.com",
	  "status_match": false,
	  "is_in_db":true,
	  "is_selected" : false,
	  "is_email_sent": false
	},
	{
	  "user_type" : "passenger",
	  "user_id": "5",
	  "name": "Miki Lev",
	  "date": "2/11/15",
	  "time": "10:00:00",
	  "source": "Tel-Aviv",
	  "destination": "HAIFA",
	  "mail" : "miki.lev@mail.com",
	  "status_match": false,
	  "is_in_db":true,
	  "is_selected" : false,
	  "is_email_sent": false

	}*/
	
]; 



function resultToJson(result) {

  return _.merge({id: result._id}, result._source);
}

module.exports = {
		GetData:function (response)
		{

			 client.create({
      index: 'kdcar',
      type: 'users',
      body: {
	   "name": "Miki Lev",
	   "user_id" : "5",
	  "passengers": [ {
						"user_type" : "passenger",
	  					"user_id": "5",
	  					"name": "Miki Lev",
	  					"date": "2/11/15",
				    	"time": "10:00:00",
	  					"source": "Tel-Aviv",
	  					"destination": "HAIFA",
	  					"mail" : "miki.lev@mail.com",
	  					"status_match": false,
	  					"is_in_db":true,
	  					"is_selected" : false,
	  					"is_email_sent": false

	  }]

		}
    }).then(function(result) {
    	console.log("result._id = " , result._id);
   	  });
   	 
			console.log ("in get data");
			return client.search({
			       
 				index: 'kdcar',
 				type: 'users',
				query: {
    				filtered: {
      					query: {
        					match_all: {}
      						},
      					filter: {
        					nested : {
		          					path : ["passengers","drivers"]
   									}
   								}
   							}
   						}
    			}).then(
      				function(resources) {
      					console.log ("in get data - hits");
        				return _.map(resources.hits.hits, resultToJson);

      				},
      				function(result) {
      					console.log ("in get error");
        				throw result;
      				}
    			);
			 
		},
		
		GetDataOfRides:function(name, source ,destination, date , time) {
			console.log("in get data of rides *{0}*", name, source ,destination, date , time);
			

 			return client.search({
			       
 				index: 'kdcar',
 				type: 'users',
				query: {
    				filtered: {
      					query: {
        					match_all: {}
      						},
      					filter: {
        					nested : {
		          					path : ["passengers"]

   									}
   								}
   							}
   						}
    			}).then(
      				function(resources) {
      					var retArr = [];
      					console.log ("in get data - hits");
        				retArr = _.map(resources.hits.hits, resultToJson);

      				},
      				function(result) {
      					console.log ("in get error");
        				throw result;
      				}
    			);

			for (i=0;i<exportArr.length;i++) {
				if (exportArr[i].user_type == "passenger" 
					&& 
					   (name ==' ' || exportArr[i].name == name) &&
					   (source ==' ' || exportArr[i].source==source)  &&
					   (destination==' ' || exportArr[i].destination== destination) &&
					   (date==' ' || exportArr[i].date == date) &&
					   (time==' ' || exportArr[i].time == time)	 
					 	){ 
					retArr.push(exportArr[i]);
							console.log("pushing of rides ", exportArr[i].name, exportArr[i].source ,exportArr[i].destination, exportArr[i].date , exportArr[i].time);
				} else{
					console.log("not pushing of rides ", exportArr[i].name, exportArr[i].source ,exportArr[i].destination, exportArr[i].date , exportArr[i].time);

				}
			}
			return retArr;

		},
		GetDataOfMatchingRidesByUser:function(name, source ,destination, date , time) {
			console.log("in get data of rides ", name, source ,destination, date , time);
			var retArr = [];
			var passenger = "undefined";
			for (i=0;i<exportArr.length;i++) {
				if (exportArr[i].user_type == "passenger" 
					&&  exportArr[i].status_match == false &&
					(exportArr[i].name == name ||
					 (exportArr[i].source == source &&
					 exportArr[i].destination == destination &&
					 exportArr[i].date == date &&
					 exportArr[i].time == time )
					 	)){ 
					passenger = exportArr[i];
					 
					console.log("pushing of passenger ", exportArr[i].name, exportArr[i].source ,exportArr[i].destination, exportArr[i].date , exportArr[i].time);
				} 
			}

			for (i=0;i<exportArr.length;i++) {
				if (exportArr[i].user_type == "Driver" 
					&&  exportArr[i].status_match == false &&
					(exportArr[i].name == passenger.name ||
					 (exportArr[i].source == passenger.source &&
					 exportArr[i].destination == passenger.destination &&
					 exportArr[i].date == passenger.date &&
					 exportArr[i].time == passenger.time )
					 	)){ 
					 
					retArr.push(exportArr[i]);
					console.log("pushing of driver ", exportArr[i].name, exportArr[i].source ,exportArr[i].destination, exportArr[i].date , exportArr[i].time);
				} 
			}
			return retArr;

		},
		GetDataOfDrives:function(name, source ,destination, date , time) {
			console.log("in get data of rides ", name, source ,destination, date , time);
			var retArr = [];
			for (i=0;i<exportArr.length;i++) {
				if (exportArr[i].user_type == "Driver" 
					&& 
					(exportArr[i].name == name ||
					 (exportArr[i].source == source &&
					 exportArr[i].destination == destination &&
					 exportArr[i].date == date &&
					 exportArr[i].time == time )
					 	)){ 
					retArr.push(exportArr[i]);
					console.log("pushing of rides ", exportArr[i].name, exportArr[i].source ,exportArr[i].destination, exportArr[i].date , exportArr[i].time);
				} else{
					console.log("not pushing of rides ", exportArr[i].name, exportArr[i].source ,exportArr[i].destination, exportArr[i].date , exportArr[i].time);

				}
			}
			return retArr;

		},
		
		pushData:function (trempItem)
		{
			exportArr.push(trempItem);
		},
		
		markEmailAsSent: function(trempItemId)
		{
			 var updating = _.findWhere(exportArr, { 'user_id': trempItemId });
			 updating.is_email_sent = true;
		},
		
		getUser : function(user)
		{
			  user.rank = _.where(exportArr, { 'user_id': user.userId, "name": user.userName }).length;
			  return user;
		}		
}