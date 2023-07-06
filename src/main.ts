import {Dots} from "./dots.ts";

const dots = new Dots("canvas");
dots.draw()
// @ts-ignore
window.dots = dots


const resetZoomButton = document.getElementById("zoom-reset")! as
    HTMLElement

resetZoomButton.onclick = _ => dots.zoom = 1;
