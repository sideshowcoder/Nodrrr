// Crypto + Network
var dgram = require('dgram'),
	crypto = require('crypto');

// Get me some sys
var sys = require('sys');

/* Extend Array to allow packing based on a format string
 *
 * Function based on the Ruby Pack Method
 *
 * The last character of the format string is repeated until the length 
 * of the array is reached if it should be to short
 * 
 * fmt options:
 * a = ASCII String
 * C = unsigned char
 * n = short
 */

Array.prototype.pack = function(fmt) {
	// Fill fmt with last character
	while(fmt.length < this.length) fmt += fmt[fmt.length-1]
	// Create a buffer to return containing the packed array
	var buf = new Buffer(this);
	this.forEach(function(el, idx, ary) {
		switch(fmt[idx]) {
			case 'a':
				buf.write(el, idx, encoding='ascii');
				break;
			case 'C':
				buf.write(el, idx, encoding='ascii');
				break;
			case 'n':
				buf[idx] = el;
				break;
			default:
				throw 'Unvalid Format String';
		}
	});
	return buf;
}

/* Create Nodrrr
 * 
 * host: Host to growl to
 * app: App name growling
 * all_notifies: supported notifies
 * default_notifies: 	list of notifications turned on by default, should be the 
 * 						same as notifies, if I'm correct don't knwo
 * password: Host to growl to
 */

function Nodrrr(host, app, all_notifies, default_notifies, pass) {
	
	// Port growl listens on by default
	this.growl_port = 9887;
	// Used growl protocol version
	this.growl_protocol_version = 1;
	// ID used for registration packet
	this.growl_type_registration = 0;
	// ID used for notification packet	
	this.growl_type_notification = 1;

	// Get variables
	this.host = host;
	this.app = app;
	this.all_notifies = all_notifies;
	this.default_notifies = default_notifies;
	this.pass = pass;
	
	// create a socket
	this.socket = dgram.createSocket('udp4');
}
// Send a message
Nodrrr.prototype.send = function(packet) {
	this.socket.send(packet, 0, packet.length, this.growl_port, this.host);
}

// Build a notification packet
Nodrrr.prototype.build_notification = function(name, title, desc, prio, sticky) {
	flags = ((0x7 & prio) << 1);
	if(sticky) flags = flags | 1;
	packet = [	this.growl_protocol_version, 
				this.growl_type_notification,
			 	flags,
				name.length,
				title.length,
				desc.length,
				this.app.length,
				name, 
				title, 
				desc, 
				this.app ];
	

	ecc = crypto.createHash('md5');
	ecc.update(packet.join(''));
	if ( this.pass ) ecc.update(this.pass);
	packet = packet + ecc.digest('hex');

	return new Buffer(packet);
}

// Build a registration packet
Nodrrr.prototype.build_registration = function() {
	length = 0;
	data = [ this.app ];
	
	this.all_notifies.forEach(function(el, idx, ary) {
		data.push(el.length, el);
	});
	
	this.default_notifies.forEach(function(el, idx, ary) {
		if( this.all_notifies.indexOf(el) !== -1 ) data.push(this.all_notifies.indexOf(el));
	}, this);
	
	packet = [	this.growl_protocol_version, 
				this.growl_type_registration, 
				this.app.length, 
				this.all_notifies.length, 
				this.default_notifies.length ];
				
	data.forEach(function(el, idx, ary) {
		packet.push(el);
	});
	
	packet = packet.pack('CCnnnnna');
	// Create a Buffer with room for the checksum
	buf = new Buffer(packet.length + 16);
	packet.copy(buf, 0, 0);
	
	ecc = crypto.createHash('md5');
	ecc.update(packet);
	if ( this.pass ) ecc.update(this.pass);
	/*
		TODO Copy is not correct ... need to make ecc a buffer first copy then
	*/
	buf[packet.length] = ecc.digest();
	
	return packet;
}


// Sent a notification
Nodrrr.prototype.notify = function(type, title, msg, priority, sticky) {
	this.send(this.build_notification(type, title, msg, priority, sticky));
}

// Register yourself
Nodrrr.prototype.register = function() {
	this.send(this.build_registration());
}

// Export
exports.Nodrrr = Nodrrr;
