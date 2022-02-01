# Circularr

Kind of portemanteau of “circular array” (not quite). Anyway, Circularr is a fast circular array implementation in JavaScript based on a doubly linked list.

Read a [write up on how it works](https://kittygiraudel.com/2022/02/01/circular-array-in-js/).

## Usage

The concept of “pointer” is important to understand. A circularr a list of nodes that loops on itself, with a node marked as “the pointer.” Inserting nodes and remove nodes is done around that pointer, and that pointer can be moved at will.

In the example below, the pointer is marked in brackets.

```js
const circle = new Circularr([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
// -> … 8 9 [0] 1 2 …

// Adding items (front and back)
circle.push(10)
// -> … 8 9 10 [0] 1 2 …
circle.unshift(-1)
// -> … 8 9 10 [-1] 0 1 2 …

// Removing items (front and back)
circle.shift()
// Yields -1 ->  … 8 9 10 [0] 1 2 …
circle.pop()
// Yields 10 -> … 8 9 [0] 1 2 …

// Rotating the circle
circle.rotate(-3)
// -> … 1 2 [3] 4 5 …
circle.rotate(4)
// -> … 7 8 [9] 0 1 …

// Array representation
circle.toArray()
// -> [9, 0, 1, 2, 3, 4, 5, 6, 7, 8]
circle.toArray('prev')
// -> [9, 8, 7, 6, 5, 4, 3, 2, 1], not the same as .reverse()!

// Length reading
circle.length
// -> 5

// Length cutting
circle.length = 5
// -> ↬ 2 3 [9] 0 1 ↫
circle.length = 0
// -> Empty
```

## Development

```sh
npm i
npm test
```
