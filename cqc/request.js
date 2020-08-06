function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

/**
 * EventTarget polyfill.
 */
var EventTarget =
/*#__PURE__*/
function () {
  /**
   * EventTarget polyfill constructor.
   */
  function EventTarget() {
    _defineProperty(this, "listeners", void 0);

    this.listeners = {};
  }
  /**
   * Adds event listener.
   * @param {string} eventName Name of event.
   * @param {Function} listener Event listener.
   */


  var _proto = EventTarget.prototype;

  _proto.addEventListener = function addEventListener(eventName, listener) {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = new Map();
    }

    this.listeners[eventName].set(listener, listener);
  };
  /**
   * Removes event listener.
   * @param {string} eventName Name of event.
   * @param {Function} listener Event listener.
   */


  _proto.removeEventListener = function removeEventListener(eventName, listener) {
    if (this.listeners[eventName] instanceof Map) {
      this.listeners[eventName].delete(listener);
    }
  };
  /**
   * Dispatches event.
   * @param {Event} event Event.
   */


  _proto.dispatchEvent = function dispatchEvent(event) {
    if (event instanceof Event) {
      var eventName = event.type;

      if (this.listeners[eventName] instanceof Map) {
        this.listeners[eventName].forEach(function (listener) {
          return listener(event);
        });
      }
    }
  };

  return EventTarget;
}();
/**
 * Choose constructor for EventTarget.
 * @return {Function} EventTarget constructor.
 */

function getEventTargetConstructor() {
  var constructor;

  try {
    new window.EventTarget();
    constructor = window.EventTarget;
  } catch (e) {
    constructor = EventTarget;
  }

  return constructor;
}
var EventTarget$1 = getEventTargetConstructor();

var TYPE_QUERY = 'query';
var IS_BROWSER = typeof window !== 'undefined';

/**
 * CustomEvent constructor.
 * @param {string} event Event type.
 * @param {Object} params Parameters of created event.
 * @param {boolean} params.bubbles Does it bubbles?
 * @param {boolean} params.cancelable Does it cancelable?
 * @param {Object} params.detail Additional data.
 * @return {Event} Event.
 * @constructor
 */

function CustomEvent(event, _temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      bubbles = _ref.bubbles,
      cancelable = _ref.cancelable,
      detail = _ref.detail;

  var evt = document.createEvent('CustomEvent');
  evt.initCustomEvent(event, Boolean(bubbles), Boolean(cancelable), detail);
  var origPrevent = evt.preventDefault;

  evt.preventDefault = function () {
    origPrevent.call(this);

    try {
      Object.defineProperty(this, 'defaultPrevented', {
        /**
         * Getter for 'defaultPrevented' property.
         * @return {boolean} Value of property.
         */
        get: function get() {
          return true;
        }
      });
    } catch (e) {
      this.defaultPrevented = true;
    }
  };

  return evt;
}

if (IS_BROWSER) {
  CustomEvent.prototype = window.Event.prototype;
}
/**
 * Choose constructor for CustomEvent.
 * @return {Function} CustomEvent constructor.
 */


function getCustomEventConstructor() {
  var constructor;

  try {
    new window.CustomEvent('test');
    constructor = window.CustomEvent;
  } catch (e) {
    constructor = CustomEvent;
  }

  return constructor;
}
var CustomEvent$1 = getCustomEventConstructor();

var EventTargetTransport =
/*#__PURE__*/
function () {
  /**
   * Create instance of EventTargetTransport.
   */
  function EventTargetTransport(events) {
    _defineProperty(this, "target", void 0);

    _defineProperty(this, "listeners", void 0);

    _defineProperty(this, "eventQueue", void 0);

    this.listeners = {};
    this.eventQueue = {};
    this.target = new EventTarget$1();

    if (events && typeof events === 'object') {
      for (var type in events) {
        if (typeof events[type] === 'function') {
          this.on(type, events[type]);
        }
      }
    }
  }
  /**
   *
   * @param {string} type
   * @param {Object} payload
   */


  var _proto = EventTargetTransport.prototype;

  _proto.trigger = function trigger(type, payload) {
    if (payload === void 0) {
      payload = {};
    }

    var event = new CustomEvent$1(type, {
      detail: payload
    });

    if (this.listeners[type]) {
      this.target.dispatchEvent(event);
    }

    if (!this.eventQueue[type]) {
      this.eventQueue[type] = [];
    }

    this.eventQueue[type].push(event);
  };
  /**
   *
   * @param {string} type
   * @param {Function} callback
   */


  _proto.on = function on(type, callback) {
    var _this = this;

    type = typeof type === 'string' ? [type] : type;

    if (Array.isArray(type)) {
      type.forEach(function (type) {
        _this.listeners[type] = true;

        _this.target.addEventListener(type, callback);

        if (_this.eventQueue[type] && _this.eventQueue[type].length) {
          _this.eventQueue[type].forEach(function (event) {
            callback(event);
          });
        }
      });
    }
  };

  return EventTargetTransport;
}();

/**
 *
 * @param {Function} type
 * @return {EventTargetTransport}
 */

function getTransport(type) {
  var globalThis = IS_BROWSER ? window : global;

  if (typeof globalThis.CQChannels === 'undefined') {
    globalThis.CQChannels = {};
  }

  if (typeof globalThis.CQChannels[type] === 'undefined') {
    globalThis.CQChannels[type] = new EventTargetTransport();
  }

  return globalThis.CQChannels[type];
}

/**
 *
 * @param {Array} args
 * @param {Object} conf
 */
function checkArguments(args, functionName, conf) {
  conf = getCfgCreator(functionName, conf)(args);
  Array.from(args).forEach(function (arg, index) {
    var argCheckConfList = conf[index];

    if (argCheckConfList && argCheckConfList instanceof Array) {
      argCheckConfList.forEach(function (argCheckConf) {
        if (typeof argCheckConf === 'object' && argCheckConf.validator instanceof Function && argCheckConf.error instanceof Error) {
          if (!argCheckConf.validator(arg, args)) {
            throw argCheckConf.error;
          }
        }
      });
    }
  });
}
/**
 *
 * @param {string} functionName
 * @param {Function} creator
 * @return {Function}
 */

function getCfgCreator(functionName, creator) {
  return function (args) {
    return creator(functionName, args);
  };
}

/**
 * Creates configuration for checking channelCreator arguments.
 * @param {string} functionName Name of function.
 * @param {Array} args Function arguments.
 * @return {Array<Object>} Checking configuration.
 */
var channelCreatorCfg = function channelCreatorCfg(functionName, args) {
  return [[{
    validator: function validator(argument, list) {
      return list && list.length && list.length >= 1;
    },
    error: new TypeError("Failed to execute '" + functionName + "': 2 arguments required, but only " + args.length + " present.")
  }, {
    validator: function validator(argument) {
      return Array.isArray(argument) && argument.length;
    },
    error: new TypeError("Failed to execute '" + functionName + "': first argument must be an Array with at least one element.")
  }], [{
    validator: function validator(argument, list) {
      return list && list.length && list.length === 2;
    },
    error: new TypeError("Failed to execute '" + functionName + "': 2 arguments required, but " + args.length + " present.")
  }, {
    validator: function validator(argument) {
      return typeof argument === 'string';
    },
    error: new TypeError("Failed to execute '" + functionName + "': second argument must be a string.")
  }]];
};
var requestChannelCfg = function requestChannelCfg(functionName, args) {
  return [[{
    validator: function validator(argument, list) {
      return list && list.length && list.length >= 1;
    },
    error: new TypeError("Failed to execute '" + functionName + "': 2 arguments required, but " + args.length + " present.")
  }, {
    validator: function validator(argument) {
      return typeof argument === 'object' && typeof argument.type === 'string';
    },
    error: new TypeError("Failed to execute '" + functionName + "': first argument must be an Object with defined property type.")
  }], [{
    validator: function validator(argument, list) {
      return list && list.length && list.length === 2;
    },
    error: new TypeError("Failed to execute '" + functionName + "': 2 arguments required, but " + args.length + " present.")
  }, {
    validator: function validator(argument) {
      return typeof argument === 'number' && argument > 0;
    },
    error: new TypeError("Failed to execute '" + functionName + "': second argument must be a positive number")
  }]];
};

/**
 * Declares a channel for sent queries in the service interface.
 * @param {Array} types Types of queries for sending.
 * @param {string} context Application context e.g. Namespace of command.
 * @return {Function} Function for sending queries to channel.
 */

function request(types, context) {
  checkArguments([types, context], 'request', channelCreatorCfg);
  return async function (query, time) {
    if (time === void 0) {
      time = 200;
    }

    checkArguments([query, time], 'requestChannel', requestChannelCfg);

    if (!types.includes(query.type)) {
      throw new TypeError('Trying to send query with type not in interface.');
    }

    query = _objectSpread({}, query, {
      context: context
    });
    return await new Promise(function (_resolve, reject) {
      var timeout = setTimeout(function () {
        reject('Time to answer exhausted.');
      }, time);
      getTransport(TYPE_QUERY).trigger(query.type, _objectSpread({}, query, {
        resolve: function resolve(value) {
          clearTimeout(timeout);
          return _resolve(value);
        }
      }));
    });
  };
}

export default request;
