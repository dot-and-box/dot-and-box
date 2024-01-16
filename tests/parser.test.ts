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
title: bubble sort
box text: 'bubble sort' id: b1 color: rgba(137,33,133,0.88) at: -180, -120 size: 260, 80
dot text: '1' color: red at: -100, 0 size: 20
dot text: '2' color: purple at: -150, 0 size: 20
dot text: '5' color: orange at: 0, 0 size: 20
dot text: '4' color: green at: -50, 0 size: 20
dot text: '3' color: blue at: 50, 0 size: 20
steps:
'2' <-> '1'
'5' <-> '3'
'3' <-> '4'
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
b1 <-> '1', '2'-> -(50, -45)
'1' <-> b1, '2' -> (67,80)
'1' -> +(89,90)
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

