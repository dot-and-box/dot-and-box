import {expect, test} from 'vitest'
import {Scanner} from "../src/parser/scanner";
import {Parser} from "../src/parser/parser";
import {BoxControl} from "../src/controls/box/boxControl";
import {DotControl} from "../src/controls/dot/dotControl";
import {Move} from "../src/actions/move";
import {Sign} from "../src/shared/sign";

test('parser not null', () => {
    let p = new Scanner()
    expect(p).not.eq(null)
})

test('parser simple', () => {
    let eg1 = ` 
    title: sort with bubble sort
    box id: b2  text: '(1) select first two numbers' at: -150, 40 size: (260, 80) visible: false
    box id: b3  text: '' at: -255, -25 size: (100, 50) color: rgba(254,193,7,0.6) visible: false
    dot id: '1' at: -70, 0 size: 20
    dot id: '2' at: -120, 0 size: 20
    dot id: '3' at: 30, 0 size: 20
    dot id: '5' at: -20, 0 size: 20
    dot id: p  text: '4' at: 80, 0 size: 20
    steps:
    b2 <- visible: true, b3 <- visible: true, b3 -> +(110,0)
    b2 <- text: '(2) swap if left bigger than right', 2 <-> 1
    b2 <- text: '(3) select next two numbers', b3 -> +(50,0)
    b2 <- text: 'ignore if left smaller', b3 -> +(50,0)
    b2 <- text: 'again swap if left bigger', 5 <-> 3
    b2 <- visible: false, b3 -> +(50,0)
    5 <-> p
    b2 <- text: 'repeat from start' visible: true, b3 -> -(150,0)
`
    let p = new Parser()
    const model = p.parse(eg1)
    expect(model).not.eq(null)
})


test('assign properties', () => {
    let eg1 = ` 
    title: request response pattern
    box text: 'CLIENT' size: 100,40 at: (-295, -120) color: rgb(187,105,13)
    box text: 'SERVER' size: 100,40 at: 180, -120 color: rgba(5,5,254,0.6)
    box text: '' color: orange size: 100,200 at: -295, -80
    box text: '' color: rgba(5,5,254,0.4) size: (100, 200) at: (180, -80)
    box text: 'FIN' size: 100,40 at: 180, 220 color: rgba(5,5,254,0.6) visible: false
    dot text: 'req' at: -250, -30 size: 35
    dot text: 'res' at: 230, 70 size: 35
    steps:
    CLIENT <-> SERVER
    req ->  +(480,0)
    res ->  -(480,0)
    camera -> +(0,150), FIN <- visible: true
`
    let p = new Parser()
    const model = p.parse(eg1)
    expect(model).not.eq(null)
})


test('parse controls and actions', () => {
    let eg1 = ` 
title: 'This is string'
box id: b1 text: 'box' color: rgba(223,123,8,0.68) at: -150, 30 size: (100, 50)
dot text: '1' color: purple at: (250, 20) size: 55
dot text: '2' color: red at: (250, 20) size: 55
steps:
b1 <- selected: true text: 'zumba'
b1 *-> b2
b1 <-> 1, 2 -> -(50, -45)
1 <-> b1, 2 -> (67,80)
1 -> +(89,90)
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

    expect(model.steps.length).eq(5)
    expect(model.steps[2].actions.length).eq(2)

    const moveAction = model.steps[4].actions[0] as Move
    expect(moveAction).not.eq(null)
    expect(moveAction.end.sign).eq(Sign.PLUS)
})

