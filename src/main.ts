import {DotsAndBoxes} from "./dotsAndBoxes.ts";
import {Parser} from "./parser/parser.ts";
import {Point} from "./shared/point.ts";


class DotsAndBoxesElement extends HTMLElement {
    static observedAttributes = ["color", "border", "code", "width", "height", 'debug', 'controls'];
    dotsAndBoxes!: DotsAndBoxes
    code: string = ''
    color: string = 'whitesmoke'
    debug: boolean = false
    border: string = '1px solid #ccc;'
    defaultWidth: number = 100
    defaultHeight: number = 100
    showControls = false;

    constructor() {
        super();
    }

    reset() {
        if (this.code && this.dotsAndBoxes) {
            const model = new Parser().parse(this.code)
            this.dotsAndBoxes.apply(model);
            this.dotsAndBoxes.showDebug = this.debug
            this.dotsAndBoxes.updateCanvasPositionAndSize(new Point(this.offsetLeft, this.offsetTop), this.color)
            this.dotsAndBoxes.draw()
        }
    }

    connectedCallback() {
        const shadow = this.attachShadow({mode: "open"});
        shadow.innerHTML = `
      <style>
        :host { display: block; padding: 0;border: ${this.border};}
        #menu {
          position: relative;   
          height: 30px;
          left: 2px;       
          top: -28px;
          display: ${this.showControls ? 'block' : 'none'};
        }
      </style>
      <div>
        <canvas id="can"></canvas>
        <div id="menu"></div>
      </div>
    `;
        const canvas = shadow.getElementById('can') as HTMLCanvasElement
        canvas.width = this.offsetWidth ? this.offsetWidth - 2 : this.defaultWidth
        canvas.height = this.offsetHeight ? this.offsetHeight - 2 : this.defaultHeight
        canvas.style.background = this.color
        canvas.style.padding = '0'
        canvas.style.margin = '0'
        canvas.style.overflow = 'hidden'
        canvas.style.userSelect = 'none'


        this.buildMenu(shadow.getElementById('menu') as HTMLElement)
        this.dotsAndBoxes = new DotsAndBoxes(canvas);
        this.reset()
    }

    buildMenu(menu: HTMLElement) {
        const backward = document.createElement("button");
        backward.onclick = (_) => this.dotsAndBoxes.back()
        backward.textContent = '◀'
        menu.append(backward)
        const pause = document.createElement("button");
        pause.onclick = (_) => this.dotsAndBoxes.togglePause()
        pause.textContent = "◼"
        menu.append(pause)
        const forward = document.createElement("button");
        forward.onclick = (_) => this.dotsAndBoxes.forward()
        forward.append('▶')
        menu.append(forward)


        const panZoomTool = document.createElement("button");
        panZoomTool.onclick = (_) => this.dotsAndBoxes.selectTool(this.dotsAndBoxes.PAN_ZOOM_TOOL)
        panZoomTool.append('☩')
        menu.append(panZoomTool)

        const dotTool = document.createElement("button");
        dotTool.onclick = (_) => this.dotsAndBoxes.selectTool(this.dotsAndBoxes.DOT_TOOL)
        dotTool.append('❍')
        menu.append(dotTool)


        const boxTool = document.createElement("button");
        boxTool.onclick = (_) => this.dotsAndBoxes.selectTool(this.dotsAndBoxes.BOX_TOOL)
        boxTool.append('◻')
        menu.append(boxTool)

    }

    disconnectedCallback() {
        console.log("Custom element removed from page.");
    }

    adoptedCallback() {
        console.log("Custom element moved to new page.");
    }

    attributeChangedCallback(name: string, oldValue: any, newValue: any) {
        switch (name) {
            case 'code':
                this.code = newValue
                break;
            case 'color':
                this.color = newValue
                break;
            case 'border':
                this.border = newValue
                break;
            case 'controls':
                this.showControls = newValue != null
                break;
            case 'debug':
                this.debug = newValue != null
                this.dotsAndBoxes.showDebug = this.debug
                break;
            default:
                console.log(name, oldValue, newValue)

        }
    }
}

customElements.define("dots-and-boxes", DotsAndBoxesElement);
