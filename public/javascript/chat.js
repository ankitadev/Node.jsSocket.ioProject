$(function () {
  let socket = io();
  let name = '';
  let nameInput = $('#name-input');
  let chatInput = $('#chat-input');

  // handle name entered with via keyboard enter
  nameInput.keydown(function(event) {
    if (event.which == 13) {
      event.preventDefault();

      // ensure message not empty
      if (nameInput.val() !== '') {
        name = nameInput.val();
        nameInput.val('');
        $('.enter-name').hide();
        socket.emit('new:member', name);
      }
    }
  });

  // handle name entered with when clicking enter
  $('.submit-name').on('click', function(event) {
    event.preventDefault();

    // ensure message not empty
    if (nameInput.val() !== '') {
      name = nameInput.val();
      nameInput.val('');
      $('.enter-name').hide();
      socket.emit('new:member', name);
    }
  });


  // handle keyboard enter button being pressed
  chatInput.keydown(function(event) {
    if (event.which == 13) {
      event.preventDefault();

      // ensure message not empty
      if (chatInput.val() !== '' && name !== '') {
        socket.emit('new:message', {name: name, msg: chatInput.val()});
        chatInput.val('');
      }
    }
  });

  // handle submit chat message button being clicked
  $('.submit-chat-message').on('click', function(event) {
    event.preventDefault();

    // ensure message not empty
    if (chatInput.val() !== '' && name !== '') {
      socket.emit('new:message', {name: name, msg: chatInput.val()});
      chatInput.val('');
    }
  });

  // handle receiving new messages
  socket.on('new:message', function(msgObject){
    $('#messages').append($('<div class="msg new-chat-message">').html('<span class="member-name">' + msgObject.name + '</span>: ' + msgObject.msg));
    $('.chat-window').scrollTop($('#messages').height());
  });

  // handle members joining
  socket.on('new:member', function(name){
    $('#messages').append($('<div class="msg new-member">').text(name + ' has joined the room'));
    $('.chat-window').scrollTop($('#messages').height());
  });
});
var socket;

function setup() {
  let canvas = createCanvas(370, 543);
  background(255, 204, 0);
  canvas.parent('sketch-holder');
  socket = io.connect('http://localhost:3000');
  socket.on('mouse',
    function(data) {
      console.log("Got: " + data.x + " " + data.y);
      fill(220, 180, 200);
      noStroke();
      ellipse(data.x, data.y, 20, 20);
    }
  );
}

function draw() {
  // purposly empty
}

function mouseDragged() {
  fill(51);
  noStroke();
  ellipse(mouseX,mouseY,20,20);
  sendmouse(mouseX,mouseY);
}

// Function for sending to the socket
function sendmouse(xpos, ypos) {
  console.log("sendmouse: " + xpos + " " + ypos);
  
  // Make a little object with  and y
  var data = {
    x: xpos,
    y: ypos
  };

  // Send that object to the socket
  socket.emit('mouse',data);
}
