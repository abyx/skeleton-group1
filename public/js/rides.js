myModule.service('myRidesService', function($http) {
   
 

    this.getOptions = function(nameParam,sourceParam,destinationParam,dateParam,timeParam) {
        return $http({
            "method": "post",
            "url": 'http://localhost:3000/getRides', 
            "data": 
                {name: nameParam,
                  source:sourceParam ,destination:destinationParam, 
                  date:dateParam , time:timeParam}
            });
    
      };

    });

angular.module('app').controller('getRides', function($scope, myRidesService, initRides, RidesRepository) {
    var self = this;
   
   	console.log("in Rides. controller  BEGAIN.");
    function initController() {
          $scope.selectedOption = null;
          $scope.options = [];
          $scope.logentries = [];
        initRides('getRides', [myRidesService.getOptions(' ',' ',' ' ,' ',' ')], function(result) {
        console.log("Rides is " ,  result);
        $scope.options = result[0].data.Rides;

        self.Ride = { name : "", source :"" , destination : "", date:"", time:""};
        self.Rides = result[0].data.Rides;

        $scope.selectedOption = 0;
    });
    
    
    $scope.$on('appInitialized', function () {
        console.log("appInitialized - selection: " + $scope.selectedOption);
        $scope.logentries.push(($scope.logentries.length + 1) + " - appInitialized - selection: " + $scope.selectedOption);
    });
   } 
   
  self.post = function(RidesRepository, RidesList)
	{				
		console.log("in Rides.post BEGAIN. RidesRepository= " + RidesRepository + ", RidesList= " + RidesList);
		 
		  RidesRepository.post(self.RidesList).then(
				function(result)
				{
					if(result != null && result != "undefined")
					{
						if(result.status == true)
						{
							console.log("in Rides.post. in success handler scope. result is true");
						}
					}
				},
				function(result)
				{
					if(result != null && result != "undefined")
					{
						console.log("in Rides.post. in error handler scope");
					}
				}
			)
			.catch(function(result)
			{
				console.log("in Rides.post. in catch handler scope");
			});
	}

  self.get = function(RidesRepository, nameParam,sourceParam,destinationParam,dateParam,timeParam,Rides)
  {       
    console.log("in Rides.get BEGAIN. RidesRepository= " + RidesRepository );
     
      RidesRepository.get(self.Ride.name,
        self.Ride.source,
        self.Ride.destination,
        self.Ride.date,
        self.Ride.time,self.Rides).then(
        function(result)
        {
          if(result != null && result != "undefined")
          {
            if(result.status == true)
            {
              console.log("in Rides.get. in success handler scope. result is true");
            }
          }
        },
        function(result)
        {
          if(result != null && result != "undefined")
          {
            console.log("in Rides.get. in error handler scope");
          }
        }
      )
      .catch(function(result)
      {
        console.log("in Rides.get. in catch handler scope");
      });
  }
	
	  self.buttonClicked = function()
		{

      console.log(" buttonClicked ");
			 RidesRepository.get(self.Ride.name,
        self.Ride.source,
        self.Ride.destination,
        self.Ride.date,
        self.Ride.time,self.Rides);
		}
   
    initController();
	
});

angular.module('app.Repositories').factory('RidesRepository', function($http) {
	  return {
        post: function(RidesList) {
            $http.post('http://localhost:3000/RidesRequest',	RidesList).then(	
   						function(response)	
   						{	
   							  console.log('in RidesRepository.post. got response=',	response.data);

					        for (i= 0; i< RidesList.length; i++) 
					        {
					          RidesList[i].is_in_db = true;
					           
					        }
					
							},
					
					   	function(response)
		   				{
		  					console.log('in RidesRepository.post. got response=',	response.data);
		            for (i= 0; i< RidesList.length; i++) 
		            {
		              RidesList[i].is_in_db = false;
		            }
		 						alert ('Error');
		   				}   						
						);
        },
        get: function(nameParam,sourceParam,destinationParam,dateParam,timeParam,Rides) {
            $http.post('http://localhost:3000/getRides',   {name: nameParam,
                  source:sourceParam ,destination:destinationParam, 
                  date:dateParam , time:timeParam}).then(  
              function(response)  
              { 
                
                  console.log('in RidesRepository.get. got response=', response.data);
                if (response.data.Rides != null && response.data.Rides != "undefined") {
                
                while(Rides.length > 0) {
                     Rides.pop();
                }
                   
                  for (i= 0; i< response.data.Rides.length; i++) 
                  {
                      console.log('in RidesRepository.get. updating...', response.data);
                   response.data.Rides[i].is_selected = false;
                    Rides.push(response.data.Rides[i]);
                     
                  }  

                }
             
          
              },
          
              function(response)
              {
                console.log('in RidesRepository.get. got response=', response.data);
                if (response.data.Rides != null && response.data.Rides != "undefined") {
                    while(self.Rides.length > 0) {
                     self.Rides.pop();
                }
                for (i= 0; i< response.data.Rides.length; i++) 
                {
                  response.data.Rides[i].is_selected = false;
                   self.Rides.push(response.data.Rides[i]);
                }
                }
                alert ('Error');

              }               
            );
        }
    };

}); 

myModule.factory('initRides', function ($q, $rootScope, $browser) {
 
  var initFunctions = [
    'getRides'
  ];
  var registeredInitFunctions = {};
  var initialized = false;
 
  var initApplication = function () {
    var getRides = registeredInitFunctions['getRides'];
 
    var broadcastAppInitialized = function () {
      $browser.defer(function () {
        initialized = true;
        $rootScope.$apply(function () {
          $rootScope.$broadcast('appInitialized');
        });
      });
    };
    getRides.initRides()
      .then(broadcastAppInitialized);
  };
 
  $rootScope.$on('$routeChangeStart', function () {
    registeredInitFunctions = {};
    initialized = false;
  });
 
  var initAppWhenReady = function () {
      initApplication();
    
  };
 
  var initRides = function (name, dependencies, initCallback) {
    registeredInitFunctions[name] = {
      initRides: function () {
        var internalDependencies = $q.all(dependencies);
        return internalDependencies.then(initCallback);
      }};
    initAppWhenReady();
  };
 
    initRides.watchAfterInit = function (scope, expression, listener, deepEqual) {
      scope.$watch(expression, function (newValue, oldValue, listenerScope) {
        if (initialized) {
          listener(newValue, oldValue, listenerScope);
        }
      }, deepEqual);
    };

    initRides.onAfterInit = function (scope, event, listener) {
      scope.$on(event, function (event) {
        if (initialized) {
          listener(event);
        }
      });
    };
 
  return  initRides;
});

