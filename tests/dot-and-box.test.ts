import {expect, test} from "vitest";
import {Parser} from "../src/parser/parser";
import {TextControl} from "../src/controls/control";

test('change box text to new value', () => {
    let eg1 = `
    title: zoo
    box id: a text: 'old value'
    step: 'change text to z'
    a <- text: 'new value'
    `
    let p = new Parser()
    const model = p.parse(eg1)
    model.currentStepIndex = 0
    model.requestedStepProgress = 1
    model.updateProgress()
    expect(model).not.eq(null)
    expect(model.steps.length).eq(1)
    expect((model.controls[0] as TextControl).text).eq('new value')
})