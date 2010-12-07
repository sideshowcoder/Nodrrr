// Load Lib
var nodrrr = require('../lib/nodrrr');

// Create Growling Object
var Ng = new nodrrr.Nodrrr('localhost', 'growlnotify', ['Command-Line Growl Notification'], ['Command-Line Growl Notification'], null)

// Register as App
Ng.register();

// Sent a Notification
Ng.notify('Command-Line Growl Notification', '', 'hi', 0, false);

// Exit
process.exit();
