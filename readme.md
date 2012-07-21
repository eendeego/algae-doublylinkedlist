# algae doubly linked list

This package implements a simple circular doubly linked list.

The objective of this project is to describe the data structure and it's main operations.

The implementation is as fast as possible without compromising elegance.
It's purpose is not to provide a "better than native" data structure.

[Some benchmarks](http://jsperf.com/algae-linkedlist)

## Usage

### node.js

    var linkedList = require('algae-doublylinkedlist');
    var myList = linkedList.create();
    myList.push(3.1415);
    myList.push(1.618);

### browser

    <script src="algae-doublylinkedlist.js"></script>
    <script>
      var myList = algaeDoublyLinkedList.create();
      myList.push(3.1415);
      myList.push(1.618);
    </script>

## Documentation

This class implements the circular list functionality, and the JS Array's as much as possible.

The main difference from Array's contract is that no function here uses varargs. The added clarity compensates for a little more verbose code.

All functions are documented with their Big O notation weight (cpu and memory if apropriate).

All functions that need to iterate to a specific index use the shortest path by going forward or backward through the list.

### Constructor

    create([array])

Complexity: O(array.length)

Creates a list with the same elements as the passed array.

### Properties

    isArray()

Complexity: O(1)

Returns ```false```.

    isList()

Complexity: O(1)

Returns ```true```.

    size()
    length

Complexity: O(1)

Returns the list's element count.

    isEmpty()

Complexity: O(1)

Returns ```true``` if the list has no elements.

    get(index)

Complexity: O(size/2); index < size / 2 ? Θ(index) : Θ(size-index) [index here is the actual absolute index]

Returns element at index ```index``` of the list. Use a negative ```index``` to start from the right.

Fetching an index outside the list results in ```undefined```.

    first()
    last()
    second()
    penultimate()

Complexity: O(1)

Returns _nth_ list element.

Fetching an from a list with insufficient elements results in ```undefined```.

### Mutators

(TO DO)

### Accessor

(TO DO)

### Iteration

(TO DO)

## Who
algae-doublylinkedlist is a project by [Luis Reis](https://twitter.com/luismreis), with support from [other awesome people](https://github.com/luismreis/algae-doublylinkedlist/graphs/contributors)

## LICENSE
(The MIT License)

Copyright (c) 2010 Luis Reis

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.