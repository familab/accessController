'use strict'

angular.module('accessController')
.factory('MemberCards', MemberCardsFactory)

function MemberCardsFactory($resource) {
  return $resource
    ( '/api/v1/members/:memberId/cards'
    , { memberId: '@memberId'
      , id: '@id'
      }
    , { get:
        { method: 'GET'
        , isArray: true
        }
      , byId:
        { method: 'GET'
        , url: '/api/v1/members/:memberId/cards/:id'
        }
      , update:
        { method: 'PUT'
        , url: '/api/v1/members/:memberId/cards/:id'
        }
      , delete:
        { method: 'DELETE'
        , url: '/api/v1/members/:memberId/cards/:id'
        }
      }
    )
}

MemberCardsFactory.$inject = ["$resource"]
