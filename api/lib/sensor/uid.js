'use strict';

module.exports = {
  trigger: function(obj, handlers) {
    if (handlers) {
      handlers.forEach(function(handler) {
        handler(obj);
      });
    }
  },
  parse: function(msg, rinfo) {
    return {
      uid: 'A7E3FA13',
      sensor: 1,
    };
  },
};
