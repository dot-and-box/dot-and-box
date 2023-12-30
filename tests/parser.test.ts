import {expect, test} from 'vitest'
import {Scanner} from "../src/parser/scanner";
import {Parser} from "../src/parser/parser";

test('parser not null', () => {
    let p = new Scanner()
    expect(p).not.eq(null)
})

test('parser simple', () => {
    let eg1 = ` 
title: 'bubble sort'
dot:
 name: '99'
 color: purple
 at: 0, 20
 size: 20
box: 
 name: b1 
 at: -120, -10
 size: 60, 50
box: 
 at: 120, -160
 size: 250, 50
dot:
 name: dt1
 color: orange
 at: -50, 100
 size: 20
dot:
 name: '2'
 color: red
 at: 50, 100
 size: 20
steps:
dt1 <-> b1
b1 <-> dt1
b1 -> 34,56
                    `
    let p = new Parser()
    const model = p.parse(eg1)
    expect(model).not.eq(null)
})
