var http = require('http');
var express = require("express");
var RED = require("node-red");
var path = require("path");

var configDir = path.join(__dirname, ".nodered");

// Create an Express app
var app = express();

// Add a simple route for static content served from 'public'
app.use("/",express.static("public"));

// Create a server
var server = http.createServer(app);

// Create the settings object - see default settings.js file for other options
var settings = {
    mqttReconnectTime: 15000,
    serialReconnectTime: 15000,
    socketReconnectTime: 10000,
    socketTimeout: 120000,
    httpRequestTimeout: 120000,
    debugMaxLength: 1000,
    flowFile: process.env.FLOWS || 'flows.json',
    flowFilePretty: true,
    // credentialSecret: "a-secret-key",
    userDir: process.env.USERDIR || configDir,
    // nodesDir: '/home/nol/.node-red/nodes',

    httpAdminRoot: '/admin',
    httpNodeRoot: '/',
    // httpRoot: '/red',
    // httpStatic: '/home/nol/node-red-static/',
    apiMaxLength: '5mb',
    ui: { path: "/" },
    //httpNodeMiddleware: function(req,res,next) {
      // Handle/reject the request, or pass it on to the http in node by calling next();
      // Optionally skip our rawBodyParser by setting this to true;
      //req.skipRawBodyParser = true;
      // next();
    // },
    functionGlobalContext: { },    // enables global context
    //paletteCategories: ['subflows', 'input', 'output', 'function', 'social', 'mobile', 'storage', 'analysis', 'advanced'],
    logging: {
      console: {
        level: "info",
        metrics: false,
        audit: true
      }
    }
};

// Initialise the runtime with a server and settings
RED.init(server,settings);

// Serve the editor UI from /red
app.use(settings.httpAdminRoot,RED.httpAdmin);

// Serve the http nodes UI from /api
app.use(settings.httpNodeRoot,RED.httpNode);

server.listen(8000);

// Start the runtime
RED.start();
