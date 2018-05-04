var assert = require('assert');

var listModelHelper = require('./list-model');

describe('List Model Helper - emojiByItemName', function(){

    var itemdata = {
        items: [
            { name: 'Apples', emoji: '🍎' },
            { name: 'Avocado', emoji: '🥑' }
        ]
    };

    it('returns null if item name does not have matching emoji', function(){
        assert.equal(listModelHelper.emojiByItemName(itemdata, 'hello'), null);
    });

    it('returns emoji char if item name does have emoji', function(){
        assert.equal(listModelHelper.emojiByItemName(itemdata, 'Apples'), '🍎');
    });

    it('returns emoji char if item name does have emoji, but with different letter casing', function(){
        assert.equal(listModelHelper.emojiByItemName(itemdata, 'avocado'), '🥑');
    });

});

describe('List Model Helper - getListsMembers', function(){

    it('returns members from lists', function(){
        let lists = [
            { members: [{ userid: 'foo' }]},
            { members: [{ userid: 'bar' }]}
        ];
        assert.deepEqual(
            listModelHelper.getListsMembers(lists),
            ['foo','bar']
        )
    });

    it('returns members from lists without duplicates', function(){
        let lists = [
            { members: [{ userid: 'foo' }]},
            { members: [{ userid: 'foo' }, { userid: 'bar' }]}
        ];
        assert.deepEqual(
            listModelHelper.getListsMembers(lists),
            ['foo','bar']
        )
    });

});