/* Nodrrr: growl for nodejs 
 * Author: Philipp Fehre (http://sideshowcoder.com or @ischi on twitter)
 * License BSD
 * 
 * The whole code is based on ruby-growl found on http://growl.info
 */

// Crypto + Network
var dgram = require('dgram'),
	crypto = require('crypto');

/* Extend Array to allow packing to Buffer 
 * 
 * Inspired by ruby array pack method
 * 
 * Takes a format fmt and walks the array
 * C = Element is interpreted as ASCII character (unsigned char)
 * a = Element is interpreted as ASCII string 
 * n = Element is interpreted as Short generating a 2 octets  
 * 
 * Just for the hack of it ;)
 * b = Element is binary but utf8 encoded as string 
 * 	   this is mainly a hack to get hashes from crypto into the buffer since 
 *     they are passed as strings, by first converting them into an array and 
 *     then writing the array into the buffer via buffer.copy
 *
 * 
 * The last fmt element is repeated for the length of the array
 */

Array.prototype.pack = function(fmt) {
	// Fill format sring to length 
	while(fmt.length < this.length) fmt += fmt[fmt.length-1];
	var a = new Array();
	var len = 0;
	this.forEach(function(el, idx, ary) {
		switch(fmt[idx]) {
			case 'C':
				var buf = new Buffer(1);
				buf[0] = el;
				len += 1;
				break;
			case 'a':
				var buf = new Buffer(el);
				len += el.length;
				break;
			case 'n':
				var buf = new Buffer(2);
				// Set lower bits
				buf[1] = el & 0xff;
				// Set higher bits
				buf[0] = el >> 8;
				len += 2;
				break;
			case 'b':
				var buf = new Buffer(1);
				buf[0] = el.charCodeAt(0);
				len += 1;
				break;
			default:
				throw 'Format invalid';
		}
		a.push(buf);
	});
	var res = new Buffer(len);
	var off = 0;
	a.forEach(function(el, idx, ary) {
		el.copy(res, off, 0);
		off += el.length;
	});
	return res;
}

/* Create Nodrrr
 * 
 * host: Host to growl to
 * app: App name growling
 * all_notifies: supported notifies
 * default_notifies: 	list of notifications turned on by default, should be the 
 * 						same as notifies, if I'm correct don't know
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

	// Set variables
	this.host = host;
	this.app = app;
	this.all_notifies = all_notifies;
	this.default_notifies = default_notifies;
	this.pass = pass;
	this.socket = dgram.createSocket('udp4');
}

// Send a message
Nodrrr.prototype.send = function(packet) {
	this.socket.send(packet, 0, packet.length, this.growl_port, this.host);
}

// Build a notification packet
Nodrrr.prototype.build_notification = function(name, title, desc, prio, sticky) {
	// FIXME flags have some error, sticky is not working 
	var flags = ((0x7 & prio) << 1);
	if(sticky) flags = flags | 1;
	var packet = [	this.growl_protocol_version, 
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

	// Encode Array to Buffer
	var buf = packet.pack('CCnnnnna');
	// Create a Buffer with room for the checksum
	packet = new Buffer(buf.length + 16);
	buf.copy(packet, 0, 0);

	var ecc = crypto.createHash('md5');
	ecc.update(buf);
	if ( this.pass ) ecc.update(this.pass);
	
	// Create the hash string, and convert in an array
	digest = ecc.digest().split('')
	digest = digest.pack('b');
	digest.copy(packet, buf.length, 0);
	
	return packet;
}

// Build a registration packet
Nodrrr.prototype.build_registration = function() {
	var data = [ this.app ];
	
	this.all_notifies.forEach(function(el, idx, ary) {
		data.push(el.length, el);
	});
	
	this.default_notifies.forEach(function(el, idx, ary) {
		if( this.all_notifies.indexOf(el) !== -1 ) data.push(this.all_notifies.indexOf(el));
	}, this);
	
	var packet = [	this.growl_protocol_version, 
					this.growl_type_registration, 
					this.app.length, 
					this.all_notifies.length, 
					this.default_notifies.length ];
				
	data.forEach(function(el, idx, ary) {
		packet.push(el);
	});
	
	// Encode array to buffer
	var buf = packet.pack('CCnCCanaC');
	// Create a Buffer with room for the checksum
	packet = new Buffer(buf.length + 16);
	buf.copy(packet, 0, 0);
	
	// Add needed checksum
	var ecc = crypto.createHash('md5');
	ecc.update(buf);
	if ( this.pass ) ecc.update(this.pass);
	// Create the hash string, and convert in an array
	digest = ecc.digest().split('')
	digest = digest.pack('b');
	digest.copy(packet, buf.length, 0);
	
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
