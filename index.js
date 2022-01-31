class Node {
  constructor(value) {
    this.value = value
    this.next = this.prev = null
  }

  remove() {
    this.prev.next = this.next
    this.next.prev = this.prev
  }
}

class CircularArray {
  size = 0
  pointer = null

  constructor(values = []) {
    if (Array.isArray(values)) values.forEach(value => this.push(value))
    else this.push(values)
  }

  set length(n) {
    if (n < 0) {
      throw new Error(`Invalid negative length ${n} for CircularArray.`)
    }

    // Shortcut for `.length = 0` usages where the goal is to empty the array.
    if (n === 0) {
      this.pointer = null
      this.size = 0
    } else {
      // If the new length is less than half the previous one, iterating from
      // the beginning of the array is faster than popping from the end.
      if (n < this.size / 2) {
        let curr = this.pointer
        for (let i = 0; i < n - 1; i++) curr = curr.next
        curr.next = this.pointer
        this.pointer.prev = curr
        this.size = n
      } else {
        let diff = this.size - n
        while (diff--) this.pop()
      }
    }
  }

  get length() {
    return this.size
  }

  push(value) {
    const node = new Node(value)

    this.size++

    if (!this.pointer) {
      node.next = node.prev = this.pointer = node
    } else {
      node.next = this.pointer
      node.prev = this.pointer.prev
      node.prev.next = node
      this.pointer.prev = node
    }

    return this
  }

  unshift(value) {
    return this.push(value).rotate(+1)
  }

  pop() {
    if (!this.pointer) return undefined

    const value = this.pointer.prev.value

    this.size--

    if (this.size === 0) {
      this.pointer = null
    } else {
      this.pointer.prev.remove()
    }

    return value
  }

  shift() {
    if (!this.pointer) return undefined

    const value = this.pointer.value

    this.size--

    if (this.size === 0) {
      this.pointer = null
    } else {
      // Remove the pointer node, and move the pointer to the right.
      this.pointer.remove()
      this.pointer = this.pointer.next
    }

    return value
  }

  rotate(offset) {
    // Shortcut to avoid rotating full circles.
    offset %= this.size

    // In a clockwise rotation, the current pointer becomes the previous item.
    // [0, 1, 2] -> [2, 0, 1] -> [2, 0, 1]
    //  P        ->     P     ->  P
    if (offset > 0) while (offset--) this.pointer = this.pointer.prev
    // In a counter-clockwise rotation, the current head becomes the next item.
    // [0, 1, 2] -> [1, 2, 0] -> [1, 2, 0]
    //  P        ->        P  ->  P
    else while (offset++) this.pointer = this.pointer.next

    return this
  }

  toArray(direction = 'next') {
    const items = []

    if (!this.size) return items

    let node = this.pointer

    // The list is looped, so we can’t keep iterating until there is no more
    // next node since it never happens. We need to iterate until we find the
    // pointer again — this is when we’ve gone full circle.
    do {
      items.push(node.value)
      node = node[direction]
    } while (!Object.is(node, this.pointer))

    return items
  }
}

module.exports = CircularArray
