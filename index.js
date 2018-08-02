const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const _ = require('underscore');
const fs = require('fs');
const randomWords = require('random-words');
const hbs = require('express-hbs');
const mongoose = require('mongoose');

const allThings = [];
const userController = require('./controllers/user.js');
const roomController = require('./controllers/rooms.js');

mongoose.connect('mongodb://admin:tomatchornottomatch23@ds259711.mlab.com:59711/matchmaker');

app.use( express.static( path.join(__dirname, '/public') ) );
app.use( bodyParser.urlencoded({ extended: false }) );
app.use( bodyParser.json() );

app.engine('hbs', hbs.express4({
  defaultLayout: './views/layouts/base',
  partialsDir: './views/partials'
}));

app.set('view engine', 'hbs');

app.get('/', function(req, res) {

  // Set the user name to be shown on the page
  userController.locate('', function(err, user) {

    if (err || !user)
      res.status(400).send(err, user);
    else
      res.render('index', { user: user });
  });

});

// Find a match
app.post('/match', function(req, res) {
  let room = req.body.room;
  let userId = req.body.userId;
  userController.locate(userId, function(err, user) {
    if (err || !user)
      res.status(400).send(err, user);
    else {
      userController.match(user.mmr, function(match) {
        roomController.join(room, match._id, function(err, room) {
          if (err || !room)
            res.status(400).send(err, room);
          else {
            userController.setPlaying(userId, function(err, savedPlayer) {
              if (err)
                res.status(400).send(err, savedPlayer);
              else
                res.send({ match: match })
            });
          }
        });
      });
    }
  });

});

// Finds an empty room to add a user to
// After adding to room, will start to find match
app.post('/join', function(req, res) {
  const userId = req.body.userId;
  roomController.locate('', function(err, room){
    if (err || !room)
      res.status(400).send(err, room);
    else {
      roomController.join(room._id, userId, function(err, joinedRoom) {
        if (err || !joinedRoom)
          res.status(400).send(err, joinedRoom);
        else {
          userController.setPlaying(userId, function(err, savedPlayer) {
            if (err)
              res.status(400).send(err, savedPlayer);
            else
              res.send({ room: joinedRoom });
          });
        }
      });
    }
  });
});


app.listen(3000, function() {
  console.log('listening on port 3000');
});



// Creates initial dummy data if database is empty
function createData(type) {

  // Get the model controller for this type of data
  const creator = require('./controllers/' + type + '.js');

  // Are there any items in this table?
  creator.locate('', function(item) {

    // If we find an item, don't add more
    if (item) return;

    // Otherwise, let's create 100,000 rooms or users to fill up our database
    for (let x = 0; x < 10; x++) {

      // Determine a unique, never-been-used name
      let name = randomWords();
      while (_.findWhere(allThings, { name: name })) {
        name = randomWords();
      }
      const obj = {
        'name': name
      };

      // Users get MMR scores, rooms get players
      if (type == "user") {
        obj.mmr = Math.floor((Math.random() * 2400) + 1100);
        obj.playing = false;
      }

      // Add this object to our variable for quick search above
      allThings.push(obj);

      // debugger;

      // Use the model controller create function
      creator.create(obj);

    } // End for loop

  }); // End model controller locate function

}
