'use strict'

angular.module('accessController')
.directive
( 'accessLogger'
, accessLoggerDirective
)

function accessLoggerDirective
(
)
{
  var d =
  { restrict: 'E'
  , controller: 'accessLoggerDirectiveCtrl'
  , templateUrl: '/app/components/accessLog/accessLog.html'
  }

  return d
}

accessLoggerDirective.$inject =
[
]
