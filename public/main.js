const joinBtn = document.getElementById('join-room');
const matchBox = document.getElementById('match-box');
const loader = document.getElementById('loader');

joinBtn.addEventListener('click', function(event) {
  loader.style.display = 'block';
  let user = joinBtn.dataset.user
  let data = { userId: user }
  request('POST', '/join', JSON.stringify(data), function(data) {
    console.log(data);
    matchBox.innerHTML = "<p>Room Found: " + data.room.name + "</p>";
    findMatch(data.room._id, user);
  });
});

function findMatch(room, user) {
  let data = { userId: user, room: room };

  request('POST', '/match', JSON.stringify(data), function(res) {
    console.log(res);
    loader.style.display = 'none';
    matchBox.innerHTML += "<p>Opponent Found: " + res.match.name + " (MMR " + res.match.mmr + ")</p>";
    joinBtn.style.display = 'none';
  });
}

// general request function
function request(type, url, data, callback) {
  let request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
      let response = JSON.parse(this.responseText);
      console.log(response, " is the response");
      callback(response);
    }
  }
  request.open(type, url, true);

  if (data)
    request.setRequestHeader("Content-type","application/json;charset=UTF-8");

    console.log(data, " is the data we are sending in the api call")
  request.send(data);
}
