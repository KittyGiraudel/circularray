class Node {
  constructor(value) {
    this.value = value
    this.next = this.prev = null
  }

  // Remove references to the need by attaching its two neighbors together,
  // effectively removing itself from the chain.
  remove() {
    this.prev.next = this.next
    this.next.prev = this.prev
  }

  // Insert the node between the previous and next nodes.
  insertBetween(prev, next) {
    this.next = next
    this.prev = prev
    prev.next = next.prev = this
  }
}

class Circularray {
  size = 0
  pointer = null

  constructor(values = []) {
    if (Array.isArray(values)) values.forEach(value => this.push(value))
    else this.push(values)
  }

  set length(length) {
    if (length < 0) {
      throw new Error(`Invalid negative length ${length} for Circularr.`)
    }

    // Shortcut for `.length = 0` usages where the goal is to empty the array.
    if (length === 0) {
      this.pointer = null
      this.size = 0
    } else {
      // If the new length is less than half the previous one, iterating from
      // the beginning of the array is faster than popping from the end.
      if (length < this.size / 2) {
        let curr = this.pointer
        for (let i = 0; i < length - 1; i++) curr = curr.next
        curr.next = this.pointer
        this.pointer.prev = curr
        this.size = length
      } else {
        let diff = this.size - length
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
      this.pointer = node.next = node.prev = node
    } else {
      node.insertBetween(this.pointer.prev, this.pointer)
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

module.exports = Circularray
