import {DotsAndBoxes} from "./dotsAndBoxes.ts";
import {DotsAndBoxesModel, MoveAction} from "./shared/step.ts";
import {Point} from "./shared/point.ts";
import {Parser} from "./parser/parser.ts";

const canvas = document.getElementById("canvas")! as HTMLCanvasElement

const dotsAndBoxes = new DotsAndBoxes(canvas);
dotsAndBoxes.draw()
// @ts-ignore
window.dots = dotsAndBoxes
let eg1 = `title: bubble sort
                     box: 
                       name: router
                       at: 120, 160
                       size: 100, 150
                     dots:
                       at: 50, 160
                       size: 35
                       data: 3,6,8,9,4,7,1,2
                     actions:
                     4 <-> 7
                     1 <-> 2
                     1 -> router
                    `
const model = new Parser().parse(eg1)
dotsAndBoxes.apply(model);
document.getElementById("pan-zoom")!.onclick = _ => dotsAndBoxes.selectTool(dotsAndBoxes.PAN_ZOOM_TOOL);
document.getElementById("zoom-reset")!.onclick = _ => dotsAndBoxes.zoom = 1;
document.getElementById("dot")!.onclick = _ => dotsAndBoxes.selectTool(dotsAndBoxes.DOTS_TOOL)
document.getElementById("box")!.onclick = _ => dotsAndBoxes.selectTool(dotsAndBoxes.BOX_TOOL)
document.getElementById("back")!.onclick = _ => dotsAndBoxes.back()
document.getElementById("pause")!.onclick = _ => dotsAndBoxes.togglePause()
document.getElementById("forward")!.onclick = _ => dotsAndBoxes.forward()


// new DotsAndBoxesModel(
//     'something',
//     [
//         {position: new Point(-150, 100)},
//         {position: new Point(-480, 340)},
//         {position: new Point(180, 240)}
//     ],
//     [
//         {
//             actions: [
//                 new MoveAction(new Point(400, 400), 0),
//                 new MoveAction(new Point(510, 100), 1)
//             ],
//         },
//         {
//             actions: [
//                 new MoveAction(new Point(240, 40), 0),
//                 new MoveAction(new Point(-100, 60), 1),
//                 new MoveAction(new Point(-100, -60), 2)
//             ],
//
//         }
//     ])
