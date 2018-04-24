var assert = require('assert');

var listInviteHelper = require('./list-invite');

describe('List Invite Helper', function(){

    it('returns false if email does not match', function(){
        assert.equal(listInviteHelper.validListInviteEmail({ email: 'email@domain.com' }, 'email@domain2.com'), false);
    });

    it('returns true if email matches', function(){
        assert.equal(listInviteHelper.validListInviteEmail({ email: 'email@domain.com' }, 'email@domain.com'), true);
    });

    it('returns true if email matches but has different casing', function(){
        assert.equal(listInviteHelper.validListInviteEmail({ email: 'email@domain.com' }, 'email@DOMAIN.com'), true);
    });

});