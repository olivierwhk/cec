// copier ici la clé de la feuille google

var key = "pleindecaracteresdansledesordre";

// 
// Here is how to define your module 
// has dependent on mobile-angular-ui
// 


var app = angular.module('MobileAngularUiExamples', [
  'ngRoute',
  'mobile-angular-ui',
  // touch/drag feature: this is from 'mobile-angular-ui.gestures.js'
  // it is at a very beginning stage, so please be careful if you like to use
  // in production. This is intended to provide a flexible, integrated and and 
  // easy to use alternative to other 3rd party libs like hammer.js, with the
  // final pourpose to integrate gestures into default ui interactions like 
  // opening sidebars, turning switches on/off ..
  //'mobile-angular-ui.gestures'
]);

/*
app.run(function($transform) {
  window.$transform = $transform;
});
*/
// 
// You can configure ngRoute as always, but to take advantage of SharedState location
// feature (i.e. close sidebar on backbutton) you should setup 'reloadOnSearch: false' 
// in order to avoid unwanted routing.
// 
app.config(function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'home.html',
    reloadOnSearch: false
  });
  $routeProvider.when('/planning', {
    templateUrl: 'planning.html',
    reloadOnSearch: false
  });
  $routeProvider.when('/video', {
    templateUrl: 'video.html',
    reloadOnSearch: false
  });
  $routeProvider.when('/runs', {
    templateUrl: 'runs.html',
    reloadOnSearch: false
  });
  $routeProvider.when('/runs2', {
    templateUrl: 'runs2.html',
    reloadOnSearch: false
  });
});

app.controller('MainController', function($rootScope, $http, $scope, $interval) {

  // sauvegarde valeurs entre formulaires

  $scope.changep = function() {
    $rootScope.grpsearch = this.rpsearch.content.$t
  };

  $scope.reset = function() {
    // Example with 2 arguments
    angular.copy($scope.master, this.rpsearch);
    $rootScope.grpsearch = "";
  };

  $scope.reset();

  // extraction data google sheets 
  function getdata() {   
    $http.get("https://spreadsheets.google.com/feeds/list/" + key + "/oyj9sy0/public/values?alt=json") //equipe3col
      .success(function(response) {
        $rootScope.rplanning = response.feed.entry;
        //      console.log(response);
      });

    $http.get("https://spreadsheets.google.com/feeds/list/" + key + "/os5usu2/public/values?alt=json") //pisteweb
      .success(function(response) {
        $rootScope.rpisteweb = response.feed.entry;
        //      console.log(response);
      });

    $http.get("https://spreadsheets.google.com/feeds/list/" + key + "/ozh2u7q/public/values?alt=json") //ko
      .success(function(response) {
        $rootScope.rkoweb = response.feed.entry;
        //      console.log(response.feed.entry);
      });
  }

  // mise à jour régulière 
  var refreshtimer = 4 * 60 * 1000;

  getdata(); //chargement initial

  $interval(function() { //rechargement données
    getdata();
  }, refreshtimer);

  // User agent displayed in home page
  $scope.userAgent = navigator.userAgent;

  //$scope.viewportw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  //$scope.viewporth = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)

  // Needed for the loading screen
  $rootScope.$on('$routeChangeStart', function() {
    $rootScope.loading = true;
  });

  $rootScope.$on('$routeChangeSuccess', function() {
    $rootScope.loading = false;
  });

});

app.filter('highlight', function($sce) { // filtre avec recherche
  return function(text, phrase) {

    if (phrase) {
      if (phrase.length > 2) {
        text = text.replace(new RegExp('(' + phrase + ')', 'gi'), '<span class="highlighted">$1</span>');
      }
    }
    return $sce.trustAsHtml(text);
  }
});
