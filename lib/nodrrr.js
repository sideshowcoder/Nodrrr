// Get datagram funcitons
var dgram = require('dgram');

// Enumerate the prioities
var GPrio = {
	"highest": 2,
	"high": 1,
	"normal": 0,
	"low": -1,
	"lowest": -2
};

// Set version, registration, and notification
var GProtV = 1;
var GTypeReg = 0;
var GTypeNot = 1;

// Create a nodrrr setting some variables
var Nodrrr = function(addr, pass, prg, msgt, msg, prio, stick) {
	this.addr = addr ? addr: "127.0.0.1";
	this.pass = pass ? pass: "";
	this.prg = prog;
	this.msgt = msgt;
	this.msg = msg;
	this.prio = prio ? prio: "normal";
	this.stick = stick ? stick: false;
}

// Register application
Nodrrr.prototype.regApp(cb) {
	
}

// Send notifiction
Nodrrr.prototype.sendNotification(cb) {
	
}
