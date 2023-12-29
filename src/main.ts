import {DotsAndBoxes} from "./dotsAndBoxes.ts";
import {Parser} from "./parser/parser.ts";

const canvas = document.getElementById("canvas")! as HTMLCanvasElement

const dotsAndBoxes = new DotsAndBoxes(canvas);
dotsAndBoxes.draw()
// @ts-ignore
window.dots = dotsAndBoxes
let eg1 = `
title: bubble sort
box: 
 name: b1 
 at: -120, -10
 size: 60, 50
box: 
 at: 120, -160
 size: 250, 50
dot:
 name: dt1
 color: orange
 at: -50, 100
 size: 20
steps:
dt1 <-> b1
b1 <-> dt1
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
//             steps: [
//                 new MoveAction(new Point(400, 400), 0),
//                 new MoveAction(new Point(510, 100), 1)
//             ],
//         },
//         {
//             steps: [
//                 new MoveAction(new Point(240, 40), 0),
//                 new MoveAction(new Point(-100, 60), 1),
//                 new MoveAction(new Point(-100, -60), 2)
//             ],
//
//         }
//     ])
