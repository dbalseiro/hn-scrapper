/* jshint node: true, esversion: 6 */

var request = require('request');
var cheerio = require('cheerio');

const MAX_ITEMS = 30;
const URL = 'https://news.ycombinator.com/';

var getAll = function(callback) {
    /*
     * You'll have to create a web crawler using scraping techniques to extract
     * the first 30 entries from https://news.ycombinator.com/ You'll only care
     * about the title, number of the order, the amount of comments and points
     * for each entry.
     */
    request(URL, function(error, response, html) {
        var result = [];

        /*
         <table class="itemlist" cellspacing="0" cellpadding="0" border="0">
         <tbody><tr class="athing" id="14612680">
         ......
         */
        if(!error) {
            var $ = cheerio.load(html);
            var items = $('table.itemlist > tbody > tr.athing');

            if (!items || items.length === 0) return callback({errmsg: "invalid items"});

            items.each(function() {
                var title = $(this).find('td.title > a.storylink').text();

                var order = $(this).find('td.title > span.rank')
                    .text()
                    .replace('.','');
                order = parseInt(order);

                //the other data are in the next TR
                var secondLine = $(this).next();

                var comments = secondLine.find('td.subtext > a:last-child')
                    .text()
                    .replace(/.comments?/, '');
                comments = parseInt(comments);
                if (isNaN(comments)) comments = 0;

                var points = secondLine.find('td.subtext > span.score')
                    .text()
                    .replace(/.points?/, '');
                points = parseInt(points);
                if (isNaN(points)) points = 0;

                result.push({
                        title: title,
                        order: order,
                        comments: comments,
                        points: points
                });

                if (result.length == MAX_ITEMS) return;
            });
        }
        else {
            error.errmsg = "invalid request";
        }

        callback(error, result);
    });
};
exports.getAll = getAll;

/*
 * From there, we want it to be able to perform a couple of filtering operations:
 *
 *   Filter all previous entries with more than five words in the title ordered 
 *   by amount of comments first.
 *
 *   Filter all previous entries with less than or equal to five words in the 
 *   title ordered by points.
*/

exports.ListBuilder = function(entries) {
    var self = this;
    var _entries = entries;

    var comparers = {
        GTE: function(a, b) { return a >= b; },
        GT: function(a, b) { return a > b; },
        LTE: function(a, b) { return a <= b; },
        LT: function(a, b) { return a < b; },
    };

    var filters = {
        NUMBEROFWORDS: function(entry, comparer, param) {
            var words = entry.title.split(/ +/);
            return comparer(words.length, param);
        }
    };

    self.getEntries = function() {
        return _entries;
    };

    self.filterBy = function(filter, comparer, param) {
        //get the comparer
        var comparerFunction = comparers[comparer];
        if (!comparerFunction) throw {errmsg: "Comparer " + comparer + " does not exist"};

        //get the filter
        var filterFunction = filters[filter];
        if (!filterFunction) throw {errmsg: "Filter " + filter + " does not exist"};

        _entries = _entries.reduce(function(cur, val) {
            if (filterFunction(val, comparerFunction, param)) {
                cur.push(val);
            }
            return cur;
        }, []);
        return self;
    };

    self.orderBy = function(field, desc) {
        _entries.sort(function(a, b) {
            if (!a[field] && a[field] !== 0) 
                throw {errmsg: "Field " + field + " does not exist"};

            if (a[field] > b[field]) return 1;
            if (a[field] < b[field]) return -1;
            return 0;
        });

        if (desc) _entries.reverse();

        return self;
    };
};

