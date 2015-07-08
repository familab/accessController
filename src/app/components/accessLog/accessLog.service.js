'use strict'

angular.module('accessController')
.factory
( 'accessLogger'
, accessLogger
)

function accessLogger
( $resource
)
{
  return $resource
    ( '/api/v1/logs'
    , {
      }
    , { get:
        { isArray: true
        }
      }
    )
}

accessLogger.$inject =
[ "$resource"
]
