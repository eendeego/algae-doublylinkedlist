var tap  = require('tap');
var ll = require('../list')

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

tap.test("concatenating lists", function(t) {
  t.equivalent(ll.create([]    ).concat(ll.create([]    )).toArray(),
               []);
  t.equivalent(ll.create([]    ).concat(ll.create([1]   )).toArray(),
               [1]);
  t.equivalent(ll.create([1]   ).concat(ll.create([]    )).toArray(),
               [1]);
  t.equivalent(ll.create([1]   ).concat(ll.create([2]   )).toArray(),
               [1, 2]);
  t.equivalent(ll.create([1, 2]).concat(ll.create([3, 4])).toArray(),
               [1, 2, 3, 4]);

  t.end();
});

tap.test("concatenating lists with arrays", function(t) {
  t.equivalent(ll.create([]    ).concat([]    ).toArray(), []);
  t.equivalent(ll.create([]    ).concat([1]   ).toArray(), [1]);
  t.equivalent(ll.create([1]   ).concat([]    ).toArray(), [1]);
  t.equivalent(ll.create([1]   ).concat([2]   ).toArray(), [1, 2]);
  t.equivalent(ll.create([1, 2]).concat([3, 4]).toArray(), [1, 2, 3, 4]);

  t.end();
});

tap.test("prepending lists", function(t) {
  t.equivalent(ll.create([]).prepend(ll.create([])).toArray(), []);
  t.equivalent(ll.create([]).prepend(ll.create([1])).toArray(), [1]);
  t.equivalent(ll.create([1]).prepend(ll.create([])).toArray(), [1]);
  t.equivalent(ll.create([1]).prepend(ll.create([2])).toArray(), [2, 1]);
  t.equivalent(ll.create([1, 2]).prepend(ll.create([3, 4])).toArray(), [3, 4, 1, 2]);
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
