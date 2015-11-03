
var myModule = angular.module('app', ['ngRoute']);

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
    .when('/view2', {
      templateUrl: 'view2.html',
      controller: 'View2Ctrl',
      controllerAs: 'view2'
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

myModule.controller('getPassenger', function($scope, myService, init) {
    
    function initController() {
          $scope.selectedOption = null;
          $scope.options = [];
          $scope.logentries = [];
        init('getPassenger', [myService.getOptions()], function(result) {
        console.log("passenger is " ,  result);
        $scope.options = result[0].data.passenger;
        $scope.selectedOption = 0;
    });
    init.watchAfterInit($scope, 'selectedOption', function(newValue, oldValue) {
        // handle selection change ...
        console.log("selection: " + $scope.selectedOption);
        $scope.logentries.push(($scope.logentries.length + 1) + " - selection: " + $scope.selectedOption);
    });
    
    $scope.$on('appInitialized', function () {
        console.log("appInitialized - selection: " + $scope.selectedOption);
        $scope.logentries.push(($scope.logentries.length + 1) + " - appInitialized - selection: " + $scope.selectedOption);
    });
   }

    initController();


    });
