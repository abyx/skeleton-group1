myModule.service('myDriverService', function($http) {
    
    this.getOptions = function() {
        return $http({
            "method": "post",
            "url": 'http://localhost:3000/getDriver', 
            "data": {
                options: []
            }
        });
    };
});

angular.module('app').controller('getDriver', function($scope, myDriverService, initDriver, DriverRepository, $route, $timeout) {
    var self = this;
   
   	console.log("in driver. controller  BEGAIN.");
    function initController() {
          $scope.selectedOption = null;
          $scope.options = [];
          $scope.logentries = [];
        initDriver('getDriver', [myDriverService.getOptions()], function(result) {
        console.log("driver is " ,  result);
        $scope.options = result[0].data.driver;

        self.driver = result[0].data.driver;
        $scope.selectedOption = 0;
    });
    
    
    $scope.$on('appInitialized', function () {
        console.log("appInitialized - selection: " + $scope.selectedOption);
        $scope.logentries.push(($scope.logentries.length + 1) + " - appInitialized - selection: " + $scope.selectedOption);
    });
   } 
   
  self.post = function(DriverRepository, driverList)
	{				
		console.log("in driver.post BEGAIN. DriverRepository= " + DriverRepository + ", driverList= " + driverList);
		 
		  DriverRepository.post(self.driverList).then(
				function(result)
				{
					if(result != null && result != "undefined")
					{
						if(result.status == true)
						{
							console.log("in driver.post. in success handler scope. result is true");
						}
					}
				},
				function(result)
				{
					if(result != null && result != "undefined")
					{
						console.log("in driver.post. in error handler scope");
					}
				}
			)
			.catch(function(result)
			{
				console.log("in driver.post. in catch handler scope");
			});
	}
	
	  self.buttonClicked = function()
		{
			 DriverRepository.post([self.driver]);
		   $timeout(function(){ $route.reload(); }, 2000);
		}
   
    initController();
	
});

angular.module('app.Repositories').factory('DriverRepository', function($http) {
	  return {
        post: function(driverList) {
            $http.post('http://localhost:3000/DriverRequest',	driverList).then(	
   						function(response)	
   						{	
   							  console.log('in DriverRepository.post. got response=',	response.data);

					        for (i= 0; i< driverList.length; i++) 
					        {
					          driverList[i].is_in_db = true;
					           
					        }
					
							},
					
					   	function(response)
		   				{
		  					console.log('in DriverRepository.post. got response=',	response.data);
		            for (i= 0; i< driverList.length; i++) 
		            {
		              driverList[i].is_in_db = false;
		            }
		 						alert ('Error');
		   				}   						
						);
        }
    };

}); 

myModule.factory('initDriver', function ($q, $rootScope, $browser) {
 
  var initFunctions = [
    'getDriver'
  ];
  var registeredInitFunctions = {};
  var initialized = false;
 
  var initApplication = function () {
    var getDriver = registeredInitFunctions['getDriver'];
 
    var broadcastAppInitialized = function () {
      $browser.defer(function () {
        initialized = true;
        $rootScope.$apply(function () {
          $rootScope.$broadcast('appInitialized');
        });
      });
    };
    getDriver.initDriver()
      .then(broadcastAppInitialized);
  };
 
  $rootScope.$on('$routeChangeStart', function () {
    registeredInitFunctions = {};
    initialized = false;
  });
 
  var initAppWhenReady = function () {
      initApplication();
    
  };
 
  var initDriver = function (name, dependencies, initCallback) {
    registeredInitFunctions[name] = {
      initDriver: function () {
        var internalDependencies = $q.all(dependencies);
        return internalDependencies.then(initCallback);
      }};
    initAppWhenReady();
  };
 
    initDriver.watchAfterInit = function (scope, expression, listener, deepEqual) {
      scope.$watch(expression, function (newValue, oldValue, listenerScope) {
        if (initialized) {
          listener(newValue, oldValue, listenerScope);
        }
      }, deepEqual);
    };

    initDriver.onAfterInit = function (scope, event, listener) {
      scope.$on(event, function (event) {
        if (initialized) {
          listener(event);
        }
      });
    };
 
  return  initDriver;
});