import {expect, test} from 'vitest'
import {Scanner} from "../src/parser/scanner";
import {Parser} from "../src/parser/parser";
import {BoxControl} from "../src/controls/box/boxControl";
import {DotControl} from "../src/controls/dot/dotControl";
import {Animate} from "../src/actions/animate";
import {Sign} from "../src/shared/sign";
import {LineControl} from "../src/controls/line/lineControl";
import {Unit} from "../src/shared/unit";

test('parser not null', () => {
    let p = new Scanner()
    expect(p).not.eq(null)
})

test('parser simple', () => {
    let eg1 = ` 
    title: 'sort with bubble sort'
    box id: win at: -260, 0 size: (100, 50) color: rgba(254,193,7,0.6) visible: false
    dots ids: 1 2 3 5 4 6 at: [-3, 0] size: 20 span: 2
    step: '(0) This is step zero ' duration: 750
    2 -> +(50,250)
    2 -> +(200,-250)
    step: '(1) select first two numbers'  duration: 2750
    win <- visible: true,  win -> +(110,0)
    2 <-> 1, 1 -> +(0,100)
    step: '(2) swap if left bigger'
    2 <-> 1 // swap dot 2 with 1
    2 -> +(50,0)
    step: '(3) select next two numbers'
    win -> +(50,0) // move window by 50px right
    step: '(4) ignore if left is smaller'
    win -> +(50,0)
    step: '(4) again swap if left bigger'
    5 <-> 3
    step: '(5) bla bla'
    win -> +(50,0)
    step: 'repeat from start'
    win -> -(150,0)
`
    let p = new Parser()
    const model = p.parse(eg1)
    expect(model).not.eq(null)
})

test('parse points', () => {
    let eg1 = `     
    line id: l at: -50, 10 end: 100, 50 
    dot id: d1 at: -[5, 1] end: [0, 7]
`
    let p = new Parser()
    const model = p.parse(eg1)
    expect(model).not.eq(null)
    const line = model.controls[0] as LineControl
    expect(line.position.x).eq(-50)
    expect(line.position.y).eq(10)
    expect(line.end.x).eq(100)
    expect(line.end.y).eq(50)
    expect(line.position.sign).eq(Sign.NONE)
    expect(line.position.unit).eq(Unit.PIXEL)

    const dot = model.controls[1] as DotControl
    expect(dot.position.x).eq(250)
    expect(dot.position.y).eq(50)
    expect(dot.position.unit).eq(Unit.PIXEL)
})


test('parser dots', () => {
    let code = ` 
    title: 'dots just dots'
    box id: txt  text: '(1) select first two numbers' at: -150, 40 size: (260, 80) visible: false
    dots ids: 1 2 3 5 4 at: -70, 0 size: 20 layout: row
    dot id: 6 at: -70, 50 size: 20
    line at: 30, 0 end: 89,90
    step:
    5 <-> 3
    txt <- text: 'repeat from start' visible: true, 2 -> -(150,0)
`
    let p = new Parser()
    const model = p.parse(code)
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
    step: 'oh my' duration: 2s 
    req ->  +(480,0), CLIENT <- 'zupa'
    res ->  -(480,0)
    step: 'this takes 400ms' duration: 400ms
    camera -> +(0,150), FIN <- visible: true
`
    let p = new Parser()
    const model = p.parse(eg1)
    expect(model).not.eq(null)
})


test('just title', () => {
    let eg1 = `title: zoo`
    let p = new Parser()
    const model = p.parse(eg1)
    expect(model).not.eq(null)
    expect(model.steps.length).eq(0)
})


test('relative and absolute moves', () => {
    let eg1 = ` 
title: 'dot color and size'
dot id: d1  text: 'dot' at: [-3,-1] size: 35
step: 'move dot by 4 cells right'
d1 -> +[4,0]
d1 ->  [0,0]
`
    let p = new Parser()
    const model = p.parse(eg1)
    expect(model).not.eq(null)
    expect(model.steps.length).eq(1)
})


test('absolute move with cell unit', () => {
    let eg1 = ` 
dot id: black text: '[-4,-2]' color: black at: [-4, -2] fontSize: 8
title: 'grid cell units'
step: 'move black do to [0,0]'
black <- '[0,0]', black -> [0,0]
`
    let p = new Parser()
    const model = p.parse(eg1)
    expect(model).not.eq(null)
    expect(model.steps.length).eq(1)
})

test('parse controls and actions', () => {
    let eg1 = ` 
title: 'This is string'
box id: b1 text: 'box' color: rgba(223,123,8,0.68) at: -150, 30 size: (100, 50)
dot text: '1' color: purple at: (250, 20) radius: 55
dot text: '2' color: red at: (250, 20) radius: 20
step:
b1 <- selected: true text: 'zumba'
b1 *-> b2
step:
b1 <-> 1, 2 -> -(50, -45)
step:
1 <-> b1, 2 -> (67,80)
step:
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
    expect(dot.radius).eq(55)
    expect(dot.position.x).eq(250)
    expect(dot.position.y).eq(20)

    expect(model.steps.length).eq(4)
    expect(model.steps[2].sequences[0].actions.length).eq(2)

    const moveAction = model.steps[2].sequences[0].actions[1] as Animate
    expect(moveAction).not.eq(null)
    expect(moveAction.end.sign).eq(Sign.NONE)
})


test('new steps', () => {
    let eg1 = ` 
    title: sort with bubble sort
    box id: win at: -255, -25 size: (100, 50) color: rgba(254,193,7,0.6) visible: false
    dots ids: 1 2 3 5 4 at: -120, 0 size: 20
    step: '(1) select first two numbers'
    win <- visible: true,  win -> +(110,0),
    2 <-> 1, 1 -> +(0,100)
    step: '(2) swap if left bigger'
    2 <-> 1 // swap dot 2 with 1
    step: '(3) select next two numbers'
    win -> +(50,0) // move window by 50px right
    step: '(4) ignore if left is smaller'
    win -> +(50,0)
    step: '(4) again swap if left bigger'
    5 <-> 3
    step: '(5) bla bla'
    win -> +(50,0)
    step: 'repeat from start'
    win -> -(150,0)
`
    let p = new Parser()
    const model = p.parse(eg1)
    expect(model).not.eq(null)
})


test('assign black after visible', () => {
    let eg1 = ` 
    title: 'move me'
    dot id: or at: [-5.5, 1] visible: false color: black
    step: 'move'
    or -> -(150,0)`

    let p = new Parser()
    const model = p.parse(eg1)
    expect(model).not.eq(null)
})


test('complex example', () => {
    let eg1 = ` 
    title: 'Event driven communication'
    boxes ids: 'basket' 'order' 'payment' 'shipping' at: [-6,0] size: [2,2] span: 1
    line at: [-7,-1] end: [6, -1] width: 2
    line at: [-5,-1] end: [-5, 0] width: 2
    line at: [-2,-1] end: [-2, 0] width: 2
    line at: [1,-1] end: [1, 0] width: 2
    line at: [4,-1] end: [4, 0] width: 2
    box: 'event broker' at: [-7, -2] size: [3,1] color: white
    dot id: or at: [-5.5, 1] visible: false color: black
    dot id: ov at: [-2.5,1] visible: false color: black
    dot id: pr at: [0.5,1] visible: false color: black
    dot id: pc at: [0.5,1] visible: false color: black
    dot id: os at: [3.5,1] visible: false color: black
    step: '(1) order requested'
    or <- visible: true, or -> -[0,2.5]
    or -> +[3,0]
    or ->  +[0,2.5]
    or <- color: orange
    step: '(2) order validated'
    or <- visible: false
    ov <- visible: true, ov -> -[0,2.5]
    ov *-> ov1
    ov -> -[3,0], ov1 -> +[3,0]
    ov -> +[0,2.5], ov1 -> +[0,2.5]
    step: '(3) payment requested'
    ov1 <- visible: false, ov <- visible: false, pr <- visible: true
    pr -> -[0,2.5]
    pr -> -[6,0]
    pr -> +[0,2.5]
    step: '(4) payment confirmed'
    pr <- visible: false, pc <- visible: true
    pc -> -[0,2.5]
    pc *-> pc1
    pc -> -[3,0], pc1 -> +[3,0]
    pc -> +[0,2.5], pc1 -> +[0,2.5]
    step: '(5) order shipped'
    pc <- visible: false, pc1 <- visible: false, os <- visible: true
    os -> -[0,2.5]
    os -> -[6,0]
    os -> +[0,2.5]
    `

    let p = new Parser()
    const model = p.parse(eg1)
    expect(model).not.eq(null)
})

test('sequential example', () => {
    let eg1 = ` 
    title: 'Event driven communication 1'
    boxes ids: 'basket' 'order' 'payment' 'shipping' at: [-6,0] size: [2,2] span: 1
    line at: [-7,-1] end: [6, -1] width: 2
    line at: [-5,-1] end: [-5, 0] width: 2
    line at: [-2,-1] end: [-2, 0] width: 2
    line at: [1,-1] end: [1, 0] width: 2
    line at: [4,-1] end: [4, 0] width: 2
    box: 'event broker' at: [-7, -2] size: [3,1] color: white
    dot id: or at: [-5.5, 1] visible: false color: black
    dot id: ov at: [-2.5,1] visible: false color: black
    dot id: pr at: [0.5,1] visible: false color: black
    dot id: pc at: [0.5,1] visible: false color: black
    dot id: os at: [3.5,1] visible: false color: black
    step: '(1) order requested'
    or <- visible: true, or -> -[0,2.5]
    or -> +[3,0]
    or ->  +[0,2.5]
    or <- color: red
    `
    let p = new Parser()
    const model = p.parse(eg1)
    expect(model).not.eq(null)
})

