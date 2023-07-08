import {Point} from "./point.ts";
import {Dot} from "./dot.ts";
import {Tool} from "./tool.ts";

export class Dots {
    private canvas: HTMLCanvasElement
    private ctx: CanvasRenderingContext2D

    public zoom: number = 1
    private MAX_ZOOM = 5
    private MIN_ZOOM = 0.1
    private SCROLL_SENSITIVITY = 0.0025
    public isDragging = false
    // private dragStart = {x: 0, y: 0}
    private initialPinchDistance: number = 0
    private lastZoom = this.zoom
    private dots: Dot[] = []
    private origin : Point = {x: window.innerWidth / 2, y: window.innerHeight / 2}
    public offset: Point = {x: window.innerWidth / 2, y: window.innerHeight / 2}

    public readonly EMPTY_TOOL: string = "empty-tool"
    public readonly DOTS_TOOL: string = "dots-tool"
    public readonly PAN_ZOOM_TOOL: string = "pan-zoom-tool"
    private tool: Tool = new EmptyTool()

    private tools: Map<string, Tool> = new Map([
        [this.EMPTY_TOOL, new EmptyTool()],
        [this.DOTS_TOOL, new DotsTool(this.dots)],
        [this.PAN_ZOOM_TOOL, new PanZoomTool(this)]
    ])

    constructor(canvasId: string) {
        this.selectTool(this.PAN_ZOOM_TOOL)
        this.canvas = document.getElementById(canvasId)! as
            HTMLCanvasElement
        this.ctx = this.canvas.getContext('2d')! as
            CanvasRenderingContext2D
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight
        this.canvas.addEventListener('mousedown', (e) =>
            this.onPointerDown(e))
        this.canvas.addEventListener('touchstart', (e) =>
            this.handleTouch(e, this.onPointerDown))
        this.canvas.addEventListener('mouseup', (_) =>
            this.onPointerUp())
        this.canvas.addEventListener('touchend', (e) =>
            this.handleTouch(e, this.onPointerUp))
        this.canvas.addEventListener('mousemove', (e) =>
            this.onPointerMove(e))
        this.canvas.addEventListener('touchmove', (e) =>
            this.handleTouch(e, this.onPointerMove))
        this.canvas.addEventListener('wheel', (e) =>
            this.adjustZoom(e.deltaY * this.SCROLL_SENSITIVITY, 1))
    }

    selectTool(toolName: string) {
        if (this.tools.has(toolName)) {
            this.tool = this.tools.get(toolName)!
        }
    }

    public draw() {
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight

        this.ctx.translate(this.origin.x, this.origin.y)
        this.ctx.scale(this.zoom, this.zoom)
        this.ctx.translate(-this.origin.x + this.offset.x, -this.origin.y + this.offset.y)

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.ctx.fillStyle = "#2d3696"
        this.drawRect(-50, -50, 100, 100)

        this.ctx.fillStyle = "#295f6d"
        this.drawText("Dots are ruling the world bro!", -255, -100, 32,
            "courier")
        for (const dot of this.dots) {
            this.drawDot(dot)
        }
        requestAnimationFrame(() => this.draw())
    }

    private getEventLocation(e: any): Point | null {
        if (e.touches && e.touches.length == 1) {
            return {x: e.touches[0].clientX, y: e.touches[0].clientY}
        } else if (e.clientX && e.clientY) {
            return {x: e.clientX, y: e.clientY}
        }
        return null
    }

    drawRect(x: number, y: number, width: number, height: number) {
        this.ctx.fillRect(x, y, width, height)
    }

    drawText(text: string, x: number, y: number, size: number, font:
        string) {
        this.ctx.font = `${size}px ${font}`
        this.ctx.fillText(text, x, y)
    }

    drawDot(dot: Dot) {
        this.ctx.beginPath();
        this.ctx.arc(dot.x, dot.y, dot.size, 0, 2 * Math.PI, false);
        this.ctx.fillStyle = dot.color;
        this.ctx.fill();
        this.ctx.closePath()
        this.ctx.font = `${dot.size}px courier`
        this.ctx.fillStyle = "white"
        const textOffset = dot.size / 2 - 2
        const xOffset = textOffset * dot.text.length
        this.ctx.fillText(dot.text, dot.x - xOffset, dot.y + textOffset)
    }

    private onPointerDown(e: MouseEvent) {
        this.isDragging = true
        let clientPoint = this.getEventLocation(e)
        if (clientPoint == null)
            return

        const point = {
            x: clientPoint.x / this.zoom - this.offset.x + this.origin.x - this.origin.x / this.zoom,
            y: clientPoint.y / this.zoom - this.offset.y + this.origin.y - this.origin.y / this.zoom
        }
        this.tool.click(point)
    }

    private onPointerUp() {
        this.isDragging = false
        this.initialPinchDistance = 0
        this.lastZoom = this.zoom
    }

    private onPointerMove(e: any) {
        if (this.isDragging) {
            let clientPoint = this.getEventLocation(e)!
            let movePoint =  {
                x: clientPoint.x / this.zoom + this.origin.x - this.origin.x / this.zoom,
                y: clientPoint.y / this.zoom + this.origin.y - this.origin.y / this.zoom,
            }
            this.tool.move(movePoint)
        }
    }

    private handleTouch(e: any, singleTouchHandler: any) {
        if (e.touches.length == 1) {
            singleTouchHandler(e)
        } else if (e.type == "touchmove" && e.touches.length == 2) {
            this.isDragging = false
            this.handlePinch(e)
        }
    }

    private handlePinch(e: any) {
        e.preventDefault()
        let touch1 = {x: e.touches[0].clientX, y: e.touches[0].clientY}
        let touch2 = {x: e.touches[1].clientX, y: e.touches[1].clientY}
        let currentDistance = (touch1.x - touch2.x) ** 2 + (touch1.y -
            touch2.y) ** 2
        if (this.initialPinchDistance == null) {
            this.initialPinchDistance = currentDistance
        } else {
            this.adjustZoom(null, currentDistance /
                this.initialPinchDistance)
        }
    }

    private adjustZoom(zoomAmount: any, zoomFactor: any) {
        if (!this.isDragging) {
            if (zoomAmount) {
                this.zoom -= zoomAmount
            } else if (zoomFactor) {
                this.zoom = zoomFactor * this.lastZoom
            }
            this.zoom = Math.min(this.zoom, this.MAX_ZOOM)
            this.zoom = Math.max(this.zoom, this.MIN_ZOOM)
        }
    }
}


class EmptyTool extends Tool {
    override click(point: Point): void {
        console.log(point)
    }

    override move(point: Point): void {
        console.log(point)
    }

    override up(point: Point): void {
        console.log(point)
    }
}

class DotsTool extends Tool {

    dots: Dot[]

    constructor(dots: Dot[]) {
        super()
        this.dots = dots
    }

    override click(point: Point): void {
        this.dots.push({
            x: point.x,
            y: point.y,
            size: 12,
            text: this.dots.length.toString(),
            color: "#85154c"
        })
    }

}

class PanZoomTool extends Tool {

    dots: Dots
    dragStart: Point = {x: 0, y: 0}

    constructor(dots: Dots) {
        super()
        this.dots = dots
    }

    override click(point: Point): void {
        this.dragStart = point
    }
    override move(movePoint: Point) {
        this.dots.offset = {
            x: movePoint.x - this.dragStart.x,
            y: movePoint.y - this.dragStart.y,
        }
    }

}

