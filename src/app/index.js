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
        controller: 'MembersCtrl',
        resolve: {
          members: function(Members) {
            return Members.get()
          }
        }
      })
      .state('members.add', {
        url: '^/members/add',
        onEnter: function($stateParams, $state, MembersModal, $rootScope) {
          MembersModal
            .open()
            .result
            .finally(function(){
              $rootScope.$emit('RePollMembers')
              $state.go('^')
            })
        }
      })
      .state('members.edit', {
        url: '^/members/:id/edit',
        onEnter: function($stateParams, $state, MembersModal, $rootScope) {
          MembersModal
            .open($stateParams.id)
            .result
            .finally(function(){
              $rootScope.$emit('RePollMembers')
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
