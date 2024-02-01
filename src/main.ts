import {DotsAndBoxes} from "./dotsAndBoxes.ts"
import {Parser} from "./parser/parser.ts"
import {Point} from "./shared/point.ts"


class DotsAndBoxesElement extends HTMLElement {
    public static readonly ELEM_NAME: string = "dots-and-boxes"
    static observedAttributes = ["style", "color", "border", "code", "width", "height", 'debug', 'experimental', 'controls', 'autoplay']
    dotsAndBoxes!: DotsAndBoxes
    code: string = ''
    color: string = 'white'
    debug: boolean = false
    border: string = '1px solid #ccc'
    defaultWidth: number = 100
    defaultHeight: number = 100
    showControls = false
    experimental = false
    autoplay = false
    canvas!: HTMLCanvasElement

    constructor() {
        super()
    }

    reset() {
        if (this.code && this.dotsAndBoxes) {
            this.updateCanvasStyle(this.canvas)
            this.applyCode()
            this.dotsAndBoxes.showDebug = this.debug
            this.dotsAndBoxes.updatePositionAndSize(new Point(this.offsetLeft, this.offsetTop))
            this.dotsAndBoxes.draw(0)
        }
    }

    applyCode() {
        const model = new Parser().parse(this.code)
        this.dotsAndBoxes.apply(model)
    }

    connectedCallback() {
        const shadow = this.attachShadow({mode: "open"})
        shadow.innerHTML = `
      <style>
        :host { display: block; padding: 0;border: ${this.border};}
        #controls-menu {
          position: relative;   
          height: 40px;
          left: 0;       
          top: -44px;
          overflow:hidden;
          background-color: rgba(243,243,243,0.7);
          display: ${this.showControls ? 'block' : 'none'};
        }        
        #controls-menu button {
         color:  rgba(43,43,43,0.8);
         background-color: transparent;
         font-size: 18px;
         height: 38px;
         width: 30px;
         margin-left: 2px;
         margin-right: 2px;
         border: solid 1px transparent;
        }      
      </style>
      <div>
        <canvas id="canvas"></canvas>
        <div id="controls-menu"></div>
      </div>
    `
        this.buildControls(shadow.getElementById('controls-menu') as HTMLElement)
        this.canvas = this.getCanvas(shadow)
        this.dotsAndBoxes = new DotsAndBoxes(this.canvas)
        this.reset()
    }

    getCanvas(shadow: ShadowRoot): HTMLCanvasElement {
        return shadow.getElementById('canvas') as HTMLCanvasElement
    }

    updateCanvasStyle(canvas: HTMLCanvasElement): void {
        canvas.width = this.offsetWidth ? this.offsetWidth - 2 : this.defaultWidth
        canvas.height = this.offsetHeight ? this.offsetHeight - 2 : this.defaultHeight
        canvas.style.background = this.color
        canvas.style.padding = '0'
        canvas.style.margin = '0'
        canvas.style.overflow = 'hidden'
        canvas.style.userSelect = 'none'
    }

    updateControls() {
        const controlsMenu = this.shadowRoot!.getElementById('controls-menu') as HTMLElement
        controlsMenu.style.display = this.showControls ? 'block' : 'none'
    }

    buildControls(menu: HTMLElement) {

        const backward = document.createElement("button")
        backward.onclick = (_) => this.dotsAndBoxes.backward()
        backward.textContent = '◀'
        menu.append(backward)
        const pause = document.createElement("button")
        pause.onclick = (_) => this.dotsAndBoxes.togglePause()
        pause.textContent = "◼"
        menu.append(pause)
        const forward = document.createElement("button")
        forward.onclick = (_) => this.dotsAndBoxes.forward()
        forward.append('▶')
        menu.append(forward)

        const restart = document.createElement("button")
        restart.onclick = (_) => this.reset()
        restart.append('↺')
        menu.append(restart)


        if (this.experimental) {
            const panZoomTool = document.createElement("button")
            panZoomTool.onclick = (_) => this.dotsAndBoxes.selectTool(this.dotsAndBoxes.PAN_ZOOM_TOOL)
            panZoomTool.append('☩')
            menu.append(panZoomTool)

            const rangeControl = document.createElement("input")
            rangeControl.type = "range"
            rangeControl.min = "0"
            rangeControl.max = "1"
            rangeControl.step = "0.01"
            rangeControl.value = "0"
            rangeControl.oninput = (e: any) => {
                this.dotsAndBoxes.requestedStepProgress = parseFloat(e.target.value)
            }
            menu.append(rangeControl)

            const dotTool = document.createElement("button")
            dotTool.onclick = (_) => this.dotsAndBoxes.selectTool(this.dotsAndBoxes.DOT_TOOL)
            dotTool.append('❍')
            menu.append(dotTool)

            const boxTool = document.createElement("button")
            boxTool.onclick = (_) => this.dotsAndBoxes.selectTool(this.dotsAndBoxes.BOX_TOOL)
            boxTool.append('◻')
            menu.append(boxTool)

            const printModel = document.createElement("button")
            printModel.onclick = (_) => console.log(this.dotsAndBoxes.model)
            printModel.append('m')
            menu.append(printModel)
        }
    }

    resize() {
        if (this.canvas) {
            this.updateCanvasStyle(this.canvas)
            this.dotsAndBoxes.updatePositionAndSize(new Point(this.offsetLeft, this.offsetTop))
        }
    }

    disconnectedCallback() {
        console.log("Custom element removed from page.")
    }

    adoptedCallback() {
        console.log("Custom element moved to new page.")
    }

    attributeChangedCallback(name: string, oldValue: any, newValue: any) {
        switch (name) {
            case 'style':
                this.resize()
                break
            case 'code':
                this.code = newValue
                if (this.dotsAndBoxes) {
                    this.applyCode()
                }
                break
            case 'color':
                this.color = newValue
                break
            case 'border':
                this.border = newValue
                break
            case 'controls':
                this.showControls = newValue != null
                if (this.dotsAndBoxes) {
                    this.updateControls()
                }
                break
            case 'experimental':
                this.experimental = newValue != null
                if (this.dotsAndBoxes) {
                    this.updateControls()
                }
                break
            case 'autoplay':
                this.autoplay = newValue != null
                if (this.dotsAndBoxes) {
                    this.dotsAndBoxes.autoplay = this.autoplay
                }
                break
            case 'debug':
                this.debug = newValue != null
                if (this.dotsAndBoxes) {
                    this.dotsAndBoxes.showDebug = this.debug
                }
                break
            default:
                console.log(name, oldValue, newValue)

        }
    }
}

customElements.define(DotsAndBoxesElement.ELEM_NAME, DotsAndBoxesElement)
