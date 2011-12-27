/* Nodrrr: growl for nodejs 
 * Author: Philipp Fehre (http://sideshowcoder.com or @ischi on twitter)
 * License BSD
 * 
 * The code is based on ruby-growl found on http://growl.info
 */

// UDP and Crypto support
var dgram = require('dgram'), 
    crypto = require('crypto'),
    util = require('util');
    
/* Create Nodrrr
 * 
 * Options:
 *  host: Host to growl to
 *  app: App name growling
 *  growl_port: Port growl is runnig on
 *  all_notifies: supported notifies
 *  default_notifies: list of notifications turned on by default, should be the 
 *  same as notifies, if I'm correct don't know
 *  password: Host to growl to
 */

var Nodrrr = function(opts) {
  // Format needs to fit key: { value: val } to work with Object.create
  // make it enumerable to work with for in 
  // make it writeable to work with assignments 
  var options = {};
  for(var i in opts){
    options[i] = {value: opts[i], enumerable: true, writable: true};
  }

  // Merge defaults and passed config
  var config = Object.create({
    growl_port: 9887, // growl default port
    growl_protocol_version: 1, // Used growl protocol version
    growl_type_registration: 0, // ID used for registration packet
    host: 'localhost', // default to localhost
    app: 'nodrrr', // default to nodrrr as app name sending notifications
    all_notifies: ['Nodrrr Growl Notification'],
    default_notifies: ['Nodrrr Growl Notification']
  }, options);

  // Assign to this
  for(var o in config){
    this[o] = config[o];
  }
};
    

/* Pack an Array to a Buffer 
 * 
 * Inspired by ruby array pack method
 * 
 * Takes a format fmt and walks the array
 * C = Element is interpreted as ASCII character (unsigned char)
 * a = Element is interpreted as ASCII string 
 * n = Element is interpreted as Short generating a 2 octets  
 * b = Element is binary but utf8 encoded as string 
 *  this is mainly a hack to get hashes from crypto into the buffer since 
 *  they are passed as strings, by first converting them into an array and 
 *  then writing the array into the buffer via buffer.copy
 * 
 * The last fmt element is repeated for the length of the array
 */
Nodrrr.prototype.arrayPack = function(array, fmt, cb){
  // Fill format sring to length 
  while(fmt.length < array.length) fmt += fmt[fmt.length-1];
	var a = [], len = 0, buf;
	try {
    array.forEach(function(el, idx, ary) {
      switch(fmt[idx]) {
        case 'C':
          buf = new Buffer(1);
          buf[0] = el;
          len += 1;
          break;
        case 'a':
          buf = new Buffer(el);
          len += el.length;
          break;
        case 'n':
          buf = new Buffer(2);
          buf[1] = el & 0xff; // Set lower bits
          buf[0] = el >> 8; // Set higher bits
          len += 2;
          break;
        case 'b':
          buf = new Buffer(1);
          buf[0] = el.charCodeAt(0);
          len += 1;
          break;
        default:
          throw "Invalid Format";
      }
      a.push(buf);
    });	  
	} catch (err){
	  cb(err);
	  cb = function(){};
	  return;
	}
	
	var buffer = new Buffer(len);
	var off = 0;
	
	a.forEach(function(el, idx, ary) {
		el.copy(buffer, off, 0);
		off += el.length;
	});
	
	cb(null, buffer);
};

// Send a message
Nodrrr.prototype.send = function(packet, cb) {
  // Create a socket
  var socket = dgram.createSocket('udp4');
  socket.send(packet, 0, packet.length, this.growl_port, this.host, function(err, bytes){
    socket.close();
	  if(err) {
	    cb(err);
	    return;
	  }
	  cb(null);
	});
};

// Build a notification packet
Nodrrr.prototype.build_notification = function(name, title, desc, prio, sticky, cb) {
  var that = this;
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
	this.arrayPack(packet, 'CCnnnnna', function(err, buffer){
    if(err) {
      cb(err);
      return;
    }
    // Create a Buffer with room for the checksum
    packet = new Buffer(buffer.length + 16);
    buffer.copy(packet, 0, 0);
    var ecc = crypto.createHash('md5');
    ecc.update(buffer);
    if ( that.pass ) ecc.update(that.pass);
    digest = ecc.digest().split(''); // Create the hash string, and convert in an array
    that.arrayPack(digest, 'b', function(err, buffer){
      if(err){
        cb(err);
        return;
      }
      buffer.copy(packet, buffer.length, 0);
      cb(null, packet);      
    });
	});
};

// Build a registration packet
Nodrrr.prototype.build_registration = function(cb) {
  var that = this;
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
	this.arrayPack(packet, 'CCnCCanaC', function(err, buffer){
	  if(err) {
	    cb(err);
	    return;
    }
    // Create a Buffer with room for the checksum
    packet = new Buffer(buffer.length + 16);
    buffer.copy(packet, 0, 0);
    
    // Add needed checksum
    var ecc = crypto.createHash('md5');
    ecc.update(buffer);
    if ( this.pass ) ecc.update(this.pass);
    // Create the hash string, and convert in an array
    digest = ecc.digest().split('');
    that.arrayPack(digest, 'b', function(err, buffer){
      if(err){
        cb(err);
        return;
      }
      buffer.copy(packet, buffer.length, 0);      
      cb(null, packet);
    });
	});
};


// Sent a notification
Nodrrr.prototype.notify = function(type, title, msg, priority, sticky, cb) {
  var that = this;
	this.build_notification(type, title, msg, priority, sticky, function(err, packet){
	  if(err){
	    cb(err);
	    return;
	  }
	  that.send(packet, function(err){
	    if(err){
	      cb(err);
	      return;
	    }
	    cb(null);
	  });
	});
};

// Register yourself
Nodrrr.prototype.register = function(cb) {
  var that = this;
  this.build_registration(function(err, packet){
    if(err){
      cb(err);
      return;
    }
	  that.send(packet, function(err){
	    if(err){
	      cb(err);
	      return;
	    }
	    cb(null);
	  });    
  });
};

// Export
exports.Nodrrr = Nodrrr;
