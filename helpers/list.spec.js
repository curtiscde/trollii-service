var assert = require('assert');

var listHelper = require('./list');

describe('List Helper - hasUserListAccess', function(){

    let list = {
        members: [
            { userid: 'foo' },
            { userid: 'bar' }
        ]
    }

    it('returns true if userid is contained in members', function(){
        assert.equal(
            listHelper.hasUserListAccess(list, 'foo')
        , true);
    });

    it('returns false if userid is not contained in members', function(){
        assert.equal(
            listHelper.hasUserListAccess(list, 'baz')
        , false);
    });

});

describe('List Helper - emojiByItemName', function(){

    var itemdata = {
        items: [
            { name: 'Apples', emoji: '🍎' },
            { name: 'Avocado', emoji: '🥑' }
        ]
    };

    it('returns null if item name does not have matching emoji', function(){
        assert.equal(listHelper.emojiByItemName(itemdata, 'hello'), null);
    });

    it('returns emoji char if item name does have emoji', function(){
        assert.equal(listHelper.emojiByItemName(itemdata, 'Apples'), '🍎');
    });

    it('returns emoji char if item name does have emoji, but with different letter casing', function(){
        assert.equal(listHelper.emojiByItemName(itemdata, 'avocado'), '🥑');
    });

});