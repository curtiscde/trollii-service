var assert = require('assert');

var itemModelHelper = require('./item-model');

describe('Item Model Helper - emojiByItemName', function(){

    var itemdata = {
        items: [
            { name: 'Apples', emoji: '🍎' },
            { name: 'Avocado', emoji: '🥑' }
        ]
    };

    it('returns null if item name does not have matching emoji', function(){
        assert.equal(itemModelHelper.emojiByItemName(itemdata, 'hello'), null);
    });

    it('returns emoji char if item name does have emoji', function(){
        assert.equal(itemModelHelper.emojiByItemName(itemdata, 'Apples'), '🍎');
    });

    it('returns emoji char if item name does have emoji, but with different letter casing', function(){
        assert.equal(itemModelHelper.emojiByItemName(itemdata, 'avocado'), '🥑');
    });

});