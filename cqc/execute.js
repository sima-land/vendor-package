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

var TYPE_COMMAND = 'command';
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

var Queue =
/*#__PURE__*/
function () {
  /**
   * Instantiate Queue.
   * @param {Function | undefined} putCallback
   */
  function Queue(putCallback) {
    if (putCallback === void 0) {
      putCallback = null;
    }

    _defineProperty(this, "target", void 0);

    _defineProperty(this, "buffer", void 0);

    _defineProperty(this, "length", 0);

    this.target = new EventTarget$1();
    this.buffer = [];
    this.length = this.buffer.length;

    if (putCallback && typeof putCallback === 'function') {
      this.target.addEventListener('put', putCallback);
    }
  }
  /**
   * Add value to queue.
   * @param {*} value
   * @return {number}
   */


  var _proto = Queue.prototype;

  _proto.put = function put(value) {
    var result = this.buffer.push(value);
    this.length = this.buffer.length;
    this.target.dispatchEvent(new CustomEvent$1('put', {
      detail: value
    }));
    return result;
  };
  /**
   * Get value from queue.
   * @return {*}
   */


  _proto.take = function take() {
    var result = this.buffer.shift();
    this.length = this.buffer.length;
    return result;
  };

  return Queue;
}();

var Channel =
/*#__PURE__*/
function () {
  /**
   * Create instance of Channel.
   */
  function Channel(notificator) {
    if (notificator === void 0) {
      notificator = null;
    }

    _defineProperty(this, "puts", void 0);

    _defineProperty(this, "takes", void 0);

    _defineProperty(this, "notificator", void 0);

    if (notificator && notificator instanceof EventTargetTransport) {
      this.notificator = notificator;
    }

    this.puts = new Queue(this._listener.bind(this));
    this.takes = new Queue(this._listener.bind(this));
  }
  /**
   * Send value to channel.
   * @param {*} value
   */


  var _proto = Channel.prototype;

  _proto.put = function put(value) {
    if (value !== undefined) {
      this.puts.put(value);
    }
  };
  /**
   * Take data from channel.
   */


  _proto.take = async function take() {
    var _this = this;

    return new Promise(function (resolve) {
      _this.takes.put(resolve);
    });
  };
  /**
   * Bind puts to takes.
   */


  _proto._listener = function _listener() {
    if (this.takes.length && this.puts.length) {
      var take = this.takes.take();
      var put = this.puts.take();
      take(put);

      if (this.notificator) {
        this.notificator.trigger('change');
      }
    }
  };

  return Channel;
}();

/**
 *
 * @param {*} iterator
 * @param {*} notificator
 * @return {Function}
 */

function channelEmitterCreator(iterator, notificator, onchange) {
  if (onchange === void 0) {
    onchange = null;
  }

  var initialized = false;

  var emitter = async function emitter(onchange) {
    if (onchange === void 0) {
      onchange = null;
    }

    initialized = !initialized ? iterator.next() : initialized;

    if (typeof onchange === 'function') {
      var callback = function callback() {
        return onchange(emitter) ? callback : callback;
      };

      notificator.on('change', callback());
      return emitter;
    }

    return (await iterator.next(initialized)).value;
  };

  return typeof onchange === 'function' ? emitter(onchange) : emitter;
}
/**
 *
 * @param {*} types
 * @param {*} context
 * @return {Function}
 */


function channelCreator(types, context) {
  return function* (type, transport, notificator) {
    var queue = new Channel(notificator);
    type = type === '*' ? types : type;
    type = typeof type === 'string' ? [type] : type;
    Array.isArray(type) && type.every(function (type) {
      return types.includes(type);
    }) && transport.on(type, function (_ref) {
      var action = _ref.detail;

      if (action.context && action.context !== context) {
        queue.put(action);
      }
    });
    var initialized = yield true;

    while (initialized) {
      yield queue.take();
    }
  };
}
/**
 *
 * @param {*} key
 * @param {*} channel
 * @return {Function}
 */

function takeChannelCreator(key, channel) {
  return function (type, onchange) {
    if (type === void 0) {
      type = '*';
    }

    if (onchange === void 0) {
      onchange = null;
    }

    var notificator = new EventTargetTransport();
    var iterator = channel(type, getTransport(key), notificator);
    return channelEmitterCreator(iterator, notificator, onchange);
  };
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

/**
 * Declares a channel for processed commands in the service interface.
 * @param {Array} types Types of processed commands.
 * @param {string} context Application context e.g. Namespace of command.
 * @return {Function} Function for receiving commands from channel.
 */

function execute(types, context) {
  checkArguments([types, context], 'execute', channelCreatorCfg);
  var channel = channelCreator(types, context);
  return takeChannelCreator(TYPE_COMMAND, channel);
}

export default execute;
