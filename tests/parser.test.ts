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
title: Ale heca
box id: b2  at: -140, -100 size: (260, 80)
line id: l at: -140, 90 end: 100, 90 color: gray width: 3
dot id: 1 color: rgba(100,200,50,0.6) at: -100, 0 size: 45
dot id: 2 color: purple at: -150, 0 size: 20
dot id: 3 color: orange at: 0, 0 size: 20 selected: true
dot id: 4 color: gray  at: -50, 0 size: 20 selected: true
dot id: 5 color: rgba(190,0,65,1) at: 50, 0  size: 20
steps:
l -> -(0,140), b2 <- text: 'go back and select different controls or forward', selected0 <-> selected1
b2 <- text: 'first selected control is moved +(20,90)', selected0 -> +(20,90)
5 -> +(50,-50)
5 *-> z1, z1 <- text: '5*', z1 -> -(200,-150)
2 <-> 1
3 <-> 4
4 <-> 5
`
    let p = new Parser()
    const model = p.parse(eg1)
    expect(model).not.eq(null)
})


test('parser dots', () => {
    let code = ` 
    title: 'dots just dots'
    box id: txt  text: '(1) select first two numbers' at: -150, 40 size: (260, 80) visible: false
    dots ids: 1 2 3 5 4 at: -70, 0 size: 20 layout: row
    dot id: 6 at: -70, 50 size: 20
    line at: 30, 0 end: 89,90
    steps:
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
    steps:
    req ->  +(480,0), CLIENT <- 'zupa'
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
    expect(model.steps[2].actionGroups[0].actions.length).eq(2)

    const moveAction = model.steps[4].actionGroups[0].actions[0] as Move
    expect(moveAction).not.eq(null)
    expect(moveAction.end.sign).eq(Sign.PLUS)
})

