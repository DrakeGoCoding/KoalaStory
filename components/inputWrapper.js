class InputWrapper extends HTMLElement {
    constructor() {
        super();
        this.shadowDom = this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.type = this.getAttribute('type');
        this.placeHolder = this.getAttribute('placeholder');
        this.alertMessage = this.getAttribute('alert-message') || '';
        this.shadowDom.innerHTML = `
            ${STYLE}
            <div class="wrapper">
                <input id="wrapper-input" type="${this.type}" placeholder="${this.placeHolder}">
                <div class="alert">${this.alertMessage}</div>
            </div>
        `
    }

    static get observedAttributes() {
        return ['type', 'placeholder', 'alert-message'];
    }

    attributeChangedCallback(attribute, oldValue, newValue) {
        if (attribute === 'alert-message') 
            this.shadowDom.querySelector('.alert').innerHTML = newValue;
    }

    get value() {
        return this.shadowDom.querySelector('#wrapper-input').value;
    }
}

const STYLE = `
    <style>
        #wrapper-input{
            width: 100%;
            height: 3rem;
            font-size: 1.5rem;
            padding: 0 1rem;
            border: 1px solid #dddfe2;
            border-radius: 5px;
            box-sizing: border-box;
        }

        #wrapper-input:focus{
            border: 1px solid #3d7ea6;
            outline: none;
        }

        .alert{
            margin-top: 0.5rem;
            color: red;
        }
    </style>
`

customElements.define('input-wrapper', InputWrapper);