const synth = window.speechSynthesis;
$(function () {

    // if user is running mozilla then use it's built-in WebSocket
  window.WebSocket = window.WebSocket || window.MozWebSocket;
    // if browser doesn't support WebSocket, just show
    // some notification and exit
  if (!window.WebSocket) {
    content.html($('<p>',
      { text:'Sorry, but your browser doesn\'t support WebSocket.'}
      ));
    input.hide();
    $('span').hide();
    return;
  }
    // open connection
  function startConnection()
  {
    var connection = new WebSocket('wss://avfall.herokuapp.com/');

    connection.onopen = function () {
      console.log("connected")
         document.getElementsByTagName('body')[0].innerHTML = "CONNECTED"; 
         let utterance = new SpeechSynthesisUtterance("connected");
     synth.speak(utterance);


    };
    connection.onerror = function (error) {
          // just in there were some problems with connection...
        document.getElementsByTagName('body')[0].innerHTML = "NOT CONNECTED"; 
         let utterance = new SpeechSynthesisUtterance("Can not connect");
     synth.speak(utterance);

    };
        // most important part - incoming messages
    connection.onmessage = function (message) {
          // try to parse JSON message. Because we know that the server
          // always returns JSON this should work without any problem but
          // we should make sure that the massage is not chunked or
          // otherwise damaged.
      console.log(message)
      var order = JSON.parse(message.data).message
      console.log(order)
      let utterance = new SpeechSynthesisUtterance(order);
     synth.speak(utterance);

      setInterval(function()
      {
        if (connection.readyState !== 1)
        {
          $.notify("Can't connect to websocket server", "error");
          location.reload();
        }
      }, 300000);

    }
    }

    startConnection();

  });
