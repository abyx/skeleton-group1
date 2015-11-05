

 
angular.module('app.Repositories', []);
var myModule = angular.module('app', ['ngRoute','ui.bootstrap', 'app.Repositories','ui.grid'])


.directive('customDatepicker',function($compile,$timeout){
        return {
            replace:true,
            templateUrl:'custom-datepicker.html',
            scope: {
                ngModel: '=',
                dateOptions: '@',
                dateDisabled: '@',
                opened: '=',
                min: '@',
                max: '@',
                popup: '@',
                options: '@',
                name: '@',
                id: '@'
            },
            link: function($scope, $element, $attrs, $controller){

            }    
        };
    })
    .controller('myController',function($scope){
        $scope.birthDate = '2013-07-23';
        $scope.dateOptions = {};
    });

    


angular.module('app').config(function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'home.html',
      controller: 'getPassenger',
      controllerAs: 'passanger'
    })
    .when('/driver', {
      templateUrl: 'driver.html',
      controller: 'getDriver',
      controllerAs: 'driver'
    })
    .when('/rides', {
      templateUrl: 'rides.html',
      controller: 'getRides',
      controllerAs: 'Rides'
    })
    
    .when('/drives', {
      templateUrl: 'drives.html',
      controller: 'getDrives',
      controllerAs: 'Drives'
    })
      .when('/view2', {
      templateUrl: 'view2.html',
      controller: 'View2Ctrl',
      controllerAs: 'Drives'
    })
    .when('/passanger', {
      templateUrl: 'PassangerRequest.html',
      controller: 'getPassenger',
      controllerAs: 'passanger'
    })
        .when('/users', {
      templateUrl: 'SignIn.html',
      controller: 'getUsers',
      controllerAs: 'users'
    })
    .otherwise({redirectTo: '/'});
});


myModule.factory('init', function ($q, $rootScope, $browser) {
 
  var initFunctions = [
    'getPassenger'
  ];
  var registeredInitFunctions = {};
  var initialized = false;
 
  var initApplication = function () {
    var getPassenger = registeredInitFunctions['getPassenger'];
 
    var broadcastAppInitialized = function () {
      $browser.defer(function () {
        initialized = true;
        $rootScope.$apply(function () {
          $rootScope.$broadcast('appInitialized');
        });
      });
    };
    getPassenger.init()
      .then(broadcastAppInitialized);
  };
 
  $rootScope.$on('$routeChangeStart', function () {
    registeredInitFunctions = {};
    initialized = false;
  });
 
  var initAppWhenReady = function () {
      initApplication();
    
  };
 
  var init = function (name, dependencies, initCallback) {
    registeredInitFunctions[name] = {
      init: function () {
        var internalDependencies = $q.all(dependencies);
        return internalDependencies.then(initCallback);
      }};
    initAppWhenReady();
  };
 
    init.watchAfterInit = function (scope, expression, listener, deepEqual) {
      scope.$watch(expression, function (newValue, oldValue, listenerScope) {
        if (initialized) {
          listener(newValue, oldValue, listenerScope);
        }
      }, deepEqual);
    };

    init.onAfterInit = function (scope, event, listener) {
      scope.$on(event, function (event) {
        if (initialized) {
          listener(event);
        }
      });
    };
 
  return  init;
});

myModule.service('myService', function($http) {
    
    this.getOptions = function() {
        return $http({
            "method": "post",
            "url": 'http://localhost:3000/getPassenger', 
            "data": {
                options: []
            }
        });
    };
});


myModule.controller('getPassenger', function($scope, myService, init, PassangerRepository, $timeout, $route) {
    var self = this;
   
   	console.log("in passanger. controller  BEGAIN.");
    function initController() {
          $scope.selectedOption = null;
          $scope.options = [];
          $scope.logentries = [];
        init('getPassenger', [myService.getOptions()], function(result) {
        console.log("passenger is " ,  result);
        $scope.options = result[0].data.passenger;

        self.passenger = result[0].data.passenger;
        $scope.selectedOption = 0;
    });
    
    
    $scope.$on('appInitialized', function () {
        console.log("appInitialized - selection: " + $scope.selectedOption);
        $scope.logentries.push(($scope.logentries.length + 1) + " - appInitialized - selection: " + $scope.selectedOption);
    });
   } 
   
  self.post = function(PassengerRepository, passengerList)
	{				
		console.log("in passanger.post BEGAIN. PassengerRepository= " + PassengerRepository + ", passengerList= " + passengerList);
		 
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
	
	  self.buttonClicked = function()
		{
			 PassangerRepository.post([self.passenger]);
			 $timeout(function(){ $route.reload(); }, 2000);
		}
   
    initController();
	
});


angular.module('app.Repositories').factory('PassangerRepository', function($http) {
	  return {
        post: function(passengerList) {
            $http.post('http://localhost:3000/PassengerRequest',	passengerList).then(	
   						function(response)	
   						{	
   							  console.log('in PassengerRepository.post. got response=',	response.data);

					        for (i= 0; i< passengerList.length; i++) 
					        {
					          passengerList[i].is_in_db = true;
					           
					        }
					
							},
					
					   	function(response)
		   				{
		  					console.log('in PassengerRepository.post. got response=',	response.data);
		            for (i= 0; i< passengerList.length; i++) 
		            {
		              passengerList[i].is_in_db = false;
		            }
		 						alert ('Error');
		   				}   						
						);
        }
    };

}); 




myModule.controller('getUsers', function($scope, myService, init, UsersRepository, $timeout, $route) {
    var self = this;
   
    console.log("in users. controller  BEGAIN.");
    function initController() {
          $scope.selectedOption = null;
          $scope.options = [];
          $scope.logentries = [];
        init('getUsers', [myService.getOptions()], function(result) {
        console.log("user is " ,  result);
        $scope.options = result[0].data.user;

        self.users = result[0].data.user;
        $scope.selectedOption = 0;
    });
    
    
    $scope.$on('appInitialized', function () {
        console.log("appInitialized - selection: " + $scope.selectedOption);
        $scope.logentries.push(($scope.logentries.length + 1) + " - appInitialized - selection: " + $scope.selectedOption);
    });
   } 
   
  self.post = function(UsersRepository,UsersList)
  {       
    console.log("in user.post BEGAIN. UserRepository= " + PassengerRepository + ", usersList= " + UsersList);
     
      PassengerRepository.post(self.UsersList).then(
        function(result)
        {
          if(result != null && result != "undefined")
          {
            if(result.status == true)
            {
              console.log("in users.post. in success handler scope. result is true");
            }
          }

         
        },
        function(result)
        {
          if(result != null && result != "undefined")
          {
            console.log("in users.post. in error handler scope");
          }
         
    
        }
      )
      .catch(function(result)
      {User
        console.log("in user.post. in catch handler scope");
      
      
      });
  }
  
    self.signClicked = function()
    {
       UsersRepository.post([self.Users]);
       $timeout(function(){ $route.reload(); }, 2000);
    }
   
    initController();
  
});

angular.module('app.Repositories').factory('UsersRepository', function($http) {
    return {
        post: function(passengerList) {
            $http.post('http://localhost:3000/UsersRequest',  passengerList).then(  
              function(response)  
              { 
                  console.log('in UsersRepository.post. got response=', response.data);

                  for (i= 0; i< usersList.length; i++) 
                  {
                    usersList[i].is_in_db = true;
                     
                  }
          
              },
          
              function(response)
              {
                console.log('in UsersRepository.post. got response=', response.data);
                for (i= 0; i< pusersList.length; i++) 
                {
                  usersList[i].is_in_db = false;
                }
                alert ('Error');
              }               
            );
        }
    };

}); 