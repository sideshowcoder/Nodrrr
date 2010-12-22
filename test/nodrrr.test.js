var assert = require('assert');
// Load the nodrrr module
var nodrrr = require('nodrrr');

// Create a new Nodrrr object to work with
var setup = function(){
	var host = 'localhost';
	var app = 'growlnotify';
	var allnotifications = ['Command-Line Growl Notification'];
	var defaultnotifications = ['Command-Line Growl Notification'];
	var pass = null;
	return new nodrrr.Nodrrr(host, app, allnotifications, defaultnotifications, pass)
}

// Tests
module.exports = {	
	'test registration packet': function(){
		var expected = new Buffer([0x01, 0x00, 0x00, 0x0b, 0x01, 0x01, 0x67, 0x72, 0x6f, 
		0x77, 0x6c, 0x6e, 0x6f, 0x74, 0x69, 0x66, 0x79, 0x00, 0x1f, 0x43, 0x6f, 
		0x6d, 0x6d, 0x61, 0x6e, 0x64, 0x2d, 0x4c, 0x69, 0x6e, 0x65, 0x20, 0x47, 
		0x72, 0x6f, 0x77, 0x6c, 0x20, 0x4e, 0x6f, 0x74, 0x69, 0x66, 0x69, 0x63,
		0x61, 0x74, 0x69, 0x6f, 0x6e, 0x00, 0x57, 0x4a, 0xe3, 0x1b, 0xa5, 0x49, 
		0x9c, 0x25, 0x3a, 0xbe, 0x75, 0x5d, 0xe5, 0x2c, 0xc9, 0x96]);

		var Ng = setup();

		assert.eql(expected, Ng.build_registration());
	},
	
	'test notification packet basic': function(){
		assert.isNull(null);
	},
	
	'test notification packet priority -2': function(){
		assert.isNull(null);		
	},

	'test notification packet priority -1': function(){
		assert.isNull(null);
	},

	'test notification packet priority 0': function(){
		assert.isNull(null);		
	},

	'test notification packet priority 1': function(){
		assert.isNull(null);		
	},

	'test notification packet priority 2': function(){
		assert.isNull(null);		
	},

	'test notification packet sticky': function(){
		assert.isNull(null);		
	}
	
};