'use strict'
import {config} from './libs/config'
import {v1} from './routes'

export function main(appDir) {
  let koa = require('koa'),
      app = koa(),
      bodyParser = require('koa-body-parser')

  // X-Response-Time
  app.use(function *(next){
    let start = new Date;
    yield next;
    let ms = new Date - start;
    this.set('X-Response-Time', ms + 'ms')
    this.app.appDir = appDir
  })

  // Logger
  app.use(function *(next){
    let start = new Date
    yield next;
    let ms = new Date - start
    console.log('%s %s - %s - %s ms', this.method, this.url, this.status, ms)
  })

  // Body
  app.use(bodyParser())


  // Error Handling
  app.use(function *(next){
    try {
      yield next;
    } catch(e) {
      console.log('Error Caught')
      this.status = e.status || 500
      this.body = {error: true, msg: e.toString() }
      this.app.emit('error', e, this)
    }
  })

  // Pass router to app
  app.use(v1().routes())

  // Server Listener
  app.listen(config.app.port, config.app.host, function(e) {
    console.log('Listening on http://%s:%s', config.app.host, config.app.port)
  })
}
