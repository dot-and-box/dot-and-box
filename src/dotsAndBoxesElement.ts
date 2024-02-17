import {DotsAndBoxes} from "./dotsAndBoxes.ts"
import {Parser} from "./parser/parser.ts"
import {Point} from "./shared/point.ts"
import {
    AUTOPLAY, BORDER, CODE, COLOR, CONTROLS,
    DEBUG, EXPERIMENTAL, HEIGHT, INITIALIZED, KEYBOARD, STYLE, WIDTH
} from "./shared/elemConstants.ts";


class DotsAndBoxesElement extends HTMLElement {
    public static readonly ELEM_NAME: string = "dots-and-boxes"
    public static readonly ON_BEFORE_STEP_FORWARD: string = "on_before_step_forward"
    public static readonly ON_BEFORE_STEP_BACKWARD: string = "on_before_step_backward"
    static observedAttributes = [STYLE, COLOR, BORDER, CODE, WIDTH, HEIGHT, DEBUG, EXPERIMENTAL, CONTROLS, AUTOPLAY, KEYBOARD, INITIALIZED]
    dotsAndBoxes!: DotsAndBoxes
    private _code: string = ''
    color: string = 'white'
    debug: boolean = false
    border: string = '1px solid #ccc'
    defaultWidth: number = 100
    defaultHeight: number = 100
    showControls = false
    extendedMenu = false
    experimental = false
    autoplay = false
    canvas!: HTMLCanvasElement
    keyboard: boolean = false
    _initialized: boolean = false
    _wrapper: any = null

    public get initialized() {
        return this._initialized
    }

    public get code() {
        return this._code
    }

    public set code(newCode: string) {
        this._code = newCode
        this.reset()
    }

    reset() {
        if (this._code && this.dotsAndBoxes) {
            this.updateCanvasStyle(this.canvas)
            this.applyCode()
            this.dotsAndBoxes.showDebug = this.debug
            this.dotsAndBoxes.updatePositionAndSize(new Point(this.offsetLeft, this.offsetTop))
            this.dotsAndBoxes.draw(0)
        }
    }

    applyCode() {
        const model = new Parser().parse(this._code)
        model.onBeforeStepForwardCallback = (index) => this.dispatchOnBeforeStepForward(index)
        model.onBeforeStepBackwardCallback = (index) => this.dispatchOnBeforeStepBackward(index)
        model.updateSubtitleCallback = (text) => this.updateSubtitle(text)
        this.updateTitle(model.title)
        this.dotsAndBoxes.apply(model)
    }

    connectedCallback() {
        const shadow = this.attachShadow({mode: "open"})
        shadow.innerHTML = `
      <style>
      :host { display: block; padding: 0;border: ${this.border};}      
      #title-wrapper {
        margin-top: 5px;
        margin-left: 5px;
        margin-right: 5px;
        position: absolute;  
        color: rgba(55,55,55);      
      }
      #title {
        font-size: 18pt;
        font-weight: bold;
      }
      #subtitle {     
        font-size: 14pt;
      }    
      #controls-menu {    
        position: relative;   
        height: 50px;
        left: 0;       
        top: -54px;
        overflow: hidden;
        background-color: transparent;
        display: ${this.showControls ? 'flex' : 'none'};
        flex-wrap: nowrap;
        align-items: center;
        justify-content: center;
      }               
      #controls-menu-extended {    
        position: relative;   
        height: 50px;
        left: 0;       
        top: -154px;
        overflow: hidden;
        background-color: transparent;          
        display: none;
        flex-wrap: nowrap;
        align-items: center;
        justify-content: center;
      }      
      #controls-menu button, #controls-menu-extended  button {
        color:  rgba(23,23,23,0.7);
        background-color: transparent;
        font-size: 22px;                 
        width: 36px;
        height: 36px;
        margin-left: 3px;
        margin-right: 3px;
        padding: 0;
        border-radius: 50%;
        border: solid 1px gray;
      }      
      #controls-menu button:hover {
        color:  #2d2828;
        border: solid 1px #2d2828;
      }
      </style>
      <div id="wrapper">
       <div id="title-wrapper">
         <div id="title"></div>
         <div id="subtitle"></div>
       </div>              
       <canvas id="canvas"></canvas>         
       <div id="controls-menu"></div>
       <div id="controls-menu-extended"></div>
      </div>
    `
        this.buildControls(shadow)
        this.canvas = this.getCanvas(shadow)
        this.dotsAndBoxes = new DotsAndBoxes(this.canvas)
        this.reset()
        this._initialized = true
        this._wrapper = this.shadowRoot!.getElementById('wrapper')
        this._wrapper.dispatchEvent(new CustomEvent(INITIALIZED, {
            bubbles: true,
            cancelable: false,
            composed: true
        }))
        if (this.autoplay) {
            this.fastForward()
        }
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

    updateTitle(title: string) {
        const titleElem = this.shadowRoot!.getElementById('title') as HTMLElement
        titleElem.style.width = `${this.offsetWidth ? this.offsetWidth - 2 : this.defaultWidth}px`
        titleElem.innerText = title
    }

    updateSubtitle(subtitle: string) {
        const subtitleElem = this.shadowRoot!.getElementById('subtitle') as HTMLElement
        subtitleElem.style.width = `${this.offsetWidth ? this.offsetWidth - 2 : this.defaultWidth}px`
        subtitleElem.innerText = subtitle
    }

    updateControls() {
        const controlsMenu = this.shadowRoot!.getElementById('controls-menu') as HTMLElement
        controlsMenu.style.display = this.showControls ? 'block' : 'none'
        const experimentalMenu = this.shadowRoot!.getElementById(EXPERIMENTAL) as HTMLElement
        experimentalMenu.style.display = this.experimental ? 'inline' : 'none'
    }

    dispatchOnBeforeStepForward(index: number) {
        const stepSelected = new CustomEvent(DotsAndBoxesElement.ON_BEFORE_STEP_FORWARD, {
            bubbles: true,
            composed: true,
            detail: {step: index}
        });
        this._wrapper.dispatchEvent(stepSelected)
    }

    dispatchOnBeforeStepBackward(index: number) {
        const stepSelected = new CustomEvent(DotsAndBoxesElement.ON_BEFORE_STEP_BACKWARD, {
            bubbles: true,
            composed: true,
            detail: {step: index}
        });
        this._wrapper.dispatchEvent(stepSelected)
    }

    buildControls(shadow: ShadowRoot) {
        const menu: HTMLElement = shadow.getElementById('controls-menu') as HTMLElement
        const extendedMenu: HTMLElement = shadow.getElementById('controls-menu-extended') as HTMLElement

        const backward = document.createElement("button")
        backward.onclick = (_) => this.backward()
        backward.textContent = '\u{025C2}'
        menu.append(backward)

        const pause = document.createElement("button")
        pause.onclick = (_) => this.dotsAndBoxes.togglePause()
        pause.textContent = "\u{25A0}"
        menu.append(pause)

        const forward = document.createElement("button")
        forward.onclick = (_) => this.forward()
        forward.append('\u{025B8}')
        menu.append(forward)

        const restart = document.createElement("button")
        restart.onclick = (_) => this.reset()
        restart.append('↺')
        menu.append(restart)

        const moreMenuButton = document.createElement("button")
        moreMenuButton.onclick = (_) => this.toggleExtendedMenu()
        moreMenuButton.append('\u{22EF}')
        menu.append(moreMenuButton)

        const rangeControl = document.createElement("input")
        rangeControl.id = 'progress-range'
        rangeControl.type = 'range'
        rangeControl.min = '0'
        rangeControl.max = '1'
        rangeControl.step = '0.01'
        rangeControl.value = '0'
        rangeControl.style.height = '100%'
        rangeControl.style.width = '100%'
        rangeControl.oninput = (e: any) => {
            this.dotsAndBoxes.requestedStepProgress = parseFloat(e.target.value)
        }
        extendedMenu.append(rangeControl)

        const experimentalMenu = document.createElement("div")
        experimentalMenu.id = EXPERIMENTAL
        experimentalMenu.style.display = this.experimental ? 'flex' : 'none'

        const dotTool = document.createElement("button")
        dotTool.onclick = (_) => this.dotsAndBoxes.selectTool(this.dotsAndBoxes.DOT_TOOL)
        dotTool.append('\u{23FA}')
        experimentalMenu.append(dotTool)

        const boxTool = document.createElement("button")
        boxTool.onclick = (_) => this.dotsAndBoxes.selectTool(this.dotsAndBoxes.BOX_TOOL)
        boxTool.append('\u{25A1}')
        experimentalMenu.append(boxTool)

        const printModel = document.createElement("button")
        printModel.onclick = (_) => console.log(this.dotsAndBoxes.model)
        printModel.append('\u{02148}')
        experimentalMenu.append(printModel)
        extendedMenu.append(experimentalMenu)
    }

    toggleExtendedMenu() {
        if (!this.extendedMenu) {
            this.showExtendedMenu()
        } else {
            this.hideExtendedMenu()
        }
    }

    hideExtendedMenu() {
        if (this.extendedMenu) {
            const extendedMenu: HTMLElement = this.shadowRoot!.getElementById('controls-menu-extended') as HTMLElement
            this.extendedMenu = false
            extendedMenu.style.display = 'none'
        }
    }

    showExtendedMenu() {
        if (!this.extendedMenu) {
            const extendedMenu: HTMLElement = this.shadowRoot!.getElementById('controls-menu-extended') as HTMLElement
            const progressRange: HTMLInputElement = this.shadowRoot!.getElementById('progress-range') as HTMLInputElement
            progressRange.value = `${this.dotsAndBoxes.requestedStepProgress}`
            this.extendedMenu = true
            extendedMenu.style.display = 'flex'
        }
    }

    private updateKeyboardHandler() {
        if (this.keyboard) {
            document.addEventListener('keydown', this.keyboardHandlerLambda)
        } else {
            document.removeEventListener('keydown', this.keyboardHandlerLambda)
        }
    }

    keyboardHandlerLambda = (e: any) => this.handleKeyDown(e)

    private handleKeyDown(k: KeyboardEvent) {
        if (k.key === "ArrowLeft") {
            this.dotsAndBoxes.backward()
        } else if (k.key === "ArrowRight") {
            this.dotsAndBoxes.forward()
        } else if (k.key === "Delete") {
            this.dotsAndBoxes.deleteSelected()
        }
    }

    public forward() {
        this.hideExtendedMenu()
        this.dotsAndBoxes.forward()
    }

    public fastForward() {
        this.dotsAndBoxes.fastForward()
    }

    public backward() {
        this.hideExtendedMenu()
        this.dotsAndBoxes.backward()
    }

    public fastBackward() {
        this.dotsAndBoxes.fastBackward()
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
            case STYLE:
                this.resize()
                break
            case CODE:
                this._code = newValue
                if (this.dotsAndBoxes) {
                    this.applyCode()
                }
                break
            case COLOR:
                this.color = newValue
                break
            case BORDER:
                this.border = newValue
                break
            case CONTROLS:
                this.showControls = newValue != null
                if (this.dotsAndBoxes) {
                    this.updateControls()
                }
                break
            case EXPERIMENTAL:
                this.experimental = newValue != null
                if (this.dotsAndBoxes) {
                    this.updateControls()
                }
                break
            case KEYBOARD:
                this.keyboard = newValue != null
                this.updateKeyboardHandler()
                break
            case AUTOPLAY:
                this.autoplay = newValue != null
                if (this.dotsAndBoxes) {
                    this.fastForward()
                }
                break
            case DEBUG:
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
