const test = require('ava')
const Circularr = require('.')

const range = (size, startAt = 0) =>
  [...Array(size).keys()].map(i => i + startAt)

test('Circularr - Empty', t => {
  const a = new Circularr()
  t.is(a.pointer, null)
  t.is(a.size, 0)
})

test('Circularr - Single node (init)', t => {
  const a = new Circularr(0)
  t.is(a.pointer, a.pointer.prev)
  t.is(a.pointer, a.pointer.next)
  t.is(a.size, 1)
})

test('Circularr - Length (read)', t => {
  const a = new Circularr([1, 0])

  t.is(a.length, 2)
  a.push(1)
  t.is(a.length, 3)
  a.pop()
  a.pop()
  t.is(a.length, 1)
  a.shift()
  t.is(a.length, 0)
})

test('Circularr - Length (write)', t => {
  const a = new Circularr([1, 0])

  a.length = 0
  t.is(a.length, 0)
  t.is(a.pointer, null)

  range(10).forEach(n => a.push(n))
  a.length = 7
  t.is(a.pointer.prev.value, 6)
  t.is(a.toArray().length, 7)
  a.length = 0
  range(10).forEach(n => a.push(n))
  a.length = 3
  t.is(a.pointer.prev.value, 2)
  t.is(a.toArray().length, 3)
})

test('Circularr - Push', t => {
  const a = new Circularr()
  a.push(0)
  t.is(a.pointer.value, 0)
  a.push(1)
  t.is(a.pointer.value, 0)
  a.push(2)
  t.is(a.pointer.value, 0)
  t.deepEqual(a.toArray(), [0, 1, 2])
})

test('Circularr - Unshift', t => {
  const a = new Circularr()
  a.unshift(0)
  t.is(a.pointer.value, 0)
  t.deepEqual(a.toArray(), [0])
  a.unshift(1)
  t.is(a.pointer.value, 1)
  t.deepEqual(a.toArray(), [1, 0])
  a.unshift(2)
  t.is(a.pointer.value, 2)
  t.deepEqual(a.toArray(), [2, 1, 0])
})

test('Circularr - Pop', t => {
  const a = new Circularr([0, 1, 2])
  t.is(a.pop(), 2)
  t.is(a.pop(), 1)
  t.is(a.pop(), 0)
  t.is(a.pop(), undefined)
})

test('Circularr - Shift', t => {
  const a = new Circularr([0, 1, 2])
  t.is(a.shift(), 0)
  t.is(a.shift(), 1)
  t.is(a.shift(), 2)
  t.is(a.shift(), undefined)
})

test('Circularr - Rotate', t => {
  const a = new Circularr([0, 1, 2])
  t.deepEqual(a.rotate(0).toArray(), [0, 1, 2]) // Noop
  t.deepEqual(a.rotate(1).toArray(), [2, 0, 1])
  t.deepEqual(a.rotate(2).toArray(), [0, 1, 2])
  t.deepEqual(a.rotate(3).toArray(), [0, 1, 2]) // Noop
  t.deepEqual(a.rotate(4).toArray(), [2, 0, 1]) // =+1
  t.deepEqual(a.rotate(-1).toArray(), [0, 1, 2])
  t.deepEqual(a.rotate(-3).toArray(), [0, 1, 2]) // Noop
  t.deepEqual(a.rotate(-2).toArray(), [2, 0, 1])
  t.deepEqual(a.rotate(-4).toArray(), [0, 1, 2]) // =-1
})

test('Circularr — Example', t => {
  const circle = new Circularr([0, 1, 2, 3, 4])

  // Adding items (front and back)
  circle.unshift(-1)
  t.is(circle.pointer.value, -1)
  circle.push(5)
  t.is(circle.length, 7)

  // Removing items (front and back)
  t.is(circle.pop(), 5)
  t.is(circle.shift(), -1)
  t.is(circle.length, 5)

  // Rotating the circle
  circle.rotate(-3)
  t.deepEqual(circle.toArray(), [3, 4, 0, 1, 2])
  circle.rotate(4)
  t.deepEqual(circle.toArray(), [4, 0, 1, 2, 3])

  // Array representation
  t.deepEqual(circle.toArray('prev'), [4, 3, 2, 1, 0])

  // Length reading
  t.is(circle.length, 5)

  // Length cutting
  circle.length = 3
  t.is(circle.length, 3)
  circle.length = 0
  t.is(circle.length, 0)
})

test('Circularr — Josephus', t => {
  const circle = new Circularr([1, 2, 3, 4, 5, 6, 7, 8, 9])

  while (circle.length > 1) {
    circle.rotate(-1).shift()
  }

  t.is(circle.pop(), 3)
})

test('Circularr — AoC 2017 Day 17', t => {
  const memory = new Circularr(0)

  for (let i = 1; i <= 2017; i++) memory.rotate(-394).push(i)

  t.is(memory.shift(), 926)
})

test('Circularr — AoC 2018 Day 09', t => {
  const run = (players, marbles) => {
    const scores = Array.from({ length: players }).map(() => 0)
    const circle = new Circularr(0)

    for (let marble = 1; marble <= marbles; marble++) {
      if (marble % 23 === 0) {
        circle.rotate(7)
        scores[marble % players] += marble + circle.pop()
        circle.rotate(-1)
      } else {
        circle.rotate(-1).push(marble)
      }
    }

    return Math.max(...scores)
  }

  t.is(run(468, 71010), 374287)
  t.is(run(468, 71010 * 100), 3083412635)
})
