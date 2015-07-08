'use strict'

angular.module('accessController')
.controller
( 'MembersModalCtrl'
, MembersModalCtrl
)
function MembersModalCtrl
( $modalInstance
, $scope
, Members
, MemberCards
, editMember
)
{
  $scope.member = editMember
  $scope.editMember = editMember
  function init(){
    if(!editMember) {
      $scope.member = {}
      $scope.member.cards = []
    } else {
      $scope.member = editMember
    }
  }

  $scope.clearCard = function(card, idx){
    if(card && idx) {
      card.$delete.then(function(){
        $scope.member.cards.splice(idx, 1)
      })
    }
    $scope.card = {}
    $scope.addCardState = false;
  }

  $scope.addCard = function(card) {
    $scope.member.cards.push(card)
    $scope.card = {}
    $scope.addCardState = false;
  }

  $scope.dismiss = function(){
    $modalInstance.dismiss()
  }

  $scope.save = function(){
    var member = new Members($scope.member)
    if(editMember) {
      Members
        .update
        ( { id: $scope.member.id
          }
        , $scope.member
        )
    } else {
      member.$save()
    }
    $modalInstance.dismiss()
  }

  $scope.close = $modalInstance.close()

  $scope.$watch('member', function(){
    if($scope.member.$resolved && !$scope.member.cards && editMember)
      $scope.member.cards = MemberCards
        .get
        ( { memberId: editMember.id
          }
        )
  }, true)
  if(!editMember)
    init()
}

MembersModalCtrl.$inject =
[ "$modalInstance"
, "$scope"
, "Members"
, "MemberCards"
, "editMember"
]
