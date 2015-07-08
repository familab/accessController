'use strict'

angular.module('accessController')
.service
( 'MembersModal'
, MembersModalService
)

function MembersModalService
( $modal
, Members
)
{
  var service = {}

  service.open = function(memberId){
    return $modal
      .open
      ( { templateUrl: '/app/components/membersModal/membersModal.html'
        , controller: 'MembersModalCtrl'
        , backdrop: 'static'
        , windowClass: 'membersModal'
        , resolve:
          { editMember: function() {
              if(!memberId)
                return null

              return Members.byId({id: memberId})
            }
          }
        }
      )
  }

  return service
}
