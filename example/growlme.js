// Load Lib
var nodrrr = require('../lib/nodrrr');

// Registration
var growl = new nodrrr.Nodrrr({
  host: 'localhost',
  app:'nodrrr',
  all_notifies: ['Node.js Growl Notification'],
  default_notifiies: ['Node.js Growl Notification']
});
// Sent Message
function notification(){
  var type = 'Node.js Growl Notification';
  var title = 'Nodrrr';
  var msg =  'Node.js says grrrr';
  var prio = 0;
  var sticky = false;
  growl.notify(type, title, msg, prio, sticky, function(){});
}

growl.register(function(err){
  if(err) return;
  notification();
});

