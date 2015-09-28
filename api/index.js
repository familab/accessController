/* jscs: disable requireCapitalizedComments */
/* jshint -W071 */
'use strict';

// Config
var pjson = require('./package.json');
var swaggerConfig = require('./config/swagger.json');
var config = require('./config/app.json');

// Module dependencies.
var http = require('http');
var path = require('path');
var koa = require('koa');
var mount = require('koa-mount');
var koaStatic = require('koa-static');
var swaggerJSDoc = require('swagger-jsdoc');
var logger = require('koa-logger');
var responseTime = require('koa-response-time');
var ratelimit = require('koa-better-ratelimit');
var compress = require('koa-compress');
var bodyParser = require('koa-body');
var helmet = require('koa-helmet');
var conditional = require('koa-conditional-get');
var etag = require('koa-etag');
var errorHandler = require('./lib/errorHandler');
var load = require('./lib/load');
var logic = require('./lib/logic');

// Variables
var swaggerUiPath = path.join(require.resolve('swagger-ui'), '..');

// Environment.
var env = process.env.NODE_ENV || 'development';

// ENV Overrides
config.host = process.env.HOST || config.host;
config.port = process.env.PORT || config.port;

var application = function(opts) {
  opts = opts || {};
  var app = koa();

  // Setup Logging
  if ('test' !== env) {
    app.use(logger());
  }

  // Setup x-response-time
  app.use(responseTime());

  // Setup Security Headers
  app.use(helmet.xssFilter());
  app.use(helmet.frameguard('deny'));
  app.use(helmet.hidePoweredBy());
  app.use(helmet.ieNoOpen());
  app.use(helmet.noSniff());
  app.use(helmet.hsts());
  app.use(helmet.contentSecurityPolicy({
    defaultSrc: ['\'self\''],
    reportUri: '/report-csp-violation',
  }));

  // Setup etag
  app.use(conditional());
  app.use(etag());

  // Setup Rate Limiting
  app.use(ratelimit({
    max: opts.ratelimit,
    duration: opts.duration,
  }));

  // Swagger UI and endpoints
  swaggerConfig.info.version = pjson.version;
  var options = {
    swaggerDefinition: swaggerConfig,
    apis: [
      './routes/members/index.js',
      './routes/cards/index.js',
      './routes/logs/index.js',
    ],
  };

  var swaggerSpec = swaggerJSDoc(options);
  app.use(function* (next) {
    if (this.request.path === '/swagger') {
      this.redirect('/swagger/?url=/swagger.json');
    } else {
      yield next;
    }
  });
  app.use(mount('/swagger', koaStatic(swaggerUiPath)));
  app.use(mount('/swagger.json', function* () {
    this.type = 'application/json';
    this.body = swaggerSpec;
  }));

  // Setup Parsers
  app.use(bodyParser());

  // Setup Compression
  app.use(compress());

  // Error Handling
  errorHandler(app);

  // Bootstrap API
  load(app, '/api', __dirname + '/routes');

  var server = http.createServer(app.callback());
  server.listen(config.port, config.host, config.backlog);
  logic.start(server);

  return app;
};

// Expose `application()`.
module.exports = application;

if (!module.parent) { application(); }
