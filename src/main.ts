import {Dots} from "./dots.ts";
import {MoveChange} from "./step.ts";
import {Point} from "./point.ts";

const dots = new Dots("canvas");
dots.draw()
// @ts-ignore
window.dots = dots


dots.parse({
    controls: [
        {position: new Point(-150, 100)},
        {position: new Point(-480, 340)},
        {position: new Point(180, 240)}
    ],
    steps: [
        {
            changes: [
                new MoveChange(new Point(400, 400), 0),
                new MoveChange(new Point(510, 100), 1)
            ],
        },
        {
            changes: [
                new MoveChange(new Point(240, 40), 0),
                new MoveChange(new Point(10, 160), 1)
            ],

        }
    ]
})

document.getElementById("pan-zoom")!.onclick = _ => dots.selectTool(dots.PAN_ZOOM_TOOL);
document.getElementById("zoom-reset")!.onclick = _ => dots.zoom = 1;
document.getElementById("dots")!.onclick = _ => dots.selectTool(dots.DOTS_TOOL)
document.getElementById("comp")!.onclick = _ => dots.selectTool(dots.COMPONENT_TOOL)
document.getElementById("back")!.onclick = _ => dots.back()
document.getElementById("pause")!.onclick = _ => dots.togglePause()
document.getElementById("forward")!.onclick = _ => dots.forward()
