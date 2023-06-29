export class Dots {
    private canvas: HTMLCanvasElement
    private ctx: CanvasRenderingContext2D
    private cameraOffset = {
        x: window.innerWidth / 2, y:
            window.innerHeight / 2
    }
    private cameraZoom = 1
    private MAX_ZOOM = 5
    private MIN_ZOOM = 0.1
    private SCROLL_SENSITIVITY = 0.0025
    private isDragging = false
    private dragStart = {x: 0, y: 0}
    private initialPinchDistance: number = 0
    private lastZoom = this.cameraZoom
    private dots: Dot[] = []

    constructor(canvasId: string) {
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

    public draw() {
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight
        this.ctx.translate(window.innerWidth / 2, window.innerHeight / 2)
        this.ctx.scale(this.cameraZoom, this.cameraZoom)
        this.ctx.translate(-window.innerWidth / 2 + this.cameraOffset.x,
            -window.innerHeight / 2 + this.cameraOffset.y)
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.ctx.fillStyle = "#700c0c"
        this.drawRect(-50, -50, 100, 100)
        this.ctx.beginPath()
        this.ctx.lineWidth = 0.5
        this.ctx.strokeStyle = "black"
        for (let i = -100; i < 100; i += 10) {
            this.ctx.moveTo(i * 10, -500);
            this.ctx.lineTo(i * 10, 500);
            this.ctx.stroke()
        }
        this.ctx.closePath()
        this.ctx.fillStyle = "#a211dc"
        this.drawText("Simple Pan and Zoom Canvas", -255, -100, 32,
            "courier")
        for (const dot of this.dots) {
            this.drawDot(dot)
        }
        requestAnimationFrame(() => this.draw())
    }

    private getEventLocation(e: any) {
        if (e.touches && e.touches.length == 1) {
            return {x: e.touches[0].clientX, y: e.touches[0].clientY}
        } else if (e.clientX && e.clientY) {
            return {x: e.clientX, y: e.clientY}
        }
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
    }

    private onPointerDown(e: MouseEvent) {
        this.isDragging = true
        let point = this.getEventLocation(e)!
        const scaledX = point.x / this.cameraZoom
        const scaledY = point.y / this.cameraZoom
//const halfWidth = window.innerWidth/2
        this.dragStart.x = scaledX - this.cameraOffset.x
        this.dragStart.y = scaledY - this.cameraOffset.y
        const x = scaledX - this.cameraOffset.x / this.cameraZoom;
//const y = scaledY - this.cameraOffset.y / this.cameraZoom;
        console.log(this.cameraZoom, this.cameraOffset.x -
            window.innerWidth / this.cameraZoom, "client x=" + point.x)//this.dots.push({x: x, y: y, size: 10, color: "red"})
    }

    private onPointerUp() {
        this.isDragging = false
        this.initialPinchDistance = 0
        this.lastZoom = this.cameraZoom
    }

    private onPointerMove(e: any) {
        if (this.isDragging) {
            let point = this.getEventLocation(e)!
            this.cameraOffset.x = point.x / this.cameraZoom -
                this.dragStart.x
            this.cameraOffset.y = point.y / this.cameraZoom -
                this.dragStart.y
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
// This is distance squared, but no need for an expensive sqrt as it's only used in ratio
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
                this.cameraZoom -= zoomAmount
            } else if (zoomFactor) {
                this.cameraZoom = zoomFactor * this.lastZoom
            }
            this.cameraZoom = Math.min(this.cameraZoom, this.MAX_ZOOM)
            this.cameraZoom = Math.max(this.cameraZoom, this.MIN_ZOOM)
        }
    }
}

interface Dot {
    x: number
    y: number
    color: string
    size: number
}
