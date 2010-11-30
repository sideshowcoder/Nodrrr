// Get datagram funcitons
var dgram = require('dgram');

// Enumerate the prioities
var GrowlPriority = {
	"highest": 2,
	"high": 1,
	"normal": 0,
	"low": -1,
	"lowest": -2
};

// Create a nodrrr setting some variables
var Nodrrr = function(appName, notificationName, pass) {
	this.pass = pass ? pass: "";
	this.appName = appName;
	this.notificationName = notificationName;
	//default send to localhost
	this.addr = "127.0.0.1"
};


// Register application
Nodrrr.prototype.regApp(fn) {
	
};

// Send notifiction
Nodrrr.prototype.sendNotification() {
	
};

// Export from module to use
exports.Nodrrr = Nodrrr;
exports.GrowlPriority = GrowlPriority;


