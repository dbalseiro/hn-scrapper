var assert = require('assert');
var entryController = require('../controllers/entry');

describe('Entry', function() {
    var entries;
    var error;

    this.timeout(1000);

    before(function(done) {
        entryController.getAll(function(_error, _entries) {
            entries = _entries;
            error = _error;
            done();
        });
    });

    describe('#getAll', function() {
        it('shoud not raise error', function() {
            assert.ifError(error);
        });

        it('should contain at least 1 element', function() {
            assert.ok(entries.length > 0);
        });

        it('should contain at less than 30 elements', function() {
            assert.ok(entries.length <= 30);
        });
    });

    describe('filter by 5 words and ordered by comments', function() {
        var filteredEntries;
        before(function() {
            filteredEntries = new entryController.ListBuilder(entries)
                .filterBy('NUMBEROFWORDS', 'GT', 5)
                .orderBy('comments', 'desc')
                .getEntries();
        });

        function titlesOver5Words(data) {
            result = true;
            data.forEach(function(item) {
                var words = item.title.split(/ +/);
                if (words.length <= 5) {
                    result = false;
                    return;
                }
            });
            return result;
        }

        function correctOrder(data) {
            result = true;
            var last = data[0].comments;
            data.forEach(function(item) {
                if (last < item.comments) {
                    result = false;
                    return;
                }
            });
            return result;
        }

        it('should be in correct order', function() {
            assert.ok(correctOrder(filteredEntries));
        });

        it('should not contain titles of more than 5 words', function() {
            assert.ok(titlesOver5Words(filteredEntries));
        });
    });

    describe('filter by 5 words and ordered by points', function() {
        var filteredEntries;
        before(function() {
            filteredEntries = new entryController.ListBuilder(entries)
                .filterBy('NUMBEROFWORDS', 'GTE', 5)
                .orderBy('points', 'desc')
                .getEntries();
        });

        function titlesOver5Words(data) {
            result = true;
            data.forEach(function(item) {
                var words = item.title.split(/ +/);
                if (words.length < 5) {
                    result = false;
                    return;
                }
            });
            return result;
        }

        function correctOrder(data) {
            result = true;
            var last = data[0].points;
            data.forEach(function(item) {
                if (last < item.points) {
                    result = false;
                    return;
                }
            });
            return result;
        }

        it('should be in correct order', function() {
            assert.ok(correctOrder(filteredEntries));
        });

        it('should not contain titles of more than 5 words', function() {
            assert.ok(titlesOver5Words(filteredEntries));
        });
    });
});

