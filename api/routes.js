'use strict'

export function v1(){
  let r = require('koa-router')()

  r.prefix('/api/v1')
  r.get('/', function *(next){
    this.body =
      { active: true
      , timestamp: new Date().getTime()
      }
  })

  return r
}
