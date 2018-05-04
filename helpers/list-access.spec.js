var assert = require('assert');

var listAccessHelper = require('./list-access');

describe('List Access Helper - hasUserListAccess', function(){

    let list = {
        members: [
            { userid: 'foo' },
            { userid: 'bar' }
        ]
    }

    it('returns true if userid is contained in members', function(){
        assert.equal(
            listAccessHelper.hasUserListAccess(list, 'foo')
        , true);
    });

    it('returns false if userid is not contained in members', function(){
        assert.equal(
            listAccessHelper.hasUserListAccess(list, 'baz')
        , false);
    });

});