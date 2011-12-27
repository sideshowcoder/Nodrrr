_Nodrrr_ is a module to allow sending [Growl](http://growl.info) notifications
from [node](http://nodejs.org).

Growl is a really cool "global notification system for Mac OS X".
### Growl Version
This module does not yet support Growl 1.3 and up, due to change in protocol!

### Install
	npm install nodrrr

### Example
	var nodrrr = require('../lib/nodrrr');
	var Ng = new nodrrr.Nodrrr({
	  host: 'localhost',
    app: 'Node.js',
    all_notifies:  ['Node.js Growl Notification'],
    default_notifies:  ['Node.js Growl Notification']
	});
	Ng.register(function(err){
	  if(err) return;
	  Ng.notify('Node.js Growl Notification', 'Nodrrr', 'Node.js says grrrr', 0, false);	  
	});


### Functions
Creating a new Nodrrr Object
	
	var n = new Nodrrr({
	  host: 'localhost',
    app: 'Node.js',
    all_notifies:  ['Node.js Growl Notification'],
    default_notifies:  ['Node.js Growl Notification']
	});

Register with Growl on the host and sent notification

	n.register(function(err){
	  n.notify(type, title, msg, priority, sticky, function(err){
	    // Notification sent
	  })
	});
	

	
