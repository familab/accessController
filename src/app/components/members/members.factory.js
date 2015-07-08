'use strict'

angular.module('accessController')
.factory
( 'Members'
, MembersFactory
)
function MembersFactory
( $resource
)
{
  return $resource
    ( '/api/v1/members'
    , { id: '@id'
      }
    , { get:
        { method: 'GET'
        , isArray: true
        }
      , byId:
        { method: 'GET'
        , url: '/api/v1/members/:id'
        }
      , update:
        { method: 'PUT'
        , url: '/api/v1/members/:id'
        }
      , delete:
        { method: 'DELETE'
        , url: '/api/v1/members/:id'
        }
      }
    )
}

MembersFactory.$inject = ["$resource"]
