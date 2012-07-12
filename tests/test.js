var tap  = require('tap');
var ll = require('../list');

tap.test("new linked list is empty", function(t) {
  var list = ll.create();

  t.equal(list.isEmpty()            , true, "Newly created list should be empty");
  t.equal(list.size()               , 0   , "Newly created list has 0 size");
  t.equal(list.length               , 0   , "Newly created list has 0 length");
  t.equivalent(list.toArray()       , []  , "Empty list converts to an empty array");
  t.equivalent(list.toReverseArray(), []  , "Empty list reverse converts to an empty array");
  t.end();
});

tap.test("creating a list with an array", function(t) {
  var list;

  list = ll.create([]);
  t.equal     (list.isEmpty()       , true);
  t.equivalent(list.toArray()       , []  );
  t.equivalent(list.toReverseArray(), []  );

  list = ll.create([1]);
  t.equal     (list.isEmpty()       , false);
  t.equivalent(list.toArray()       , [1]  );
  t.equivalent(list.toReverseArray(), [1]  );

  list = ll.create([1, 2]);
  t.equal     (list.isEmpty()       , false );
  t.equivalent(list.toArray()       , [1, 2]);
  t.equivalent(list.toReverseArray(), [2, 1]);

  list = ll.create([1, 2, 3]);
  t.equal     (list.isEmpty()       , false    );
  t.equivalent(list.toArray()       , [1, 2, 3]);
  t.equivalent(list.toReverseArray(), [3, 2, 1]);

  t.end();
});

tap.test("pushing elements to the list", function(t) {
  var list = ll.create();

  list.push(1);

  t.equal(false, list.isEmpty());
  t.equivalent(list.toArray()       , [1]);
  t.equivalent(list.toReverseArray(), [1]);

  list.push(2);
  t.equivalent(list.toArray()       , [1, 2]);
  t.equivalent(list.toReverseArray(), [2, 1]);

  list.push(3);
  t.equivalent(list.toArray()       , [1, 2, 3]);
  t.equivalent(list.toReverseArray(), [3, 2, 1]);

  list.push(4);
  t.equivalent(list.toArray()       , [1, 2, 3, 4]);
  t.equivalent(list.toReverseArray(), [4, 3, 2, 1]);

  t.end();
});

tap.test("poping elements from the list", function(t) {
  var list = ll.create([1, 2, 3]);

  var popped = list.pop();

  t.equal(popped, 3);
  t.equivalent(list.toArray()       , [1, 2]);
  t.equivalent(list.toReverseArray(), [2, 1]);

  popped = list.pop();
  t.equal(popped, 2);
  t.equivalent(list.toArray()       , [1]);
  t.equivalent(list.toReverseArray(), [1]);

  popped = list.pop();
  t.equal(popped, 1);
  t.equal(list.isEmpty(), true);
  t.equivalent(list.toArray()       , []);
  t.equivalent(list.toReverseArray(), []);

  popped = list.pop();
  t.equal(popped, undefined);
  t.equal(list.isEmpty(), true);
  t.equivalent(list.toArray()       , []);
  t.equivalent(list.toReverseArray(), []);

  t.end();
});

tap.test("unshifting elements on a list", function(t) {
  var list = ll.create([1, 2, 3]);

  list.unshift(0);

  t.equivalent(list.toArray()       , [0, 1, 2, 3]);
  t.equivalent(list.toReverseArray(), [3, 2, 1, 0]);

  list = ll.create();

  list.unshift(0);

  t.equivalent(list.toArray()       , [0]);
  t.equivalent(list.toReverseArray(), [0]);

  t.end();
});

tap.test("shifting elements from a list", function(t) {
  var list = ll.create([1, 2, 3]);

  var shifted = list.shift();

  t.equal(shifted, 1, 'shift removes the first list element');
  t.equivalent(list.toArray()       , [2, 3]);
  t.equivalent(list.toReverseArray(), [3, 2]);

  list = ll.create([3]);

  var shifted = list.shift();

  t.equal(shifted, 3, 'shift removes a single element');
  t.equivalent(list.toArray()       , []);
  t.equivalent(list.toReverseArray(), []);
  t.end();
});

tap.test("reversing a list", function(t) {
  var testArrays = [[], [1], [1, 2], [1, 2, 3], [1, 2, 3, 4]];

  testArrays.forEach(function(array) {
    t.equivalent(ll.create(array).reverse().toArray(),
                 array.slice(0).reverse(),
                 '[' + array.toString() + '].reverse()');
  });

  t.end();
});

tap.test("splicing a list", function(t) {
  var testArrays = [[], [1], [1, 2], [1, 2, 3], [1, 2, 3, 4]];
  var i;

  // Positive index
  testArrays.forEach(function(array) {
    var sourceList   = ll.create(array);
    var splicedList  = sourceList.splice(1, 2);
    var sourceArray  = array.slice(0);
    var splicedArray = sourceArray.splice(1, 2);

    t.equivalent(sourceList.toArray(),
                 sourceArray,
                 '[' + array.toString() + '].splice(1, 2) (source)');
    t.equivalent(splicedList.toArray(),
                 splicedArray,
                 '[' + array.toString() + '].splice(1, 2)');
  });

  // Negative index
  testArrays.forEach(function(array) {
    var sourceList   = ll.create(array);
    var splicedList  = sourceList.splice(-2, 2);
    var sourceArray  = array.slice(0);
    var splicedArray = sourceArray.splice(-2, 2);

    t.equivalent(sourceList.toArray(),
                 sourceArray,
                 '[' + array.toString() + '].splice(-2, 2) (source)');
    t.equivalent(splicedList.toArray(),
                 splicedArray,
                 '[' + array.toString() + '].splice(-2, 2)');
  });

  // Truncating
  testArrays.forEach(function(array) {
    var sourceList   = ll.create(array);
    var splicedList  = sourceList.splice(1);
    var sourceArray  = array.slice(0);
    var splicedArray = sourceArray.splice(1);

    t.equivalent(sourceList.toArray(),
                 sourceArray,
                 '[' + array.toString() + '].splice(1) (source)');
    t.equivalent(splicedList.toArray(),
                 splicedArray,
                 '[' + array.toString() + '].splice(1)');
  });

  // Inserting (arrays)
  testArrays.forEach(function(array) {
    var sourceList   = ll.create(array);
    var splicedList  = sourceList.splice(1, 0, [5, 6, 7]);
    var sourceArray  = array.slice(0);
    var splicedArray = sourceArray.splice(1, 0, 5, 6, 7);

    t.equivalent(sourceList.toArray(),
                 sourceArray,
                 '[' + array.toString() + '].splice(1, 0, [5, 6, 7]) (source)');
    t.equivalent(splicedList.toArray(),
                 splicedArray,
                 '[' + array.toString() + '].splice(1, 0, [5, 6, 7])');
  });

  // Inserting (lists)
  testArrays.forEach(function(array) {
    var sourceList   = ll.create(array);
    var splicedList  = sourceList.splice(1, 0, ll.create([5, 6, 7]));
    var sourceArray  = array.slice(0);
    var splicedArray = sourceArray.splice(1, 0, 5, 6, 7);

    t.equivalent(sourceList.toArray(),
                 sourceArray,
                 '[' + array.toString() + '].splice(1, 0, ll.create([5, 6, 7])) (source)');
    t.equivalent(splicedList.toArray(),
                 splicedArray,
                 '[' + array.toString() + '].splice(1, 0, ll.create([5, 6, 7]))');
  });

  // Replacing
  testArrays.forEach(function(array) {
    var sourceList   = ll.create(array);
    var splicedList  = sourceList.splice(1, 2, [5, 6, 7]);
    var sourceArray  = array.slice(0);
    var splicedArray = sourceArray.splice(1, 2, 5, 6, 7);

    t.equivalent(sourceList.toArray(),
                 sourceArray,
                 '[' + array.toString() + '].splice(1, 2, [5, 6, 7]) (source)');
    t.equivalent(splicedList.toArray(),
                 splicedArray,
                 '[' + array.toString() + '].splice(1, 2, [5, 6, 7])');
  });

  t.end();
});

tap.test("concatenating lists", function(t) {
  var testArrays = [[[],[]], [[],[1]], [[1],[]], [[1],[2]], [[1,2],[3,4]]];
  var i;

  testArrays.forEach(function(a) {
    var sourceList  = ll.create(a[0]);
    var concatList  = sourceList.concat(ll.create(a[1]));
    var sourceArray = a[0].slice(0);
    var concatArray = sourceArray.concat(a[1]);

    t.equivalent(sourceList.toArray(), sourceArray,
                 '[' + a[0].toString() + '].concat(' + a[1].toString() + ') (source)');
    t.equivalent(concatList.toArray(), concatArray,
                 '[' + a[0].toString() + '].concat(' + a[1].toString() + ')');
  });

  t.end();
});

tap.test("concatenating lists with Modification", function(t) {
  var testArrays = [[[],[],[]], [[],[1],[1]], [[1],[],[1]],
                    [[1],[2],[1,2]], [[1,2],[3,4],[1,2,3,4]]];
  var i;

  testArrays.forEach(function(a) {
    var sourceList  = ll.create(a[0]).concatM(ll.create(a[1]));

    t.equivalent(sourceList.toArray(), a[2],
                 '[' + a[0].toString() + '].concatM(' + a[1].toString() + ')');
  });

  t.end();
});

tap.test("concatenating lists with arrays with Modification", function(t) {
  var testArrays = [[[],[],[]], [[],[1],[1]], [[1],[],[1]],
                    [[1],[2],[1,2]], [[1,2],[3,4],[1,2,3,4]]];
  var i;

  testArrays.forEach(function(a) {
    var sourceList  = ll.create(a[0]).concatM(a[1]);

    t.equivalent(sourceList.toArray(), a[2],
                 '[' + a[0].toString() + '].concatM(' + a[1].toString() + ')');
  });

  t.end();
});

tap.test("prepending lists", function(t) {
  var testArrays = [[[],[],[]], [[],[1],[1]], [[1],[],[1]],
                    [[1],[2],[2,1]], [[1,2],[3,4],[3,4,1,2]]];
  var i;

  testArrays.forEach(function(a) {
    var sourceList  = ll.create(a[0]);
    var prependList = sourceList.prepend(ll.create(a[1]));

    t.equivalent(sourceList.toArray(), a[0],
                 '[' + a[0].toString() + '].prepend(' + a[1].toString() + ') (source)');
    t.equivalent(prependList.toArray(), a[2],
                 '[' + a[0].toString() + '].prepend(' + a[1].toString() + ')');
  });

  t.end();
});

tap.test("prepending lists with Modification", function(t) {
  var testArrays = [[[],[],[]], [[],[1],[1]], [[1],[],[1]],
                    [[1],[2],[2,1]], [[1,2],[3,4],[3,4,1,2]]];
  var i;

  testArrays.forEach(function(a) {
    var sourceList  = ll.create(a[0]).prependM(ll.create(a[1]));

    t.equivalent(sourceList.toArray(), a[2],
                 '[' + a[0].toString() + '].prependM(' + a[1].toString() + ')');
  });

  t.end();
});

tap.test("prepending lists with arrays with Modification", function(t) {
  var testArrays = [[[],[],[]], [[],[1],[1]], [[1],[],[1]],
                    [[1],[2],[2,1]], [[1,2],[3,4],[3,4,1,2]]];
  var i;

  testArrays.forEach(function(a) {
    var sourceList  = ll.create(a[0]).prependM(a[1]);

    t.equivalent(sourceList.toArray(), a[2],
                 '[' + a[0].toString() + '].prependM(' + a[1].toString() + ')');
  });

  t.end();
});

tap.test("rotating lists to the left", function(t) {
  var testArrays = [[[],2,[]], [[1],1,[1]],
                    [[1,2],1,[2,1]], [[1,2],2,[1,2]], [[1,2],3,[2,1]],
                    [[1,2,3],1,[2,3,1]], [[1,2,3],2,[3,1,2]], [[1,2,3],3,[1,2,3]]];
  var i;

  testArrays.forEach(function(a) {
    var list  = ll.create(a[0]).rotateLeft(a[1]);

    t.equivalent(list.toArray(), a[2],
                 '[' + a[0].toString() + '].rotate(' + a[1].toString() + ')');
  });

  t.end();
});

tap.test("rotating lists to the right", function(t) {
  var testArrays = [[[],2,[]], [[1],1,[1]],
                    [[1,2],1,[2,1]], [[1,2],2,[1,2]], [[1,2],3,[2,1]],
                    [[1,2,3],1,[3,1,2]], [[1,2,3],2,[2,3,1]], [[1,2,3],3,[1,2,3]]];
  var i;

  testArrays.forEach(function(a) {
    var list  = ll.create(a[0]).rotateRight(a[1]);

    t.equivalent(list.toArray(), a[2],
                 '[' + a[0].toString() + '].rotate(' + a[1].toString() + ')');
  });

  t.end();
});

tap.test("finding an element", function(t) {
  var testArrays = [[[],2,undefined], [[1],1, 0], [[1], 1, -1],
                    [[1,2],1,undefined], [[1,2],2,0], [[1,2],3,3],
                    [[1,2],3,-1], [[1,2],3,-3],
                    [[1,2,3],1], [[1,2,3],2,-1], [[1,2,3],2,-2],
                    [[1,2,3],3,undefined]];
  var i;

  testArrays.forEach(function(a) {
    var position = ll.create(a[0]).indexOf(a[1], a[2]);

    t.equivalent(position, a[0].indexOf(a[1], a[2]),
                 '[' + a[0].toString() + '].indexOf(' + a[1] + ',' + a[2] + ')');
  });

  t.end();
});

tap.test("finding an element (right to left)", function(t) {
  var testArrays = [[[],2,undefined], [[1],1, 0], [[1], 1, -1],
                    [[1,2],1,undefined], [[1,2],2,0], [[1,2],3,3],
                    [[1,2],3,-1], [[1,2],3,-3],
                    [[1,2,3],1], [[1,2,3],2,-1], [[1,2,3],2,-2],
                    [[1,2,3],3,undefined]];
  var i;

  testArrays.forEach(function(a) {
    var position = ll.create(a[0]).lastIndexOf(a[1], a[2]);

    t.equivalent(position, a[0].lastIndexOf(a[1], a[2]),
                 '[' + a[0].toString() + '].lastIndexOf(' + a[1] + ',' + a[2] + ')');
  });

  t.end();
});

tap.test("slicin'n'dicin", function(t) {
  var testArrays = [[[],-1], [[],1], [[1], 1],
                    [[1,2],1], [[1,2],2], [[1,2],3],
                    [[1,2],-1], [[1,2],-3],
                    [[1,2,3],1], [[1,2,3],-1], [[1,2,3],-2],
                    [[1,2,3],3], [[1,2,3],1,3], [[1,2,3],-3,3]];

  testArrays.forEach(function(a) {
    var slice = ll.create(a[0]).slice(a[1], a[2]);

    t.equivalent(slice.toArray(), a[0].slice(a[1], a[2]),
                 '[' + a[0].toString() + '].slice(' + a[1] + ',' + a[2] + ')');
  });

  t.end();
});

tap.test("joining a list", function(t) {
  t.equivalent(ll.create([]).join("-"), "");
  var x = ll.create([1]);
  var y = x.join();
  t.equivalent(ll.create([1]).join("-"), "1");
  t.equivalent(ll.create([1, 2]).join("-"), "1-2");
  t.equivalent(ll.create([1, 2, 3]).join("-"), "1-2-3");
  t.equivalent(ll.create([1, 2, 3]).join(), "1,2,3");
  t.end();
});

tap.test("converting to string", function(t) {
  var testArrays = [[], [1, 2], [1, 2, 3],
                    [1, 'a string'], [1, 'a string', { key: 'value'}]];

  testArrays.forEach(function(a) {
    var string = ll.create(a).toString();

    t.equivalent(string, a.toString(),
                 '[' + a.toString() + '].toString()');
  });

  t.end();
});

tap.test("iterating over a list", function(t) {
  var list = ll.create([1, 2, 3]);
  var iterationSequence = [1, 2, 3];
  var iteratedCollection;

  var index = 0;
  list.forEach(function(elt, idx, collection) {
    t.equal(idx, index++);
    t.equal(elt, iterationSequence[idx]);
    t.equal(collection, list);
  });
  t.equal(index, 3);
  t.end();
});

tap.test("reverse iterating over a list", function(t) {
  var list = ll.create([1, 2, 3]);
  var iterationSequence = [1, 2, 3];
  var iteratedCollection;

  var index = 2;
  list.reverseForEach(function(elt, idx, collection) {
    t.equal(idx, index--);
    t.equal(elt, iterationSequence[idx]);
    t.equal(collection, list);
  });
  t.equal(index, -1);
  t.end();
});

tap.test("mapping a list", function(t) {
  var iterationSequence = [1, 2, 3];
  var list = ll.create(iterationSequence);
  var iteratedCollection;

  var that = { test: '123' };

  var index = 0;
  var squares = list.map(function(elt, idx) {
    t.equal(idx, index++, 'iteration index');
    t.equal(elt, iterationSequence[idx], 'iteration element');
    t.equal(this, that, 'iteration context (this)');
    return elt * elt;
  }, that);

  t.equal(index, 3, 'list.map result as smae length');
  t.equivalent(squares.toArray(), [1, 4, 9], 'list.map result');

  t.end();
});

tap.test("reducing a list", function(t) {
  var reduceTests = [
      { setup: [[1, 2, 3, 4], 0]     , testLoop: [{p:0,c:1,i:0}, {p:1,c:2,i:1}, {p:3,c:3,i:2}, {p:6,c:4,i:3}], sum: 10 },
      { setup: [[1, 2], 0]           , testLoop: [{p:0,c:1,i:0}, {p:1,c:2,i:1}], sum: 3 },
      { setup: [[1], 0]              , testLoop: [{p:0,c:1,i:0}], sum: 1 },
      { setup: [[], 0]               , testLoop: [], sum: 0 },
      { setup: [[1, 2, 3], undefined], testLoop: [{p:1,c:2,i:1}, {p:3,c:3,i:2}], sum: 6 },
      { setup: [[1, 2], undefined]   , testLoop: [{p:1,c:2,i:1}], sum: 3 },
      { setup: [[1], undefined]      , testLoop: [], sum: 1 },
    ];
  var list;

  reduceTests.forEach(function(iterationSequence, testSet) {
    list = ll.create(iterationSequence.setup[0]);

    var index = 0;
    var outOfBandSum = 0;
    var sum = list.reduce(function(previous, current, idx, context) {
      t.equal(previous, iterationSequence.testLoop[index].p, 'reduce(' + testSet + '): callback (' + index + ') previous parameter')
      t.equal(current , iterationSequence.testLoop[index].c, 'reduce(' + testSet + '): callback (' + index + ') current parameter');
      t.equal(idx     , iterationSequence.testLoop[index].i, 'reduce(' + testSet + '): callback (' + index + ') index parameter');
      t.equal(context , list , 'reduce: callback context (list)');
      index++;
      outOfBandSum += current;
      return previous + current;
    }, iterationSequence.setup[1]);

    t.equal(sum, iterationSequence.sum, 'reduce can calculate sums');
  });

  try {
    ll.create().reduce(function() {});
    t.fail('reducing an empty list should fail.');
  } catch (e) {
    t.type(e, "TypeError", 'reducing an empty list throws type error.');
  }

  t.end();
});

tap.test("right reducing a list", function(t) {
  var reduceTests = [
      { setup: [[1, 2, 3, 4], 0]     , testLoop: [{p:0,c:4,i:3}, {p:4,c:3,i:2}, {p:7,c:2,i:1}, {p:9,c:1,i:0}], sum: 10 },
      { setup: [[1, 2], 0]           , testLoop: [{p:0,c:2,i:1}, {p:2,c:1,i:0}], sum: 3 },
      { setup: [[1], 0]              , testLoop: [{p:0,c:1,i:0}], sum: 1 },
      { setup: [[], 0]               , testLoop: [], sum: 0 },
      { setup: [[1, 2, 3], undefined], testLoop: [{p:3,c:2,i:1}, {p:5,c:1,i:0}], sum: 6 },
      { setup: [[1, 2], undefined]   , testLoop: [{p:2,c:1,i:0}], sum: 3 },
      { setup: [[1], undefined]      , testLoop: [], sum: 1 },
    ];
  var list;

  reduceTests.forEach(function(iterationSequence, testSet) {
    list = ll.create(iterationSequence.setup[0]);

    var index = 0;
    var outOfBandSum = 0;
    var sum = list.reduceRight(function(previous, current, idx, context) {
      t.pass('reduceRight(' + testSet + '): callback (' + index + ')')
      t.equal(previous, iterationSequence.testLoop[index].p, 'reduceRight(' + testSet + '): callback (' + index + ') previous parameter')
      t.equal(current , iterationSequence.testLoop[index].c, 'reduceRight(' + testSet + '): callback (' + index + ') current parameter');
      t.equal(idx     , iterationSequence.testLoop[index].i, 'reduceRight(' + testSet + '): callback (' + index + ') index parameter');
      t.equal(context , list , 'reduceRight: callback context (list)');
      index++;
      outOfBandSum += current;
      return previous + current;
    }, iterationSequence.setup[1]);

    t.equal(sum, iterationSequence.sum, 'reduceRight can calculate sums');
  });

  try {
    ll.create().reduceRight(function() {});
    t.fail('right reducing an empty list should fail.');
  } catch (e) {
    t.type(e, "TypeError", 'right reducing an empty list throws type error.');
  }

  t.end();
});

tap.test("testing for some elements", function(t) {
  var someTests = [
      { setup: [[1, 2, 3, 4], function(e) { return e % 2 === 0 }], testLoop: [{e:1,i:0}, {e:2,i:1}], result: true },
      { setup: [[1, 2, 3, 4], function(e) { return e > 5 }], testLoop: [{e:1,i:0}, {e:2,i:1}, {e:3,i:2}, {e:4,i:3}], result: false },
      { setup: [[], function(e) { return true }, {}], testLoop: [], result: false },
    ];
  var list;

  someTests.forEach(function(iterationSequence, testSet) {
    list = ll.create(iterationSequence.setup[0]);

    var index = 0;
    var result = list.some(function(element, idx, lst) {
      t.equal(element , iterationSequence.testLoop[index].e, 'some(' + testSet + '): callback (' + index + ') element parameter');
      t.equal(idx     , iterationSequence.testLoop[index].i, 'some(' + testSet + '): callback (' + index + ') index parameter');
      t.equal(lst     , list , 'some: callback context (list)');
      if (iterationSequence.setup[2]) {
        t.equal(this, iterationSequence.setup[2], 'some(' + testSet + '): callback (' + index + ') this');
      }
      index++;
      return iterationSequence.setup[1](element, idx, lst);
    }, iterationSequence.setup[2]);

    t.equal(result, iterationSequence.result, 'some result');
  });

  t.end();
});

tap.test("testing for every elements", function(t) {
  var everyTests = [
      { setup: [[4, 3, 2, 1], function(e) { return e % 2 === 0 }], testLoop: [{e:4,i:0}, {e:3,i:1}], result: false },
      { setup: [[1, 2, 3, 4], function(e) { return e < 3 }], testLoop: [{e:1,i:0}, {e:2,i:1}, {e:3,i:2}], result: false },
      { setup: [[1, 2, 3, 4], function(e) { return e < 5 }], testLoop: [{e:1,i:0}, {e:2,i:1}, {e:3,i:2}, {e:4,i:3}], result: true },
      { setup: [[], function(e) { return true }, {}], testLoop: [], result: false },
    ];
  var list;

  everyTests.forEach(function(iterationSequence, testSet) {
    list = ll.create(iterationSequence.setup[0]);

    var index = 0;
    var result = list.every(function(element, idx, lst) {
      t.equal(element , iterationSequence.testLoop[index].e, 'every(' + testSet + '): callback (' + index + ') element parameter');
      t.equal(idx     , iterationSequence.testLoop[index].i, 'every(' + testSet + '): callback (' + index + ') index parameter');
      t.equal(lst     , list , 'every: callback context (list)');
      if (iterationSequence.setup[2]) {
        t.equal(this, iterationSequence.setup[2], 'every(' + testSet + '): callback (' + index + ') this');
      }
      index++;
      return iterationSequence.setup[1](element, idx, lst);
    }, iterationSequence.setup[2]);

    t.equal(result, iterationSequence.result, 'every(' + testSet + '): result');
  });

  t.end();
});
