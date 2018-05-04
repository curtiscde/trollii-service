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

describe('List Model Helper - memberModel', function(){

    it('does not return picture or displayname if auth0User and user isnt found', function(){

        let member = { userid: 'foo' };
        let users = [];
        let auth0Users = [];
        let ownerid = 'bar';

        assert.deepEqual(
            listModelHelper.memberModel(member, users, auth0Users, ownerid),
            {
                isowner: false,
                displayname: undefined,
                picture: undefined,
                userid: 'foo'
            }
        );
    });

    it('returns isowner = true if userid matches owner', function(){

        let member = { userid: 'foo' };
        let users = [];
        let auth0Users = [];
        let ownerid = 'foo';

        assert.deepEqual(
            listModelHelper.memberModel(member, users, auth0Users, ownerid),
            {
                isowner: true,
                displayname: undefined,
                picture: undefined,
                userid: 'foo'
            }
        );
    });

});