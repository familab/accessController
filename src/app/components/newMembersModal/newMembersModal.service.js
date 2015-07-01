'use strict'

angular.module('accessController')
.service
( 'NewMembersModal'
, function
  ( $modal
  )
  {
    var service = {}

    service.open = function(){
      $modal
        .open
        ( { templateUrl: '/app/components/newMembersModal/newMembersModal.html'
          , controller: 'newMembersModalCtrl'
          , backdrop: 'static'
          , windowClass: 'newMembersModal'
          }
        )
    }

    return service
  }
)
