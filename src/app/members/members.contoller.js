'use strict'

angular.module('accessController')
.controller
( 'MembersCtrl'
, function
  ( $scope
  , Members
  )
  {
    $scope.members = Members.get()
  }
)
