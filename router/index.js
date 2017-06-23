/* jshint node: true, esversion: 6 */

var entryController = require('../controllers/entry');

var routes = [
    {
        verb: "GET",
        uri: "/hn-entries",
        action: function(req, res) {
            res.setHeader('Content-Type', 'application/json');
            entryController.getAll(function(error, entries) {
                if (error) {
                    return res.status(500).send(error);
                }

                res.send(entries);
            });
        }
    },
    {
        verb: "GET",
        uri: "/hn-entries/filter-by/:filter/:comparer/:param/order-by/:field/:order",
        action: function(req, res) {
            res.setHeader('Content-Type', 'application/json');
            entryController.getAll(function(error, entries) {
                if (error) {
                    return res.status(500).send(error);
                }
                try {
                    var filter = req.params.filter.toUpperCase();
                    var comparer = req.params.comparer.toUpperCase();
                    var param = req.params.param;
                    var field = req.params.field.toLowerCase();

                    var desc = req.params.order.toUpperCase() === "DESC";
                    var result = new entryController.ListBuilder(entries)
                        .filterBy(filter, comparer, param)
                        .orderBy(field, desc)
                        .getEntries();

                    res.send(result);
                }
                catch(err) {
                    res.status(500).send(err);
                }
            });
        }
    },
];

exports.establishRoutes = function(routeCallback) {
    routes.forEach(function(route) {
        routeCallback(route);
    });
};
