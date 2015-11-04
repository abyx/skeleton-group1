var Q = require('q');
var express = require('express');
var bodyParser = require('body-parser');
var elasticsearch = require('elasticsearch');
var mail = require('./mail');
var _ = require('lodash');
var mailsender = require('./mail');
var checkRides = require('./checkRides');
var app = express();
var listOfRidesData = require('./getData');
 


var client = new elasticsearch.Client({ host: 'localhost:9200', log: 'trace', apiVersion: '2.0' });

app.use(express.static('public'));

app.use(bodyParser.json());

app.param('id', function(req, res, next) {
  next();
});

app.post('/getPassenger', function(request, response) {
  response.send({passenger: {
    "user_type" : "passenger",
    "user_id":  Math.random(),
    "name": "passenger",
    "date": new Date().toJSON().slice(0,10),
    "time": "08:00",
    "source": "Tel-Aviv",
    "destination": "Jerusalem",
    "mail" : "group11@mailinator.com ", //"fredgeorge123@mail.com",
    "status_match": false,
    "is_in_db":false
  }});
});

app.post('/getDriver', function(request, response) {
  response.send({driver: {
    "user_type" : "Driver",
    "user_id":  Math.random(),
    "name": "driver",
    "date": new Date().toJSON().slice(0,10),
    "time": "08:00",
    "source": "Tel-Aviv",
    "destination": "Jerusalem",
    "mail" : "fredgeorge123@mail.com",
    "status_match": false,
    "is_in_db":false
  }});
});



app.post('/getRides', function(request, response) {

var name = "undefined";
var source = "undefined";
var destination = "undefined";
var date = "undefined";
var time = "undefined";
  if (request.body != "undefined") 
  {
    console.log("request body is " , request.body);
      name = request.body.name;
      source = request.body.source;
      destination = request.body.destination;
      date = request.body.date;
      time = request.body.time;
 }
  var rides = listOfRidesData.GetDataOfRides(name, source ,destination, date , time);
  response.send({Rides:rides});
});

pp.post('/getDrives', function(request, response) {

var name = "undefined";
var source = "undefined";
var destination = "undefined";
var date = "undefined";
var time = "undefined";
  if (request.body != "undefined") 
  {
    console.log("request body is " , request.body);
      name = request.body.name;
      source = request.body.source;
      destination = request.body.destination;
      date = request.body.date;
      time = request.body.time;
 }
  var rides = listOfRidesData.GetDataOfDrives(name, source ,destination, date , time);
  response.send({Rides:rides});
});



app.get('/example', function(request, response) {
  response.send({success: true});
});

 

app.post('/PassengerRequest/', function(request, response) {
  console.log(request.body);

 console.log("begin update passenger");

  var passengers=request.body;
  
  for (i=0 ; i<passengers.length ; i++) 
  {
    listOfRidesData.pushData(passengers[i]);
  }

  console.log("end update passenger");

  response.sendStatus(200);
});

app.post('/DriverRequest/', function(request, response) {
  console.log(request.body);

 console.log("begin update rides");

  var drivers=request.body;
  for (i=0 ; i<drivers.length ; i++) 
  {
    listOfRidesData.pushData(drivers[i]);
  } 

  console.log("end update rides");

  response.sendStatus(200);
});


app.post('/example/:id', function(request, response) {
  console.log(request.body, request.params.id, 'query', request.query);
  response.sendStatus(200);
});

app.post('/another/example', function(request, response) {
  response.redirect('/example');
});

function resultToJson(result) {
  return _.merge({id: result._id}, result._source);
}

app.route('/resources')
  .get(function(request, response) {
    client.search({
      index: 'myindex',
      type: 'resources'
    }).then(
      function(resources) {
        response.send(_.map(resources.hits.hits, resultToJson));
      },
      function() {
        response.sendStatus(500);
      }
    );
  })
  .post(function(request, response) {
    client.create({
      index: 'myindex',
      type: 'resources',
      body: request.body
    }).then(function(result) {
      return getResourceById(result._id).then(function(object) {
        response.send(object);
      });
    }).catch(function() {
      response.sendStatus(500);
    });
  });

function getResourceById(id) {
  return client.get({
    index: 'myindex',
    type: 'resources',
    id: id
  }).then(function(result) {
    return resultToJson(result);
  });
}

app.route('/resources/:id')
  .get(function(request, response) {
    getResourceById(request.params.id).then(function(result) {
      response.send(result);
    }).catch(function(error) {
      if (error instanceof elasticsearch.errors.NotFound) {
        response.sendStatus(404);
      } else {
        response.sendStatus(500);
      }
    });
  })
  .delete(function(request, response) {
    client.delete({
      index: 'myindex',
      type: 'resources',
      id: request.params.id
    }).then(function(result) {
      response.sendStatus(204);
    }).catch(function(error) {
      if (error instanceof elasticsearch.errors.NotFound) {
        response.sendStatus(404);
      } else {
        response.sendStatus(500);
      }
    });
  })
  .put(function(request, response) {
    // NOTE: this is a partial update
    client.update({
      index: 'myindex',
      type: 'resources',
      id: request.params.id,
      body: {doc: request.body}
    }).then(function(result) {
      return getResourceById(result._id).then(function(object) {
        response.send(object);
      });
    }).catch(function(error) {
      if (error instanceof elasticsearch.errors.NotFound) {
        response.sendStatus(404);
      } else {
        response.sendStatus(500);
      }
    });
  });


client.ping({requestTimeout: 3000, hello: 'hey'}).then(
  function() {
    var server = app.listen(3000, function() {
      var host = server.address().address;
      var port = server.address().port;

      console.log(' [*] Listening at http://%s:%s', host, port);
      
      matchRides();
    });
  },
  function(err) {
    process.exit(1);
  }
);

function matchRides() {

	  var hour = 1;
	  var interval = hour * 1 * 5 * 1000;
	 
	  setInterval(function() {
	  		
	  		console.log("I am doing my 1 minutes check");
	  		
	  		var ridesList = checkRides.checkRides();
	  			
	  		if(ridesList != null && ridesList != 'undefined')
	  		{
	  			console.log("ridesList = ",  ridesList);
	  			
	  			 for(var i = 0; i < ridesList.length; i++)
	  			 {
	  			 	 console.log("ridesList[i] = ", ridesList[i]);
	  			 	try
	  			 	{
	  			 	  //get the email
	  			 	  var passangerEmail = getPassangerEmail(ridesList[i]);
	  			 	  var body = getEmailBody(ridesList[i]);
	  			 	  var subject = getEmailSubject(ridesList[i]);
	  			 	 
	  			 	  
	  			 	  if(passangerEmail != null && passangerEmail != 'undefined')
	  			 	  {
	  			 	  	 var sendEmailResult = mail.sendmail(passangerEmail, subject, body);
	  			 	  	 if(sendEmailResult != null && sendEmailResult != 'undefined')
	  			 	  	 {
	  			 	  	 	 console.log("sendEmailResult = ", sendEmailResult);
	  			 	  	 	
	  			 	  	 	 if(sendEmailResult)
		  			 	  	 {
		  			 	  	 	  markRideAsMatch(matchResult.rideID);
		  			 	  	 }
	  			 	  	}
	  			 	  }
	  			 	}
	  			 	catch(err)
	  			 	{
	  			 		console.log("error = " + err);
	  			 	}
	  			 }
	  		}	
	  			
	  		
		}, interval);
}

function getPassangerEmail(ride)
{
	var email = ride.passenger.mail;
	console.log("Email Address = " + email);
	return email;
}

function getEmailBody(ride)
{
	var body =  "Thank you for using the amazing KdCar !!! we have a WINNER !!! You will be ride with " + getDriverName(ride) + getRideDetials(ride) + " :-). Have a nice ride!!!"; 
	console.log("Email body = " + body);
	return body;
}

function getDriverName(ride)
{
	var name = ride.driver.name;
	return name;
}

function getRideDetials(ride)
{
	var date = ride.driver.date;
	var time = ride.driver.time;
	var from = ride.driver.source;
	var to = ride.driver.destination;
	return " on " + date + " at " + time + " from " + from + " to " + to 
}

function getEmailSubject(ride)
{
	var subject =  "A new message from KdCar [rideId = " + ride.driver.user_id + "] ";
	console.log("Email subject = " + subject);
	return subject;
}

function markRideAsMatch(rideID)
{
	 //update the db with this ride as closed --> meaning we have match between passenger and driver/ride
	 
	 return true;	 
}

function sendMail()
{
	return true;
}
 
 
function getHTML(txt)
{
	 var html = "<html><body style='{bgcolor:gray, color:blue }'>" + txt + "</body></html>"
	 return html;
}

function SavePost(list)
{
  var res = {status:"success"};
  return res;
}
