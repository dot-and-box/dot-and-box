import {expect, test} from 'vitest'
import {Scanner} from "../src/parser/scanner";
import {Parser} from "../src/parser/parser";
import {BoxControl} from "../src/box/boxControl";

test('parser not null', () => {
    let p = new Scanner()
    expect(p).not.eq(null)
})

test('parser simple', () => {
    let eg1 = ` 
title: 'bubble sort'
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


test('parse box size', () => {
    let eg1 = ` 
title: 'box size'
box:
 name: 'This dds string'
 color: purple
 at: -150, 0
 size: 100, 50
steps:
'2' <-> '1'
'3' <-> '4'
`
    let p = new Parser()
    const model = p.parse(eg1)
    const box = model.controls[0] as BoxControl
    expect(box).not.eq(null)
    expect(box.size.x).eq(100)
    expect(box.size.y).eq(50)
})
