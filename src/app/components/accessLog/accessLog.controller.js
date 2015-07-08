'use strict'

angular.module('accessController')
.controller
( 'accessLoggerDirectiveCtrl'
, accessLoggerDirectiveCtrl
)

function accessLoggerDirectiveCtrl
( accessLogger
, $scope
)
{
  $scope.logs = accessLogger.get()
}

accessLoggerDirectiveCtrl.$inject =
[ "accessLogger"
, "$scope"
]
