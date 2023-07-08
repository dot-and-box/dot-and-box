import {Dots} from "./dots.ts";

const dots = new Dots("canvas");
dots.draw()
// @ts-ignore
window.dots = dots


document.getElementById("pan-zoom")!.onclick = _ => dots.selectTool(dots.PAN_ZOOM_TOOL);
document.getElementById("zoom-reset")!.onclick = _ => dots.zoom = 1;
document.getElementById("dots")!.onclick = _ => dots.selectTool(dots.DOTS_TOOL)
