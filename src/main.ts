import {Dots} from "./dots.ts";

const dots = new Dots("canvas");
dots.draw()
// @ts-ignore
window.dots = dots
