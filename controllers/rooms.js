const roomModel = require('../models/Room.js');
const mongoose = require('mongoose');
const Room = mongoose.model('Room');

class RoomController {

  constructor() {}

  // Add a room
  create(room) {
    var newRoom = new Room(room);
    newRoom.save(function(err, aRoom) {
      if (err)
        console.log(err);
      else
        console.log(aRoom, " just created this");
    });
  }

  // find a room by ID or by empty
  locate(id, cb) {
    var query = {};
    if (id)
      query._id = id;
    else
      query.players = [ null ];

    Room.findOne(query, function(err, room) {
      cb(err, room);
    });
  }

  // Finds existing room to add a matching player
  join(roomId, userId, cb) {

    Room.findOne({ _id: roomId })
        .populate('players')
        .exec(function(err, room) {
          if (err) throw err;

          room.players.push(userId);
          room.save(function(err, room) {
            cb(err, room);
          });
        });
  }

}

module.exports = new RoomController;
