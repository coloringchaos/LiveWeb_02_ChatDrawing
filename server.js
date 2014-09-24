// server.js

// HTTP Portion
var http = require('http'); 
		//this is a node module that's built into node, called 'http'
		//when you do require, it instantiates an http object
		//this server has different events, methods...
var fs = require('fs'); // Using the filesystem module
var httpServer = http.createServer(requestHandler);
		//this is part of the http module 
httpServer.listen(8080);

function requestHandler(req, res) {		//this handles any request that comes in from the http module
	console.log("Got a request: " + req);
	// Read index.html
	fs.readFile(__dirname + '/index.html', //any request that's made, it'll read index.html - anyone who makes a request on this site, will get index.html back

		//this function is the second argument in the fs.readFile function
		// Callback function for reading
		function (err, fileContents) {
			// if there is an error
			if (err) {
				res.writeHead(404);	//404 is a normal http status code for error
				return res.end('Error loading index.html');
			}
			// Otherwise, send the data, the contents of the file
			res.writeHead(200); //standard http status code for all good
			res.end(fileContents); //data is the contents of this file 
  		}
  	);
}


// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io').listen(httpServer);

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection', //have this listen for events, like any javascript object
	// We are given a websocket object in our function
	function (socket) { //this function is called everytime someone makes a socket connection (not when the page loads, only when a connection is made)
	
		console.log("We have a new client: " + socket.id);
		
		socket.on('drawing', function(point) {
			// console.log('drawing: ' + point.x, + " " + point.y);
			io.sockets.emit('drawing', point);	//this sends it to everybody = REFLECTOR
		})

		// When this user emits, client side: socket.emit('otherevent',some data);
		socket.on('chatmessage', function(data) {
			// Data comes in as whatever was sent, including objects
			console.log("Received: 'chatmessage' " + data);
			
			// Send it to all of the clients
			// socket.broadcast.emit('chatmessage', data);
			io.sockets.emit('chatmessage', data);
		});
		
		
		socket.on('disconnect', function() {
			console.log("Client has disconnected " + socket.id);
		});
	}
);