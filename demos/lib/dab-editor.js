// import * as Prism from './prism.js'
import * as Prism from './prism.js'

class DabEditor extends HTMLElement {
    static observedAttributes = ["code", "edit", "width", "height", 'controls']

    // noinspection JSUnusedGlobalSymbols
    connectedCallback() {
        const shadow = this.attachShadow({mode: "open"})
        shadow.innerHTML = `
      <link href="./lib/prism.css" rel="stylesheet" type="text/css">  

      <style>
        :host { display: block;  padding: 0; border: 1px solid #ccc ;}
        .main-wrapper {
          overflow: auto;
        }
        .editor {
            line-height:1.2em;
            background-size:2.4em 2.4em;
            background-origin:content-box;
            counter-reset: line;
            margin-top: 5px;
            padding-left: 10px;
            text-align:justify;
            font-family: monospace;
            /*resize: both;*/
            overflow: auto;
            width: max-content
        }
        
       [contenteditable]:focus { 
            outline: 0 solid transparent; 
        } 
        
        .main-menu {
           height: 30px;
           margin-top: 0;
           margin-left: 0;
           width: max-content
           position: absolute;
           display: flex;           
           background-color: rgba(243,243,243,0.7);
        }
        .separator {
          flex-grow:1;
        }
        .right-menu {
            flex-grow: ;
            display: flex;          
            width: max-content            
        }
        .main-menu  button {
          border: 1px solid transparent;
          background-color: transparent;
        }
        .main-menu  button:hover {
          border: 1px solid lightgray ;
        }
        .editor .token {
            font-weight: bold;
        }
      </style>
      <script src="./prism.js"></script>
      <div class="main-menu">             
          <button title="run code">▶</button>
          <span class="separator"></span>
          <div class="right-menu"><button title="copy to clipboard" id="copy-clipboard">📋</button></div> 
        </div>
      <div class="main-wrapper">      
        <pre class="editor" spellcheck=false  contenteditable></pre>
      </div>
     `
        const clipBoardButton = this.shadowRoot.querySelector('#copy-clipboard')
        clipBoardButton.onclick = (_) => this.copyToClipBoard(this.code)
        this.extendDABLang()
        this.updateCode()
     }

    extendDABLang(){
        window.Prism.languages['dabl'] = window.Prism.languages.extend('clike', {

            'keyword': /\b(?:steps|title|selected|box|dot)\b/,


        });
    }

    copyToClipBoard(txt) {
        navigator.clipboard.writeText(txt);
    }


    updateCode() {
        if (this.shadowRoot) {
            const editor = this.shadowRoot.querySelector('.editor')
            editor.innerHTML =  window.Prism.highlight(this.code, window.Prism.languages.dabl, 'dabl')

        }
    }

    // noinspection JSUnusedGlobalSymbols
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'code') {
            this.code = newValue
            this.updateCode()
        }

    }

}

customElements.define('dab-editor', DabEditor)