var http = require('http');
var net = require('net');
var url = require('url');

var server = http.createServer(function(req, res) {
  console.log(req.method);
  res.writeHead(200, {
    'Content-type': 'application/json'
  });
  res.end(JSON.stringify(http.STATUS_CODES));
}).listen(4000);

server.on('connect', function(req, socket, head) {
  // This doesn't fire when doing e.g. curl -X CONNECT localhost:4000
  var serverUrl = url.parse('http://' + req.url);

  console.log(serverUrl);

  var srvSocket = net.connect(serverUrl.port, serverUrl.hostname, function() {
    socket.write('HTTP/1.1 200 Connection Established\r\n' +
    'Proxy-agent: Node-Proxy\r\n' +
    '\r\n');
    srvSocket.pipe(socket);
    socket.pipe(srvSocket);
  });
});