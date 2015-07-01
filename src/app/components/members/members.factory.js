'use strict'

angular.module('accessController')
.factory
( 'Members'
, function
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
        }
      )
  }
)
