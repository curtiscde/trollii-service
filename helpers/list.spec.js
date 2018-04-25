var assert = require('assert');

var listHelper = require('./list');

var itemdata = {
    items: [
        { name: 'Apples', emoji: '🍎' },
        { name: 'Avocado', emoji: '🥑' }
    ]
};

describe('List Helper', function(){

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