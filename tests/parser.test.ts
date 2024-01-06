import {expect, test} from 'vitest'
import {Scanner} from "../src/parser/scanner";
import {Parser} from "../src/parser/parser";
import {BoxControl} from "../src/box/boxControl";
import {DotControl} from "../src/dot/dotControl";

test('parser not null', () => {
    let p = new Scanner()
    expect(p).not.eq(null)
})

test('parser simple', () => {
    let eg1 = ` 
title: 'bubble sort'
box: 
 text: b1 
 at: -120, -10
 size: 60, 50
box: 
 at: 120, -160
 size: 250, 50
dot:
 text: dt1
 color: orange
 at: -50, 100
 size: 20
dot:
 text: '2'
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


test('parse controls and actions', () => {
    let eg1 = ` 
title: 'This is string'
box:
 id: b1
 text: 'box'
 color: rgba(223,123,8,0.68)
 at: -150, 30
 size: (100, 50)
dot:
 text: '1'
 color: purple
 at: (250, 20)
 size: 55
dot:
 text: '2'
 color: red
 at: (250, 20)
 size: 55
steps:
b1 *-> b2
b1 <-> '1', '2'-> 50, 45
'1' <-> b1, '2' -> (67,80)
`
    let p = new Parser()
    const model = p.parse(eg1)
    const box = model.controls[0] as BoxControl
    expect(box).not.eq(null)
    expect(box.id).eq('b1')
    expect(box.text).eq('box')
    expect(box.size.x).eq(100)
    expect(box.size.y).eq(50)
    expect(box.position.x).eq(-150)
    expect(box.position.y).eq(30)

    const dot = model.controls[1] as DotControl
    expect(dot).not.eq(null)
    expect(dot.size).eq(55)
    expect(dot.position.x).eq(250)
    expect(dot.position.y).eq(20)

    expect(model.steps.length).eq(3)
    expect(model.steps[1].actions.length).eq(2)


})

