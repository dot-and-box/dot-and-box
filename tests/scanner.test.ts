import { expect, test } from 'vitest'
import { Scanner } from "../src/parser/scanner";

test('scanner not null', () => {
    let p = new Scanner()
    expect(p).not.eq(null)
})

test('scanner simple', () => {
    let eg1 = `
    title: this is title
    box text: router at: 120, 160  size: 100, 150
    dot text: '2' color: red at: (250, 20) size: 55
    steps:
    '4' <-> '7'
    '1' <-> '2'
    '3' *-> '12'
    '3' +-> +[2,0]
     router <- selected
    '12' -> +(50,-90)
     `
    let p = new Scanner()
    p.scan(eg1)
    console.log(p.tokens)

    expect(p).not.eq(null)
})
