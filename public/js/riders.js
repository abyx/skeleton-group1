myModule.service('myRidersService', function($http) {
   
 

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

angular.module('app').controller('getRiders', function($scope, myRidersService, initRiders, RidersRepository) {
    var self = this;
   
   	console.log("in Riders. controller  BEGAIN.");
    function initController() {
          $scope.selectedOption = null;
          $scope.options = [];
          $scope.logentries = [];
        initRiders('getRides', [myRidersService.getOptions(' ',' ',' ' ,' ',' ')], function(result) {
        console.log("Riders is " ,  result);
        $scope.options = result[0].data.Riders;

        self.Ride = { name : "", source :"" , destination : "", date:"", time:""};
        self.Rides = result[0].data.Riders;



self.gridOptions = { 
    selectedItems: self.myRiders,
    multiSelect: false
  };

      self.columnDefs = [ 
           
          {field: "source", displayName: "Source", visible: true },
          {field: "destination",  displayName: "Destination", visible: true},
          {field: "date",  displayName: "Date", visible: true},
          {field: "time",  displayName: "Time", visible: true},
           {field: "name",  displayName: "Rider Name", visible: true },
          {field: "status_match",  displayName: "Has Match", visible: true}
        ];

       self.selectedOption = 0;
    });
    
    
    $scope.$on('appInitialized', function () {
        console.log("appInitialized - selection: " + $scope.selectedOption);
        $scope.logentries.push(($scope.logentries.length + 1) + " - appInitialized - selection: " + $scope.selectedOption);
    });
   } 
   
  self.post = function(RidersRepository, RidersList)
	{				
		console.log("in Riders.post BEGAIN. RidersRepository= " + RidersRepository + ", RidersList= " + RidersList);
		 
		  RidersRepository.post(self.RidersList).then(
				function(result)
				{
					if(result != null && result != "undefined")
					{
						if(result.status == true)
						{
							console.log("in Riders.post. in success handler scope. result is true");
						}
					}
				},
				function(result)
				{
					if(result != null && result != "undefined")
					{
						console.log("in Riders.post. in error handler scope");
					}
				}
			)
			.catch(function(result)
			{
				console.log("in Riders.post. in catch handler scope");
			});
	}

  self.get = function(RidersRepository, nameParam,sourceParam,destinationParam,dateParam,timeParam,Riders)
  {       
    console.log("in Riders.get BEGAIN. RidersRepository= " + RidersRepository );
     
      RidersRepository.get(self.Ride.name,
        self.Ride.source,
        self.Ride.destination,
        self.Ride.date,
        self.Ride.time,self.Riders).then(
        function(result)
        {
          if(result != null && result != "undefined")
          {
            if(result.status == true)
            {
              console.log("in Riders.get. in success handler scope. result is true");
            }
          }
        },
        function(result)
        {
          if(result != null && result != "undefined")
          {
            console.log("in Riders.get. in error handler scope");
          }
        }
      )
      .catch(function(result)
      {
        console.log("in Riders.get. in catch handler scope");
      });
  }
	
	  self.buttonClicked = function()
		{

      console.log(" buttonClicked ");
			 RidersRepository.get(self.Ride.name,
        self.Ride.source,
        self.Ride.destination,
        self.Ride.date,
        self.Ride.time,self.Rides);
		}
   
    initController();
	
});

angular.module('app.Repositories').factory('RidersRepository', function($http) {
	  return {
        post: function(RidersList) {
            $http.post('http://localhost:3000/RidersRequest',	RidersList).then(	
   						function(response)	
   						{	
   							  console.log('in RidersRepository.post. got response=',	response.data);

					        for (i= 0; i< RidersList.length; i++) 
					        {
					          RidersList[i].is_in_db = true;
					           
					        }
					
							},
					
					   	function(response)
		   				{
		  					console.log('in RidersRepository.post. got response=',	response.data);
		            for (i= 0; i< RidersList.length; i++) 
		            {
		              RidersList[i].is_in_db = false;
		            }
		 						alert ('Error');
		   				}   						
						);
        },
        get: function(nameParam,sourceParam,destinationParam,dateParam,timeParam,Riders) {
            $http.post('http://localhost:3000/getRides',   {name: nameParam,
                  source:sourceParam ,destination:destinationParam, 
                  date:dateParam , time:timeParam}).then(  
              function(response)  
              { 
                
                  console.log('in RidersRepository.get. got response=', response.data);
                if (response.data.Riders != null && response.data.Riders != "undefined") {
                
                while(Riders.length > 0) {
                     Riders.pop();
                }
                   
                  for (i= 0; i< response.data.Riders.length; i++) 
                  {
                      console.log('in RidersRepository.get. updating...', response.data);
                   response.data.Riders[i].is_selected = false;
                    Riders.push(response.data.Riders[i]);
                     
                  }  

                }
             
          
              },
          
              function(response)
              {
                console.log('in RidersRepository.get. got response=', response.data);
                if (response.data.Riders != null && response.data.Riders != "undefined") {
                    while(self.Riders.length > 0) {
                     self.Riders.pop();
                }
                for (i= 0; i< response.data.Riders.length; i++) 
                {
                  response.data.Riders[i].is_selected = false;
                   self.Riders.push(response.data.Riders[i]);
                }
                }
                alert ('Error');

              }               
            );
        }
    };

}); 

myModule.factory('initRiders', function ($q, $rootScope, $browser) {
 
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
    getRides.initRiders()
      .then(broadcastAppInitialized);
  };
 
  $rootScope.$on('$routeChangeStart', function () {
    registeredInitFunctions = {};
    initialized = false;
  });
 
  var initAppWhenReady = function () {
      initApplication();
    
  };
 
  var initRiders = function (name, dependencies, initCallback) {
    registeredInitFunctions[name] = {
      initRiders: function () {
        var internalDependencies = $q.all(dependencies);
        return internalDependencies.then(initCallback);
      }};
    initAppWhenReady();
  };
 
    initRiders.watchAfterInit = function (scope, expression, listener, deepEqual) {
      scope.$watch(expression, function (newValue, oldValue, listenerScope) {
        if (initialized) {
          listener(newValue, oldValue, listenerScope);
        }
      }, deepEqual);
    };

    initRiders.onAfterInit = function (scope, event, listener) {
      scope.$on(event, function (event) {
        if (initialized) {
          listener(event);
        }
      });
    };
 
  return  initRiders;
});

