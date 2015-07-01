'use strict'

angular.module('accessController')
.controller
( 'MembersCtrl'
, function
  ( $scope
  , Members
  , NewMembersModal
  )
  {
    $scope.members = Members.get()

    $scope.newMembersModal = function(){
      NewMembersModal.open()
    }
  }
)
