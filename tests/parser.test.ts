import { expect, test } from 'vitest'
import {Parser} from "../src/parser/parser";

test('parser not null', () => {
    let p = new Parser()
    expect(p).not.eq(null)
})