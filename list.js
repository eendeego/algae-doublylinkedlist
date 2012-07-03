// algae-doublylinkedlist (C) Luis Reis and others

"use strict";

// http://caolanmcmahon.com/posts/writing_for_node_and_the_browser
(function(exports) {

  exports.create = function create(array) {
    var head = null;
    var size = 0;

    var list = {
      isEmpty : null,
      size : null,
      length : null,
      toArray : null,
      toReverseArray : null,
      push : null,
      pop : null,
      unshift : null,
      shift : null,
      reverse : null,
      splice : null,
      concat : null,
      prepend : null,
      join : null,
      forEach : null,
      reverseForEach : null
    };

    list.isEmpty = function() {
      return size === 0;
    };

    list.size = function() {
      return size;
    };
    Object.defineProperty(list, 'length', { get: list.size });

    list.toArray = function() {
      var result = new Array(size);
      if (size) {
        var bucket = head;
        var idx = 0;
        do {
          result[idx++] = bucket.target;
          bucket = bucket.next;
        } while(bucket !== head);
      }
      return result;
    };

    list.toReverseArray = function() {
      var result = new Array(size);
      if (size) {
        var bucket = head;
        var idx = 0;
        do {
          bucket = bucket.previous;
          result[idx++] = bucket.target;
        } while(bucket !== head);
      }
      return result;
    };

    list.push = function(element) {
      if (size === 0) {
        head = { previous: null, next: null, target: element };
        head.next = head.previous = head;
      } else {
        var tail = { previous: head.previous, next: head, target: element };
        head.previous.next = tail;
        head.previous = tail;
      }
      size++;
    };

    list.pop = function() {
      if (size === 0) {
        return undefined;
      }

      size--;

      var tail = head.previous;
      tail.previous.next = head;
      head.previous = tail.previous;

      if (size === 0) {
        head = null;
      }

      tail.next = null;
      tail.previous = null;
      return tail.target;
    };

    list.unshift = function(element) {
      if (size === 0) {
        head = { previous: null, next: null, target: element };
        head.next = head.previous = head;
        size++;
      } else {
        head = { previous: head.previous, next: head, target: element };
        head.previous.next = head;
        head.next.previous = head;
      }
    };

    list.shift = function() {
      if (size === 0) {
        return undefined;
      }

      size--;

      var oldHead = head;
      oldHead.previous.next = oldHead.next;
      oldHead.next.previous = oldHead.previous;
      head = head.next;

      if (size === 0) {
        head = null;
      }

      oldHead.next = null;
      oldHead.previous = null;
      return oldHead.target;
    };

    list.reverse = function() {
      if (size <= 1) { // Nothing to do
        return this;
      }

      var bucket = head;
      do {
        var next = bucket.next;

        bucket.next = bucket.previous;
        bucket.previous = next;
        bucket = next;
      } while (bucket !== head);

      head = head.next;

      return this;
    };

    list.concat = function(suffix) {
      if (suffix.length === 0) {
        return this;
      }

      suffix.forEach(function(e) {
        list.push(e);
      });

      return this;
    };

    list.prepend = function(prefix) {
      if (prefix.length === 0) {
        return this;
      }

      prefix.reverseForEach(function(e) {
        list.unshift(e);
      });

      return this;
    };

    list.join = function(separator) {
      if (size === 0) {
        return "";
      }

      if (separator === undefined) {
        separator = ",";
      }

      var buffer = "";

      list.forEach(function(e, i) {
        if (i > 0) {
          buffer = buffer + separator;
        }
        buffer = buffer + e;
      });

      return buffer;
    }

    list.forEach = function(callback, thisArg) {
      // @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/forEach
      if (size === 0) {
        return;
      }

      // if (this == null) {
      //   throw new TypeError( "this is null or not defined" );
      // }

      var O = Object(this);

      if ({}.toString.call(callback) != "[object Function]") {
        throw new TypeError( callback + " is not a function" );
      }

      var T;
      if (thisArg) {
        T = thisArg;
      }

      var k = 0;
      var bucket = head;

      do {
        callback.call(T, bucket.target, k, O);
        bucket = bucket.next;
        k++;
      } while (bucket !== head);
    };

    list.reverseForEach = function(callback, thisArg) {
      // @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/forEach
      if (size === 0) {
        return;
      }

      // if (this == null) {
      //   throw new TypeError( "this is null or not defined" );
      // }

      var O = Object(this);

      if ({}.toString.call(callback) != "[object Function]") {
        throw new TypeError( callback + " is not a function" );
      }

      var T;
      if (thisArg) {
        T = thisArg;
      }

      var k = size - 1;
      var bucket = head.previous;

      do {
        callback.call(T, bucket.target, k, O);
        bucket = bucket.previous;
        k--;
      } while (bucket.next !== head);
    };

    if (array !== undefined && array.length > 0) {
      list.concat(array);
    }

    return list;
  };
})(typeof exports === 'undefined' ? this['algaeDoublyLinkedList']={} : exports);
