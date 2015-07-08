'use strict'

angular.module('accessController')
.controller
( 'MembersCtrl'
, MembersCtrl
)
function MembersCtrl
( $scope
, Members
, MembersModal
, members
, $rootScope
)
{
  $scope.members = members

  $rootScope.$on('RePollMembers', function(){
    $scope.members = Members.get()
  })

  $scope.remove = function(member, idx) {
    member
      .$delete()
      .then(function(res){
        console.log('res', res)
        $scope.members.splice(idx, 1)
      })
  }

  $scope.newMembersModal = function(){
    MembersModal.open()
  }
}

MembersCtrl.$inject =
[ "$scope"
, "Members"
, "MembersModal"
, "members"
, "$rootScope"
]
