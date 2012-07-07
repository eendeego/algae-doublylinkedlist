// algae-doublylinkedlist (C) Luis Reis and others

"use strict";

// http://caolanmcmahon.com/posts/writing_for_node_and_the_browser
(function(exports) {
  function isArray(o) {
    return Object.prototype.toString.apply(o) === '[object Array]';
  }

  function isList(o) {
    return o.isList && o.isList();
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

      rotateLeft : null, // TODO
      rotateRight : null, // TODO

      // Accessor methods
      concat : null,
      prepend : null,

      indexOf : null, // TODO
      lastIndexOf : null, // TODO

      slice : null, // TODO
      toArray : null,
      toReverseArray : null,

      join : null,
      toString : null, // TODO

      // Iteration methods
      forEach : null,
      reverseForEach : null

      map : null, // TODO
      reduce : null, // TODO
      reduceRight : null, // TODO

      some : null, // TODO
      every : null, // TODO

      filter : null, // TODO
    };

    list.isEmpty = function() {
      return size === 0;
    };

    list.size = function() {
      return size;
    };
    Object.defineProperty(list, 'length', { get: list.size });

    list.isArray = function() {
      return false;
    }

    list.isList = function() {
      return true;
    }

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

    list.splice = function(index, howMany, newElements) {
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
        } while(i < index && bucket !== head);
      } else if (index < 0) {
        do {
          bucket = bucket.previous;
          i--;
        } while(i > index && bucket !== head);
      }

      var resultHead = i === size ? null : bucket;

      var previous = bucket.previous;
      if (howMany !== 0) {
        var resultSize;
        if (howMany === undefined) {
          bucket = head;
          resultSize = size-i;
        } else {
          i = 0;
          do {
            bucket = bucket.next;
            i++;
          } while(i < howMany && bucket !== head);
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
        newElements.forEach(function(e) {
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
    }

    list.concat = function(suffix) {
      var newList = createFromBucketChain(duplicateBucketChain(head), size);

      newList.concatM(suffix);

      return newList;
    };

    list.concatM = function(suffix) {
      suffix.forEach(function(e) {
        list.push(e);
      });

      return this;
    };

    list.prepend = function(prefix) {
      var newList = createFromBucketChain(duplicateBucketChain(head), size);

      newList.prependM(prefix);

      return newList;
    };

    list.prependM = function(prefix) {
      list.concatM(prefix);

      // LATER Replace with rotateRight(prefix.length)
      for(var i=prefix.length; i>0; i--) {
        head = head.previous;
      }

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

    if (initializer !== undefined) {
      var initialData = initializer(list);

      head = initialData.head;
      if (head !== null) {
        size = initialData.size;
        if (size === undefined) {
          size = 1;
          for (var bucket = head.next; bucket !== head; bucket = bucket.next, size++) ;
        }
      }
    }

    return list;
  }

  function arrayToBucketChain(array) {
    if (array.length === 0) {
      return null;
    }

    var head = { previous: null, next: null, target: array[0] };
    var bucket = head;
    for(var i=1; i<array.length; i++) {
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

    var newHead = { previous: null, next: null, target: head.target };
    var newBucket = newHead;
    for(var bucket = head.next; bucket != head; bucket = bucket.next) {
      newBucket.next = { previous: newBucket, next: null, target: bucket.target };
      newBucket = newBucket.next;
    }

    newHead.previous = newBucket;
    newBucket.next = newHead;

    return newHead;
  }

  function createFromBucketChain(head, size) {
    return create(function (list) {
      return { head: head, size: size };
    });
  }

  exports.create = function(array) {
    if (array === undefined || array.length === 0) {
      return create();
    } else {
      return createFromBucketChain(arrayToBucketChain(array));
    }
  };
})(typeof exports === 'undefined' ? this['algaeDoublyLinkedList']={} : exports);
