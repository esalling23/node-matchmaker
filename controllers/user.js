const userModel = require('../models/User.js');
const mongoose = require('mongoose');
const User = mongoose.model('User');

class UserController {

  constructor() {}

  // Add a user
  create(user) {
    var newUser = new User(user);
    // console.log(newUser);
    newUser.save(function(err, created) {
      if (err)
        console.log(err);
      else
        console.log(created, " just created this");

    });
  }

  // Find user
  locate(id, callback) {
    var query = {};
    if (id)
      query._id = id;
    else
      query.playing = false;
      
    User.findOne(query, function(err, user) {
      callback(err, user);
    });
  }

  // Find a match for a user
  match(mmr, callback) {
    User.find({ playing: false }, function(err, users) {
      if (err) throw err;

      var distance = mmr;
      var match;

      for (let user of users) {

        if (user.mmr == mmr) {
          callback (user);
          return;
        }
        else if (Math.abs(user.mmr, mmr) < distance) {
          distance = Math.abs(user.mmr, mmr);
          match = user;
        }
      }

      console.log(mmr, match);

      callback(match);
    });
  }

  // Sets a user as playing
  setPlaying(userId, callback) {
    User.find({ _id: userId }, function(err, foundUser) {

      if (err) throw err;

      console.log(err, foundUser);

      foundUser[0].playing = true;

      foundUser[0].save(function(err, savedUser) {
        console.log(err, savedUser, " just set this user to playing");
        callback(err, savedUser);
      });

    });
  }

}

module.exports = new UserController;
