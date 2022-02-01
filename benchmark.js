const Circularray = require('.')

const range = (size, startAt = 0) =>
  [...Array(size).keys()].map(i => i + startAt)

const josephusCircularray = size => {
  const circle = new Circularray(range(size, 1))
  while (circle.length > 1) circle.rotate(-1).shift()
  return circle.pop()
}

const josephusArray = size => {
  const circle = range(size, 1)

  while (circle.length > 1) {
    circle.push(circle.shift())
    circle.shift()
  }

  return circle.pop()
}

const measure = (name, fn) => {
  console.time(name)
  fn()
  console.timeEnd(name)
}

const test = size => {
  console.log(`josephus(${size}, 2)`)
  measure('Circularray', () => josephusCircularray(size))
  measure('Array', () => josephusArray(size))
  console.log('')
}

test(10_000)
test(100_000)
test(500_000)
// Really slow… The regular array version takes several minutes.
// test(1_000_000)
