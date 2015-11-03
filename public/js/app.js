angular.module('app', ['ngRoute']);

angular.module('app').config(function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'home.html',
      controller: 'HomeCtrl',
      controllerAs: 'home'
    })
    .when('/view1/:argument?', {
      templateUrl: 'view1.html',
      controller: 'View1Ctrl',
      controllerAs: 'view1'
    })
    .when('/passanger', {
      templateUrl: 'PassangerRequest.html',
      controller: 'PassangerCtrl',
      controllerAs: 'passanger'
    })
    .otherwise({redirectTo: '/'});
});

function getPassengerModel()
{
	return  [{name: "Gil-ad"}];	   
}


angular.module('app').controller('PassangerCtrl',
	
	init : function()
	{
		var	self	=	this;
	 	self.passenger=	getPassengerModel();
	 	return self.passenger;
	},
	
	post: function(PassengerRepository , passengerList)
	{				
		
		  PassengerRepository.post(self.passengerList).then(
				function(result)
				{
					if(result != null && result != "undefined")
					{
						if(result.status == true)
						{
							console.log("in passanger.post. in success handler scope. result is true");
						}
					}
				},
				function(result)
				{
					if(result != null && result != "undefined")
					{
						console.log("in passanger.post. in error handler scope");
					}
				}
			)
			.catch(function(result)
			{
				console.log("in passanger.post. in catch handler scope");
			});
	}
);


angular.module('app').factory('PassengerRepository',	function($q)	
{	
	return	
	{	
		post:	function()
			 	  {	
			 	 	   return	$q.when( { status: true } );
		      }
	};
});