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