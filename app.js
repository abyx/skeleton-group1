var Q = require('q');
var express = require('express');
var bodyParser = require('body-parser');
var elasticsearch = require('elasticsearch');
var mail = require('./mail');
var _ = require('lodash');
var mailsender = require('./mail');
var checkRides = require('./checkRides');
var app = express();

var client = new elasticsearch.Client({ host: 'localhost:9200', log: 'trace', apiVersion: '2.0' });

app.use(express.static('public'));
app.use(bodyParser.json());

app.param('id', function(req, res, next) {
  next();
});

app.get('/example', function(request, response) {
  response.send({success: true});
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

	  var hour = 8;
	  var interval = hour * 60 * 60 * 1000;
	 
	  setInterval(function() {
	  		
	  		console.log("I am doing my 1 minutes check");
	  		
	  		var passengerList = checkRides.checkRides();
	  			
	  		if(passengerList != null && passengerList != 'undefined')
	  		{
	  			console.log("passengerList = " +  passengerList);
	  			
	  			 for(i = 0; i < passengerList.length; i++)
	  			 {
	  			 	//get the email
	  			 	  var passangerEmail = getPassangerEmailByID(passengerList[i]);
	  			 	  
	  			 	  console.log("passangerEmail = " + passangerEmail);
	  			 	  var txt = "Thank you for using the amazing KdCar !!! we have a WINNER !!! You will be ride with Shai Hasan the KING on this Wednesday at 08:30 AM from Tel-Aviv base to Jerusalem :-). Have a nice ride!!!"; 
	  			 	  var subject = "A new message from KdCar";
	  			 	  
	  			 	  if(passangerEmail != null && passangerEmail != 'undefined')
	  			 	  {
	  			 	  	 var sendEmailResult = mail.sendmail(passangerEmail, subject, txt);
	  			 	  	 if(sendEmailResult != null && sendEmailResult != 'undefined')
	  			 	  	 {
	  			 	  	 	 console.log("sendEmailResult = " + sendEmailResult);
	  			 	  	 	
	  			 	  	 	 if(sendEmailResult)
		  			 	  	 {
		  			 	  	 	  markRideAsMatch(matchResult.rideID);
		  			 	  	 }
	  			 	  	}
	  			 	  }
	  			 }
	  		}	
	  			
	  		
		}, interval);
}

function getPassangerEmailByID(passanger)
{
	var email = passanger.mail;
	console.log("email = " + email + ". but sending to fredgeorge123@mail.com");
	return "fredgeorge123@mail.com";
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
