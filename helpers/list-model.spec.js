var assert = require('assert');

var listModelHelper = require('./list-model');

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