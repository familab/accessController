'use strict'

angular.module('accessController')
.controller
( 'newMembersModalCtrl'
, function
  ( $modalInstance
  , $scope
  , Members
  )
  {
    function init(){
      $scope.member = {}
      $scope.member.cards = []
    }

    $scope.clearCard = function(){
      $scope.card = {}
      $scope.addCardState = false;
    }

    $scope.addCard = function(card) {
      $scope.member.cards.push(card)
      $scope.card = {}
      $scope.addCardState = false;
    }

    $scope.removeCard = function(idx){
      $scope.member.cards.splice(idx) 
    }

    $scope.dismiss = function(){
      $modalInstance.dismiss()
    }
    
    $scope.close = $modalInstance.close()
    init()
  }
)
