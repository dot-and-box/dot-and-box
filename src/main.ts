import {DotsAndBoxes} from "./dotsAndBoxes.ts";
import {DotsAndBoxesModel, MoveChange} from "./shared/step.ts";
import {Point} from "./shared/point.ts";

const canvas = document.getElementById("canvas")! as HTMLCanvasElement

const dotsAndBoxes = new DotsAndBoxes(canvas);
dotsAndBoxes.draw()
// @ts-ignore
window.dots = dotsAndBoxes


dotsAndBoxes.parse(new DotsAndBoxesModel(
     [
        {position: new Point(-150, 100)},
        {position: new Point(-480, 340)},
        {position: new Point(180, 240)}
    ],
     [
        {
            changes: [
                new MoveChange(new Point(400, 400), 0),
                new MoveChange(new Point(510, 100), 1)
            ],
        },
        {
            changes: [
                new MoveChange(new Point(240, 40), 0),
                new MoveChange(new Point(-100, 60), 1),
                new MoveChange(new Point(-100, -60), 2)
            ],

        }
    ])
)

document.getElementById("pan-zoom")!.onclick = _ => dotsAndBoxes.selectTool(dotsAndBoxes.PAN_ZOOM_TOOL);
document.getElementById("zoom-reset")!.onclick = _ => dotsAndBoxes.zoom = 1;
document.getElementById("dot")!.onclick = _ => dotsAndBoxes.selectTool(dotsAndBoxes.DOTS_TOOL)
document.getElementById("box")!.onclick = _ => dotsAndBoxes.selectTool(dotsAndBoxes.BOX_TOOL)
document.getElementById("back")!.onclick = _ => dotsAndBoxes.back()
document.getElementById("pause")!.onclick = _ => dotsAndBoxes.togglePause()
document.getElementById("forward")!.onclick = _ => dotsAndBoxes.forward()
