#!/usr/local/bin/node

/* jshint node: true, esversion: 6 */

var express = require('express');
var server = express();

var router = require('./router');

const PORT = 8080;

//set API Routes and start server...
(function main() {
    router.establishRoutes(function(route) {
        switch(route.verb) {
        case 'GET': 
            server.get(route.uri, route.action);
            break;
        case 'POST':
            server.post(route.uri, route.action);
            break;
        default:
            console.log('unknown verb %j', route);
            break;
        }
    });

    server.listen(PORT, function() {
        console.log('listening on %d', PORT);
    });
})();


