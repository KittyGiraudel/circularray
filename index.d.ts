declare namespace Circularray {
  class Node<Type> {
    value: Type
    prev: Node<Type>
    next: Node<Type>

    constructor(value: Type)

    remove(): void
    insertBetween(prev: Node<Type>, next: Node<Type>): void
  }

  export class Circularray<Type> {
    size: number
    pointer: Node<Type>

    constructor(values: Type[])

    get length(): number
    set length(size: number)

    push(value: Type): this
    unshift(value: Type): this
    pop(): Type
    shift(): Type
    rotate(offset: number): this
    toArray(direction?: 'next' | 'prev'): Type[]
  }
}

export = Circularray.Circularray
