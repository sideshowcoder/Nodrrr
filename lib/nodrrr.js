var dgram = require('dgram'),
	crypto = require('crypto');

/* Create Nodrrr
 * 
 * host: Host to growl to
 * app: App name growling
 * all_notifies: supported notifies
 * default_notifies: 	list of notifications turned on by default, should be the 
 * 						same as notifies, if I'm correct don't knwo
 * password: Host to growl to
 * 
 */

function Nodrrr(host, app, all_notifies, default_notifies, pass) {

	var self = {};
	
	// Port growl listens on by default
	self.growl_port = 9887;
	// Used growl protocol version
	self.growl_protocol_version = 1;
	// ID used for registration packet
	self.growl_type_registration = 0;
	// ID used for notification packet	
	self.growl_type_notification = 1;

	// Get variables
	self.host = host;
	self.app = app;
	self.all_notifies = all_notifies;
	self.default_notifies = default_notifies;
	self.pass = pass;
	
	// create a socket
	var socket = dgram.createSocket('udp4');
		
	// Sent a notification
	self.notify = function(type, title, msg, priority, sticky) {
		
	}
	
	// Register yourself
	self.register = function() {
		
	}
	
}

function sendMessage(msg) {
	socket.send(msg, 0, msg.length, Nodrrr.port, Nodrrr.host);
}

// Build a notification packet
function build_notification() {
	
}

// Build a registration packet
function build_registration() {
	length = 0;
	data = [ Nodrrr.app ];
	data_format = 'a' + Nodrrr.app.length;
	
	packet = [	Nodrrr.growl_protocol_version, 
				Nodrrr.growl_type_registration, 
				Nodrrr.app.length, 
				Nodrrr.all_notifies.length, 
				Nodrrr.default_notifies.length ];
	
	for( var n in Nodrrr.all_notifies ) {
		data.push(n.length, n);
		data_format += 'na' + n.length;
	}
	
	for( var n in Nodrrr.default_notifies ) {
		if( Nodrrr.all_notifies.index(n) !== null ) data.push(Nodrrr.all_notifies.index(n));
		data_format += 'C'
	}
	
	packet.push(pack(data, data_format));
	packet = pack(packet, 'CCnCCa*');
	
	ecc = crypto.createHash('md5');
	ecc.update(packet);
	if ( Nodrrr.pass ) ecc.update(Nodrrr.pass);
	packet.push(ecc.digest('hex'));
	
	return packet
}

function pack(data, format) {
	// TODO Implement
	return data;
}


