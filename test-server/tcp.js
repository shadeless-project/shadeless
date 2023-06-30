const Net = require('net');
const port = 4000;

const server = new Net.Server();

server.listen(port, function() {
    console.log(`Server listening for connection requests on socket localhost:${port}`);
});

server.on('connection', function(socket) {
  let body = null;
  socket.on('data', function(chunk) {
    if (!body) body = chunk;
    else body = Buffer.concat([body, chunk]);
  });

  // When the client requests to end the TCP connection with the server, the server
  // ends the connection.
  socket.on('end', function() {
    console.log(body.toString());
    socket.write('Hello, client.');
    console.log('Closing connection with the client');
    socket.end();
  });

  // Don't forget to catch error, for your own sake.
  socket.on('error', function(err) {
    socket.write('Error!.');
  });
});