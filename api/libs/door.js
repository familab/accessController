var gpio = require('rpi-gpio'),
    config = require('./config');

module.exports = {
  setup: function(cb) {
    gpio.setup(config.door.pin, gpio.DIR_OUT, cb);
  },
  open: function(cb) {
    gpio.write(config.door.pin, true, function(err) {
      if (err) throw err;
      console.log('Open door');
      setTimeout(function() {
        gpio.write(config.door.pin, false, function(err) {
            if (err) throw err;
            console.log('Close door');
        });
      }, config.door.delay);
    });
    if(cb) cb();
  }
}
