#!/usr/local/bin/node

/* jshint node: true, esversion: 6 */

var express = require('express');
var server = express();

var router = require('./router');

const PORT = 8080;

//set API Routes and start server...
(function main() {
    var routeTable = {
        GET: function(route) {
            server.get(route.uri, route.action);
        },
        POST: function(route) {
            server.post(route.uri, route.action);
        }
    };

    router.establishRoutes(function(route) {
        var f = routeTable[route.verb];
        if (f) f(route);
        else console.log('unknown verb %j', route);
    });

    server.listen(PORT, function() {
        console.log('listening on %d', PORT);
    });
})();


