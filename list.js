// algae-doublylinkedlist (C) Luis Reis and others

"use strict";

/*jslint indent: 2, plusplus: true, vars: true */

// http://caolanmcmahon.com/posts/writing_for_node_and_the_browser
(function (exports) {
  function isArray(o) {
    return Object.prototype.toString.apply(o) === '[object Array]';
  }

  function isList(o) {
    return o.isList && o.isList();
  }

  function arrayToBucketChain(array) {
    if (array.length === 0) {
      return null;
    }

    var head = { previous: null, next: null, target: array[0] };
    var bucket = head;
    var i;
    for (i = 1; i < array.length; i++) {
      bucket.next = { previous: bucket, next: null, target: array[i] };
      bucket = bucket.next;
    }

    head.previous = bucket;
    bucket.next = head;

    return head;
  }

  function duplicateBucketChain(head) {
    if (head === null) {
      return null;
    }

    var bucket;
    var newHead = { previous: null, next: null, target: head.target };
    var newBucket = newHead;
    for (bucket = head.next; bucket !== head; bucket = bucket.next) {
      newBucket.next = { previous: newBucket, next: null, target: bucket.target };
      newBucket = newBucket.next;
    }

    newHead.previous = newBucket;
    newBucket.next = newHead;

    return newHead;
  }

  function create(initializer) {
    var head = null;
    var size = 0;

    var list = {
      // Properties
      isEmpty : null,
      size : null,
      length : null,

      isArray : null,
      isList : null,

      // Mutator methods
      push : null,
      pop : null,
      unshift : null,
      shift : null,

      reverse : null,
      splice : null,

      concatM : null,
      prependM : null,

      rotateLeft : null,
      rotateRight : null,

      // Accessor methods
      concat : null,
      prepend : null,

      indexOf : null,
      lastIndexOf : null,

      slice : null,
      toArray : null,
      toReverseArray : null,

      join : null,
      toString : null,

      // Iteration methods
      forEach : null,
      reverseForEach : null,

      map : null,
      reduce : null,
      reduceRight : null, // TODO

      some : null, // TODO
      every : null, // TODO

      filter : null // TODO
    };

    list.isEmpty = function () {
      return size === 0;
    };

    list.size = function () {
      return size;
    };
    Object.defineProperty(list, 'length', { get: list.size });

    list.isArray = function () {
      return false;
    };

    list.isList = function () {
      return true;
    };

    list.toArray = function () {
      var result = new Array(size);
      if (size) {
        var bucket = head;
        var idx = 0;
        do {
          result[idx++] = bucket.target;
          bucket = bucket.next;
        } while (bucket !== head);
      }
      return result;
    };

    list.toReverseArray = function () {
      var result = new Array(size);
      if (size) {
        var bucket = head;
        var idx = 0;
        do {
          bucket = bucket.previous;
          result[idx++] = bucket.target;
        } while (bucket !== head);
      }
      return result;
    };

    list.push = function (element) {
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

    list.pop = function () {
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

    list.unshift = function (element) {
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

    list.shift = function () {
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

    list.reverse = function () {
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

    list.splice = function (index, howMany, newElements) {
      var result;

      if (howMany === 0 || index >= size) {
        result = create();

        if (newElements === undefined) {
          return result;
        }

        if ((isArray(newElements) || isList(newElements)) &&
            newElements.length === 0) {
          return result;
        }
      }

      if (size === 0) {
        if (newElements !== undefined) {
          list.concatM(newElements);
        }
        return create();
      }

      var bucket = head;
      var i = 0;
      if (index > 0) {
        do {
          bucket = bucket.next;
          i++;
        } while (i < index && bucket !== head);
      } else if (index < 0) {
        do {
          bucket = bucket.previous;
          i--;
        } while (i > index && bucket !== head);
      }

      var resultHead = i === size ? null : bucket;

      var previous = bucket.previous;
      if (howMany !== 0) {
        var resultSize;
        if (howMany === undefined) {
          bucket = head;
          resultSize = size - i;
        } else {
          i = 0;
          do {
            bucket = bucket.next;
            i++;
          } while (i < howMany && bucket !== head);
          resultSize = i;
        }

        if (resultHead !== null) {
          bucket.previous.next = resultHead;
          resultHead.previous = bucket.previous;
        }

        result = createFromBucketChain(resultHead, resultSize);

        size -= resultSize;
      }

      if (newElements !== undefined) {
        newElements.forEach(function (e) {
          previous.next = { previous: previous, next: null, target: e };
          previous = previous.next;
        });
        size += newElements.length;
      }
      bucket.previous = previous;
      previous.next = bucket;

      if (index === 0) {
        head = bucket;
      }

      return result;
    };

    list.concat = function (suffix) {
      var newList = createFromBucketChain(duplicateBucketChain(head), size);

      newList.concatM(suffix);

      return newList;
    };

    list.concatM = function (suffix) {
      suffix.forEach(function (e) {
        list.push(e);
      });

      return this;
    };

    list.prepend = function (prefix) {
      var newList = createFromBucketChain(duplicateBucketChain(head), size);

      newList.prependM(prefix);

      return newList;
    };

    list.prependM = function (prefix) {
      list.concatM(prefix).rotateRight(prefix.length);

      return this;
    };

    list.rotateLeft = function (positions) {
      for (positions = positions % size; positions > 0; positions--) {
        head = head.next;
      }
      return this;
    };

    list.rotateRight = function (positions) {
      for (positions = positions % size; positions > 0; positions--) {
        head = head.previous;
      }
      return this;
    };

    list.indexOf = function (searchElement, fromIndex) {
      if (size === 0) {
        return -1;
      }

      var n = fromIndex;
      if (n === undefined || n !== n) {
        n = 0;
      } else if (n !== 0 && n !== Infinity && n !== -Infinity) {
        n = (n > 0 || -1) * Math.floor(Math.abs(n));
      }

      if (n < 0) {
        n = size + n;
      }

      if (n >= size || n < 0) {
        return -1;
      }

      var bucket = head;
      var k;
      if (n < size / 2) {
        k = 0;
        while (k < n) {
          bucket = bucket.next;
          k++;
        }
      } else {
        k = size;
        do {
          bucket = bucket.previous;
          k--;
        } while (k > size + n);
      }

      do {
        if (bucket.target === searchElement) {
          return k;
        }
        bucket = bucket.next;
        k++;
      } while (k < size);

      return -1;
    };

    list.lastIndexOf = function (searchElement, fromIndex) {
      if (size === 0) {
        return -1;
      }

      var n = fromIndex;
      if (n === undefined || n !== n) {
        n = 0;
      } else if (n !== 0 && n !== Infinity && n !== -Infinity) {
        n = (n > 0 || -1) * Math.floor(Math.abs(n));
      }

      if (n < 0) {
        n = size + n;
      }

      if (n >= size || n < 0) {
        return -1;
      }

      var bucket = head;
      var k;
      if (n < size / 2) {
        k = 0;
        while (k < n) {
          bucket = bucket.next;
          k++;
        }
      } else {
        k = size;
        do {
          bucket = bucket.previous;
          k--;
        } while (k > size + n);
      }

      do {
        if (bucket.target === searchElement) {
          return k;
        }
        bucket = bucket.previous;
        k--;
      } while (k >= 0);

      return -1;
    };

    list.slice = function (begin, end) {
      if (size === 0) {
        return create();
      }

      if (begin < 0) {
        begin = size + begin;
        if (begin < 0) {
          begin = 0;
        }
      }

      if (end === undefined) {
        end = size;
      }

      if (begin >= size || begin < 0 || begin === end) {
        return create();
      }

      if (begin === 0 && end === size) {
        return createFromBucketChain(duplicateBucketChain(head), size);
      }

      var bucket = head;
      var k;
      if (begin < size / 2) {
        k = 0;
        while (k < begin) {
          bucket = bucket.next;
          k++;
        }
      } else {
        k = size;
        do {
          bucket = bucket.previous;
          k--;
        } while (k > begin);
      }

      var newHead = { previous: null, next : null, target: bucket.target };
      var newBucket = newHead;
      for (k++; k < end; k++) {
        bucket = bucket.next;
        newBucket.next = { previous: newBucket, next: null, target: bucket.target };
        newBucket = newBucket.next;
      }

      newHead.previous = newBucket;
      newBucket.next = newHead;

      return createFromBucketChain(newHead, end - begin);
    };

    list.join = function (separator) {
      if (size === 0) {
        return "";
      }

      if (separator === undefined) {
        separator = ",";
      }

      var buffer = new Array(size);

      list.forEach(function (e, i) {
        buffer[i] = e;
      });

      return buffer.join(separator);
    };

    list.toString = function () {
      return list.join(',');
    };

    list.forEach = function (callback, thisArg) {
      // @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/forEach
      if (size === 0) {
        return;
      }

      // if (this == null) {
      //   throw new TypeError( "this is null or not defined" );
      // }

      var O = Object(this);

      if ({}.toString.call(callback) !== "[object Function]") {
        throw new TypeError(callback + " is not a function");
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

    list.reverseForEach = function (callback, thisArg) {
      // @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/forEach
      if (size === 0) {
        return;
      }

      // if (this == null) {
      //   throw new TypeError( "this is null or not defined" );
      // }

      var O = Object(this);

      if ({}.toString.call(callback) !== "[object Function]") {
        throw new TypeError(callback + " is not a function");
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

    list.map = function (callback, thisArg) {
      // @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/map
      var T, k, kValue, bucket, newHead, newBucket;

      // if (this == null) {
      //   throw new TypeError("this is null or not defined");
      // }

      if (size === 0) {
        return create();
      }

      if ({}.toString.call(callback) !== "[object Function]") {
        throw new TypeError(callback + " is not a function");
      }

      if (thisArg) {
        T = thisArg;
      }

      bucket = head;
      k = 0;
      kValue = bucket.target;
      newHead = { previous: null, next: null, target: callback.call(T, kValue, k, list) };
      newBucket = newHead;
      bucket = bucket.next;

      while (bucket !== head) {
        k++;
        kValue = bucket.target;
        newBucket.next = { previous: newBucket, next: null, target: callback.call(T, kValue, k, list) };
        newBucket = newBucket.next;
        bucket = bucket.next;
      }

      newBucket.next = newHead;
      newHead.previous = newBucket;

      return createFromBucketChain(newHead, size);
    };

    list.reduce = function (accumulator, initialValue) {
      // @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/Reduce
      var i = 0, curr, bucket;

      if (typeof accumulator !== "function") {
        // ES5 : "If IsCallable(callbackfn) is false, throw a TypeError exception."
        throw new TypeError("First argument is not callable");
      }

      bucket = head;

      if (initialValue === undefined) {
        if (size === 0) {
          throw new TypeError("Array length is 0 and no second argument");
        }
        curr = bucket.target;
        i = 1; // start accumulating at the second element
        bucket = bucket.next;
      } else {
        curr = initialValue;
      }

      while (i < size) {
        curr = accumulator.call(undefined, curr, bucket.target, i, list);
        bucket = bucket.next;
        i++;
      }

      return curr;
    };


    if (initializer !== undefined) {
      var initialData = initializer(list);

      head = initialData.head;
      if (head !== null) {
        size = initialData.size;
        if (size === undefined) {
          size = 1;
          var bucket;
          for (bucket = head.next; bucket !== head; bucket = bucket.next) {
            size++;
          }
        }
      }
    }


    return list;
  }

  function createFromBucketChain(head, size) {
    return create(function (list) {
      return { head: head, size: size };
    });
  }

  exports.create = function (array) {
    if (array === undefined || array.length === 0) {
      return create();
    }

    return createFromBucketChain(arrayToBucketChain(array));
  };
})(typeof exports === 'undefined' ? this['algaeDoublyLinkedList']={} : exports);
