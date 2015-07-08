'use strict';

angular
  .module
  ( 'accessController'
  , [ 'ngAnimate'
    , 'ngCookies'
    , 'ngTouch'
    , 'ngSanitize'
    , 'ngResource'
    , 'ui.router'
    , 'ui.bootstrap'
    , 'xeditable'
    ]
  )
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      })
      .state('members', {
        url: '^/members',
        templateUrl: 'app/members/members.html',
        controller: 'MembersCtrl'
      })
      .state('members.add', {
        url: '^/members/add',
        onEnter: function($stateParams, $state, MembersModal) {
          MembersModal
            .open()
            .result
            .finally(function(){
              $state.go('^')
            })
        }
      })
      .state('members.edit', {
        url: '^/members/:id/edit',
        onEnter: function($stateParams, $state, MembersModal) {
          MembersModal
            .open($stateParams.id)
            .result
            .finally(function(){
              $state.go('^')
            })
        }
      })

    $urlRouterProvider.otherwise('/');
  })
  .run(function(editableOptions){
    editableOptions.theme = 'bs3'
  })
;
