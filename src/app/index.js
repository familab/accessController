'use strict';

angular.module('accessController', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngResource', 'ui.router', 'ui.bootstrap'])
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
        onEnter: function($stateParams, $state, NewMembersModal) {
          NewMembersModal
            .open()
            .result
            .finally(function(){
              $state.go('^')
            })
        }
      })

    $urlRouterProvider.otherwise('/');
  })
;
