// Load Lib
var nodrrr = require('../lib/nodrrr');

// Registration Variables
var host = 'localhost';
var app = 'growlnotify';
var allnotifications = ['Command-Line Growl Notification'];
var defaultnotifications = ['Command-Line Growl Notification'];
var pass = null;

// Message

var type = 'Command-Line Growl Notification';
var title = 'Nodrrr';
var msg =  'Node.js says grrrr';
var prio = 0;
var sticky = false;

// Create Growling Object
var Ng = new nodrrr.Nodrrr(host, app, allnotifications, defaultnotifications, pass)
// Register as App
Ng.register();
// Sent a Notification
Ng.notify(type, title, msg, prio, sticky);
// Exit
process.exit();
