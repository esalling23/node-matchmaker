const assert = require('assert');
const roomController = require('../controllers/rooms.js');
const userController = require('../controllers/user.js');

const roomTestId = '5b61cbe4149f4e1b04c89664';
const userTestId = '5b60862150ab730d9259a24a';
const testMMR = 2756;

describe('Room Controller', function() {

  describe('join', function() {
    it('should return null error and matching room with added player', function(done) {
      roomController.join(roomTestId, userTestId, function(err, room) {
        assert.isNull(err);
        assert.equal(room, roomTestId);
        assert.equal(room.players[0]._id, userTestId);
        done();
      }, done());
    });
  });

  describe('locate', function() {
    it('should send back null error and matching room', function(done) {
      roomController.locate(roomTestId, function(err, room) {
        assert.isNull(err);
        assert.equal(room._id, roomTestId);
        done();
      }, done());
    });
  });

});

describe('User Controller', function() {

  describe('match', function() {
    it('should return null error and a player with an MMR close to given MMR', function(done) {
      userController.match(testMMR, function(match) {
        assert.isNull(err);
        assert.isObject(match);
        expect(Math.abs(testMMR, match.mmr) < 100).toBeTruthy();
        done();
      }, done());
    });
  });

  describe('locate', function() {
    it('should send back null error and non-playing user', function(done) {
      userController.locate('', function(err, user) {
        assert.isNull(err);
        assert.equal(user.playing, false);
        done();
      }, done());
    });
  });

  describe('setPlaying', function() {
    it('should set a given user to be playing', function(done) {
      userController.setPlaying(userTestId, function(err, user) {
        assert.isNull(err);
        assert.equal(user.playing, true);
        done();
      }, done());
    });
  });

});
