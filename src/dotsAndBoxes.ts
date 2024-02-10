import {Point} from "./shared/point.ts"
import {Tool} from "./shared/tool.ts"
import {DEFAULT_FONT, MAX_ZOOM, MIN_ZOOM, SCROLL_SENSITIVITY, TITLE_FONT_SIZE} from "./shared/constants.ts"
import {DotTool} from "./tools/dotTool.ts"
import {EmptyTool} from "./shared/emptyTool.ts"
import {PanZoomTool} from "./tools/panZoomTool.ts"
import {BoxTool} from "./tools/boxTool.ts"
import {DotsAndBoxesModel} from "./shared/dotsAndBoxesModel.ts";

export class DotsAndBoxes {
    private readonly canvas: HTMLCanvasElement
    private readonly ctx: CanvasRenderingContext2D
    private _width = 100
    private _height = 100
    public model: DotsAndBoxesModel = new DotsAndBoxesModel('', [], [])
    public isDragging = false
    private initialPinchDistance: number = 0
    private lastZoom = this.model.zoom
    private fps = 1
    public showDebug = true
    public marginLeft = 0
    public marginTop = 0
    public readonly EMPTY_TOOL: string = "empty-tool"
    public readonly DOT_TOOL: string = "dot-tool"
    public readonly BOX_TOOL: string = "box-tool"
    public readonly PAN_ZOOM_TOOL: string = "pan-zoom-tool"
    private panZoomTool = new PanZoomTool()
    private tools: Map<string, Tool> = new Map([
        [this.EMPTY_TOOL, new EmptyTool()],
        [this.DOT_TOOL, new DotTool()],
        [this.BOX_TOOL, new BoxTool()],
        [this.PAN_ZOOM_TOOL, this.panZoomTool]
    ])
    private tool: Tool = this.panZoomTool

    // noinspection JSUnusedGlobalSymbols
    public get requestedStepProgress(): number {
        return this.model.requestedStepProgress
    }

    public set requestedStepProgress(newVal: number) {
        this.model.requestedStepProgress = newVal
    }

    public get zoom(): number {
        return this.model.zoom
    }

    public set zoom(newZoom: number) {
        this.model.zoom = newZoom
    }

    public initModel(model: DotsAndBoxesModel) {
        this.requestedStepProgress = 0;
        this.model = model
        this.model.currentStepIndex = 0
        for (let tool of this.tools.values()) {
            tool.updateModel(this.model)
        }
    }

    public apply(model: DotsAndBoxesModel) {
        this.initModel(model)
        this.model.selectStep(0)
        this.model.currentStep.init()
    }

    constructor(canvas: HTMLCanvasElement) {
        this.ctx = canvas.getContext('2d')! as CanvasRenderingContext2D
        this.canvas = canvas
        this.attachCanvasEventHandlers()
    }

    public updatePositionAndSize(offset: Point) {
        const style = getComputedStyle(this.canvas)
        this._width = parseInt(style.width, 10)
        this._height = parseInt(style.height, 10)
        this.marginLeft = parseInt(style.marginLeft, 10) + offset.x
        this.marginTop = parseInt(style.marginTop, 10) + offset.y
        this.model.origin = new Point(this._width / 2, this._height / 2)
        this.model.offset = new Point(this._width / 2, this._height / 2)
    }

    private attachCanvasEventHandlers() {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
        if (!isMobile) {
            this.addCanvasEvent('mousedown', (e: any) => this.onPointerDown(e))
        }
        this.addCanvasEvent('touchstart', (e: any) => this.handleTouch(e, this.onPointerDown))
        this.addCanvasEvent('mouseup', (_: any) => this.onPointerUp())
        this.addCanvasEvent('touchend', (e: any) => this.handleTouch(e, this.onPointerUp))
        this.addCanvasEvent('mousemove', (e: any) => this.onPointerMove(e))
        this.addCanvasEvent('touchmove', (e: any) => this.handleTouch(e, this.onPointerMove))
        this.addCanvasEvent('wheel', (e: any) => this.handleScroll(e))
    }

    private addCanvasEvent(eventName: string, lambda: any) {
        this.canvas.addEventListener(eventName, lambda)
    }

    selectTool(toolName: string) {
        if (this.tools.has(toolName)) {
            this.tool = this.tools.get(toolName)!
        }
    }

    public fastForward() {
        this.model.autoPlay = true
        this.model.singleForward()
    }

    public fastBackward() {
        this.model.autoPlay = true
        this.model.singleBackward()
    }

    public forward() {
        this.model.autoPlay = false
        this.model.singleForward()
    }

    public backward() {
        this.model.autoPlay = false
        this.model.singleBackward()
    }

    public deleteSelected() {
        this.togglePause()
        this.model.deleteSelected()
    }

    public togglePause() {
        this.model.togglePause()
    }

    private drawDebug(time: number) {
        this.fps = 1 / ((time - this.model.lastTime) / 1000)
        this.drawText(`fps: ${Math.round(this.fps)} zoom: ${Math.round(this.model.zoom * 100) / 100} step: ${this.model.currentStepIndex} prog: ${Math.round(this.model.requestedStepProgress * 100) / 100}`, 0, 10, 12, DEFAULT_FONT)
    }

    draw(time: number) {
        this.canvas.width = this._width
        this.canvas.height = this._height
        if (this.showDebug) {
            this.drawDebug(time)
        }
        if (this.model.title) {
            this.drawText(this.model.title, 20, 30, TITLE_FONT_SIZE, DEFAULT_FONT)
        }
        if (this.model.subtitle) {
            this.drawText(this.model.subtitle, 20, 60, TITLE_FONT_SIZE, DEFAULT_FONT)
        }
        this.ctx.translate(this.model.origin.x, this.model.origin.y)
        this.ctx.scale(this.model.zoom, this.model.zoom)
        this.ctx.translate(-this.model.origin.x + this.model.offset.x, -this.model.origin.y + this.model.offset.y)
        this.model.updateRequestedProgressIfInMove()
        this.model.updateProgress()
        for (const control of this.model.controls) {
            if (control.visible) {
                control.draw(this.ctx)
            }
        }
        this.model.lastTime = time
        requestAnimationFrame((evt) => this.draw(evt))
    }

    private getEventLocation(e: any): Point | null {
        if (e.touches && e.touches.length == 1) {
            return new Point(e.touches[0].clientX + window.scrollX - this.marginLeft, e.touches[0].clientY + window.scrollY - this.marginTop)
        } else if (e.clientX && e.clientY) {
            return new Point(e.clientX + window.scrollX - this.marginLeft, e.clientY + window.scrollY - this.marginTop)
        }
        return null
    }

    drawText(text: string, x: number, y: number, size: number, font: string) {
        this.ctx.font = `${size}px ${font}`
        this.ctx.fillText(text, x, y)
    }

    private onPointerDown(e: MouseEvent) {
        e.preventDefault()
        this.isDragging = true
        let clientPoint = this.getEventLocation(e)
        if (clientPoint == null)
            return

        this.tool.click(new Point(
            clientPoint.x / this.model.zoom - this.model.offset.x + this.model.origin.x - this.model.origin.x / this.model.zoom,
            clientPoint.y / this.model.zoom - this.model.offset.y + this.model.origin.y - this.model.origin.y / this.model.zoom
        ))
    }

    private onPointerUp() {
        this.isDragging = false
        this.initialPinchDistance = 0
        this.lastZoom = this.model.zoom
    }

    private onPointerMove(e: any) {
        e.preventDefault()

        if (this.isDragging) {
            let clientPoint = this.getEventLocation(e)!
            this.tool.move(new Point(
                clientPoint.x / this.model.zoom + this.model.origin.x - this.model.origin.x / this.model.zoom,
                clientPoint.y / this.model.zoom + this.model.origin.y - this.model.origin.y / this.model.zoom
            ))
        }
    }

    private handleTouch(e: any, singleTouchHandler: any) {
        e.preventDefault()
        if (e.touches.length == 1) {
            singleTouchHandler.call(this, e)
        } else if (e.type == "touchmove" && e.touches.length > 1) {
            this.isDragging = false
            this.handlePinch(e)
        }
    }

    private handlePinch(e: any) {
        const t1 = {
            x: e.touches[0].clientX + window.scrollX - this.marginLeft as number,
            y: e.touches[0].clientY + window.scrollY - this.marginTop as number
        }
        const t2 = {
            x: e.touches[1].clientX + window.scrollX - this.marginLeft as number,
            y: e.touches[1].clientY + window.scrollY - this.marginTop as number
        }
        const currentDistance = (t1.x - t2.x) ** 2 + (t1.y - t2.y) ** 2
        if (this.initialPinchDistance == 0) {
            this.initialPinchDistance = currentDistance
        } else {
            this.adjustZoom(null, currentDistance / this.initialPinchDistance)
        }
    }

    private handleScroll(evt: any) {
        evt.preventDefault()
        this.adjustZoom(evt.deltaY * SCROLL_SENSITIVITY, 1)
    }

    private adjustZoom(zoomAmount: any, zoomFactor: any) {
        if (!this.isDragging) {
            if (zoomAmount) {
                this.model.zoom -= zoomAmount
            } else if (zoomFactor) {
                this.model.zoom = zoomFactor * this.lastZoom
            }
            this.model.zoom = Math.min(this.model.zoom, MAX_ZOOM)
            this.model.zoom = Math.max(this.model.zoom, MIN_ZOOM)
        }
    }

}



