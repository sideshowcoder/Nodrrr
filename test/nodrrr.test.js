var assert = require('assert'), util = require('util');
// Load the nodrrr module
var nodrrr = require('../lib/nodrrr');

// Tests
module.exports = {	
  
  'test nodrrr defaults': function(){
    var expected = {
      growl_port: 9887, // growl default port
      growl_protocol_version: 1, // Used growl protocol version
      growl_type_registration: 0, // ID used for registration packet
      host: '127.0.0.1', // default to localhost
      app: 'nodrrr', // default to nodrrr as app name sending notifications
      all_notifies:  ['Nodrrr Growl Notification'],
      default_notifies:  ['Nodrrr Growl Notification']
    };
    var n = new nodrrr.Nodrrr();
    for(var i in expected){
      assert.isDefined(n[i]);      
    }
  },
  
    'test nodrrr config': function(){
      var expected = {
        growl_port: 9886, // growl default port
        growl_protocol_version: 1, // Used growl protocol version
        growl_type_registration: 0, // ID used for registration packet
        host: 'me.local', // default to localhost
        app: 'nodrrr', // default to nodrrr as app name sending notifications
        all_notifies:  ['Nodrrr Growl Notification'],
        default_notifies:  ['Nodrrr Growl Notification'],
        pass: 'abc'
      };
      var opts = {
        growl_port: 9886, // growl default port
        host: 'me.local', // default to localhost
        pass: 'abc'
      };
      var n = new nodrrr.Nodrrr(opts);
      for(var i in expected){
        assert.eql(expected[i], n[i]);      
      }
    },
    
    'test nodrrr arrayPack empty': function(){
      var expected = new Buffer([]),
          array = [],
          fmt = "C",
          n = new nodrrr.Nodrrr();
      n.arrayPack(array, fmt, function(err, res){
        assert.isNull(err);
        assert.eql(expected, res);
      });
    },
    
    'test nodrrr arrayPack fmt': function(){
      var expected = new Buffer([0x00, 0x62, 0x00, 0x01, 0x30]),
          array = ['a','b',1,'0'],
          fmt = 'Canb',
          n = new nodrrr.Nodrrr();
      n.arrayPack(array, fmt, function(err, res){
        assert.isNull(err);
        assert.eql(expected, res);
      });
    },
    
  'test build registration packet': function(){
      var n = new nodrrr.Nodrrr();
   n.build_registration(function(err, res){
     assert.isNull(err);
     assert.isDefined(res);
   });
  },
  
  'test register': function(beforeExit){
    var n = new nodrrr.Nodrrr(), call = 0;
    n.register(function(err){
      assert.isNull(err);
      call = 1;
    });
    beforeExit(function(){
      assert.equal(1, call);
    });
  },
  
  'test notification': function(beforeExit){
    var n = new nodrrr.Nodrrr(), call = 0,
        type = 'Nodrrr Growl Notification',
          title = 'Nodrrr',
          msg =  'Node.js says grrrr',
          prio = 0,
          sticky = false;
      
    n.register(function(err){
      assert.isNull(err);
      n.notify(type, title, msg, prio, sticky, function(err){
        assert.isNull(err);
        call = 1;
      });
    });
    
    beforeExit(function(){
      assert.equal(1, call);
    });
  }
};