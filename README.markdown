_Nodrrr_ is a module to allow sending [Growl](http://growl.info) notifications
from [node](http://nodejs.org).

Growl is a really cool "global notification system for Mac OS X".

### Install
	npm install nodrrr

### Example
	var nodrrr = require('../lib/nodrrr');
	var Ng = new nodrrr.Nodrrr('localhost', 'growlnotify', ['Command-Line Growl Notification'], ['Command-Line Growl Notification'], null)
	Ng.register();
	Ng.notify('Command-Line Growl Notification', 'Nodrrr', 'Node.js says grrrr', 0, false);

### Functions
Creating a new Nodrrr Object
	
	var n = new Nodrrr(host, app, all\_notifies, default\_notifies, pass)

Register with Growl on the host

	n.register()
	
Sent a Notification

	n.notify(type, title, msg, priority, sticky)

### Array.pack?
To allow for a quick way to convert an Array to a Buffer, Array is extended by 
the function pack. Which returns a Buffer encoded following a given format String.
Extending Array is actually not such a great Idea and this will be moved out sooner 
or later but for a quick demo it works

### Code
This was mainly a quick way for me to send notifications to my Mac, the code 
needs some major cleanup
