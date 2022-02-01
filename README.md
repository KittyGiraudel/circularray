# Circularray

Portemanteau of “circular array”. Circularray is a fast circular array implementation in JavaScript based on a doubly linked list.

Read a [write up on how it works](https://kittygiraudel.com/2022/02/01/circular-array-in-js/).

## Usage

The concept of “pointer” is important to understand. A circularray a list of nodes that loops on itself, with a node marked as “the pointer.” Inserting nodes and remove nodes is done around that pointer, and that pointer can be moved at will.

In the example below, the pointer is marked in brackets.

```js
const circle = new Circularray([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
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

## Example

A perfect example of when a circular array is handy is for the [Josephus problem](https://en.wikipedia.org/wiki/Josephus_problem).

To put it simply: counting begins at a specified point in the circle and proceeds around the circle in a specified direction (typically clockwise). After a specified number of items are skipped, the next item is removed. The procedure is repeated with the remaining items, starting with the next one, going in the same direction and skipping the same number of items, until only one item remains.

Considering we would skip one item out of 2, this is how it would be implemented. At every iteration, we rotate the circle clockwise by 1 and drop the first one, until we have only one item remaining.

```js
const circle = new Circularray([1, 2, 3, 4, 5, 6, 7, 8, 9])
while (circle.length > 1) circle.rotate(-1).shift()
console.log('Remaining item is', circle.pop()) // 3
```

With an offset of 3:

```js
const circle = new Circularray([1, 2, 3, 4, 5, 6, 7, 8, 9])
while (circle.length > 1) circle.rotate(-2).shift()
console.log('Remaining item is', circle.pop()) // 1
```

With an offset of _half_ the size of the circle (as suggested in [Advent of Code 2016 Day 19](https://adventofcode.com/2016/day/19)):

```js
const circle = new Circularray([1, 2, 3, 4, 5, 6, 7, 8, 9])
// Maintain a second pointer halfway through the circle to avoid having to
// rotate the circle back and forth at every round. Unnecessary for small sets,
// but vital for large ones (like the one in AoC).
let offset = Math.floor(circle.size / 2) - 1
let mirror = circle.pointer
while (offset--) mirror = mirror.next

while (circle.size > 1) {
  mirror = mirror.next
  mirror.remove()
  circle.size--
  if (circle.size % 2 === 0) mirror = mirror.next
  circle.rotate(-1)
}

console.log('Remaining item is', circle.pop()) // 9
```

## Benchmark

| Josephus with k=2 | Circularray | Array |
| :---------------- | :---------- | :---- |
| 10_000 items      | ~10ms       | ~4ms  |
| 100_000 items     | ~25ms       | ~1.8s |
| 500_000 items     | ~100ms      | ~45s  |
| 1_000_000 items   | ~250ms      | ~4mn  |

## Development

```sh
npm i
npm test
```
