 /*jshint unused:false */

/***************

  This file allow to configure a proxy system plugged into BrowserSync
  in order to redirect backend requests while still serving and watching
  files from the web project

  IMPORTANT: The proxy is disabled by default.

  If you want to enable it, watch at the configuration options and finally
  change the `module.exports` at the end of the file

***************/

'use strict';

var httpProxy = require('http-proxy-middleware');
var chalk = require('chalk');

/*
 * Location of your backend server
 */
var proxyTarget = 'http://localhost:8888/';
var proxyContext = '/api'

var proxy = httpProxy(proxyContext, {
  target: proxyTarget
})

/*
 * This is where you activate or not your proxy.
 *
 * The first line activate if and the second one ignored it
 */

module.exports = [proxy];
