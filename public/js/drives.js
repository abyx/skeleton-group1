myModule.service('myDrivesService', function($http) {
   
 

    this.getOptions = function(nameParam,sourceParam,destinationParam,dateParam,timeParam) {
        return $http({
            "method": "post",
            "url": 'http://localhost:3000/getDrives', 
            "data": 
                {name: nameParam,
                  source:sourceParam ,destination:destinationParam, 
                  date:dateParam , time:timeParam}
            });
    
      };

    });

angular.module('app').controller('getDrives', function($scope, myDrivesService, initDrives, DrivesRepository) {
    var self = this;
   
   	console.log("in Drives. controller  BEGAIN.");
    function initController() {
          $scope.selectedOption = null;
          $scope.options = [];
          $scope.logentries = [];
        initDrives('getDrives', [myDrivesService.getOptions(' ',' ',' ' ,' ',' ')], function(result) {
        console.log("Drives is " ,  result);
        $scope.options = result[0].data.Drives;

        self.Drive = { name : "", source :"" , destination : "", date:"", time:""};
        self.Drives = result[0].data.Drives;
 console.log("in init controller" , self.Drives);
        $scope.selectedOption = 0;
    });
    
    
    $scope.$on('appInitialized', function () {
        console.log("appInitialized - selection: " + $scope.selectedOption);
        $scope.logentries.push(($scope.logentries.length + 1) + " - appInitialized - selection: " + $scope.selectedOption);
    });
   } 
   
  self.post = function(DrivesRepository, DrivesList)
	{				
		console.log("in Drives.post BEGAIN. DrivesRepository= " + DrivesRepository + ", DrivesList= " + DrivesList);
		 
		  DrivesRepository.post(self.DrivesList).then(
				function(result)
				{
					if(result != null && result != "undefined")
					{
						if(result.status == true)
						{
							console.log("in Drives.post. in success handler scope. result is true");
						}
					}
				},
				function(result)
				{
					if(result != null && result != "undefined")
					{
						console.log("in Drives.post. in error handler scope");
					}
				}
			)
			.catch(function(result)
			{
				console.log("in Drives.post. in catch handler scope");
			});
	}

  self.get = function(DrivesRepository, nameParam,sourceParam,destinationParam,dateParam,timeParam,Drives)
  {       
    console.log("in Drives.get BEGAIN. DrivesRepository= " + DrivesRepository );
     
      DrivesRepository.get(self.Drive.name,
        self.Drive.source,
        self.Drive.destination,
        self.Drive.date,
        self.Drive.time,self.Drives).then(
        function(result)
        {
          if(result != null && result != "undefined")
          {
            if(result.status == true)
            {
              console.log("in Drives.get. in success handler scope. result is true");
            }
          }
        },
        function(result)
        {
          if(result != null && result != "undefined")
          {
            console.log("in Drives.get. in error handler scope");
          }
        }
      )
      .catch(function(result)
      {
        console.log("in Drives.get. in catch handler scope");
      });
  }
	
	  self.buttonClicked = function()
		{

      console.log(" buttonClicked ");
			 DrivesRepository.get(self.Drive.name,
        self.Drive.source,
        self.Drive.destination,
        self.Drive.date,
        self.Drive.time,self.Drives);
		}
   
    initController();
	
});

angular.module('app.Repositories').factory('DrivesRepository', function($http) {
	  return {
        post: function(DrivesList) {
            $http.post('http://localhost:3000/DrivesRequest',	DrivesList).then(	
   						function(response)	
   						{	
   							  console.log('in DrivesRepository.post. got response=',	response.data);

					        for (i= 0; i< DrivesList.length; i++) 
					        {
					          DrivesList[i].is_in_db = true;
					           
					        }
					
							},
					
					   	function(response)
		   				{
		  					console.log('in DrivesRepository.post. got response=',	response.data);
		            for (i= 0; i< DrivesList.length; i++) 
		            {
		              DrivesList[i].is_in_db = false;
		            }
		 						alert ('Error');
		   				}   						
						);
        },
        get: function(nameParam,sourceParam,destinationParam,dateParam,timeParam,Drives) {
            $http.post('http://localhost:3000/getDrives',   {name: nameParam,
                  source:sourceParam ,destination:destinationParam, 
                  date:dateParam , time:timeParam}).then(  
              function(response)  
              { 
                
                  console.log('in DrivesRepository.get. got response=', response.data);
                if (response.data.Drives != null && response.data.Drives != "undefined") {
                
                while(Drives.length > 0) {
                     Drives.pop();
                }
                   
                  for (i= 0; i< response.data.Drives.length; i++) 
                  {
                      console.log('in DrivesRepository.get. updating...', response.data);
                   response.data.Drives[i].is_selected = false;
                    Drives.push(response.data.Drives[i]);
                     
                  }  

                }
             
          
              },
          
              function(response)
              {
                console.log('in DrivesRepository.get. got response=', response.data);
                if (response.data.Drives != null && response.data.Drives != "undefined") {
                    while(self.Drives.length > 0) {
                     self.Drives.pop();
                }
                for (i= 0; i< response.data.Drives.length; i++) 
                {
                  response.data.Drives[i].is_selected = false;
                   self.Drives.push(response.data.Drives[i]);
                }
                }
                alert ('Error');

              }               
            );
        }
    };

}); 

myModule.factory('initDrives', function ($q, $rootScope, $browser) {
 
  var initFunctions = [
    'getDrives'
  ];
  var registeredInitFunctions = {};
  var initialized = false;
 
  var initApplication = function () {
    var getDrives = registeredInitFunctions['getDrives'];
 
    var broadcastAppInitialized = function () {
      $browser.defer(function () {
        initialized = true;
        $rootScope.$apply(function () {
          $rootScope.$broadcast('appInitialized');
        });
      });
    };
    getDrives.initDrives()
      .then(broadcastAppInitialized);
  };
 
  $rootScope.$on('$routeChangeStart', function () {
    registeredInitFunctions = {};
    initialized = false;
  });
 
  var initAppWhenReady = function () {
      initApplication();
    
  };
 
  var initDrives = function (name, dependencies, initCallback) {
    registeredInitFunctions[name] = {
      initDrives: function () {
        var internalDependencies = $q.all(dependencies);
        return internalDependencies.then(initCallback);
      }};
    initAppWhenReady();
  };
 
    initDrives.watchAfterInit = function (scope, expression, listener, deepEqual) {
      scope.$watch(expression, function (newValue, oldValue, listenerScope) {
        if (initialized) {
          listener(newValue, oldValue, listenerScope);
        }
      }, deepEqual);
    };

    initDrives.onAfterInit = function (scope, event, listener) {
      scope.$on(event, function (event) {
        if (initialized) {
          listener(event);
        }
      });
    };
 
  return  initDrives;
});

