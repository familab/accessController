'use strict'

var System = requrie("es6-module-loader").System

System.import('./index').then(function(idx){
  idx.main(__dirname)
}).catch(function(err){
  console.error('Error: ', err)
})
