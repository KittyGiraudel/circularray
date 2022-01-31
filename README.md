# Circularr

Kind of portemanteau of “circular array” (not quite). Anyway, Circularr is a fast circular array implementation in JavaScript based on a doubly linked list.

Read a [write up on how it works](https://kittygiraudel.com/2022/02/01/circular-array-in-js/).

```js
const circle = new Circularr([0, 1, 2, 3, 4])

// Adding items (front and back)
circle.unshift(-1)
circle.push(5)

// Removing items (front and back)
circle.pop() // 5
circle.shift() // -1

// Rotating the circle
circle.rotate(-3) // Reorders as: 3, 4, 0, 1, 2
circle.rotate(4) // Reorders as: 4, 0, 1, 2, 3

// Array representation
circle.toArray() // [4, 0, 1, 2, 3]
circle.toArray('prev') // [4, 3, 2, 1, 0], not the same as .reverse()

// Length reading
circle.length // 5

// Length cutting
circle.length = 3 // [3, 2, 1]
circle.length = 0 // Empty
```

## Development

```sh
npm i
npm test
```
