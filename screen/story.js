import '../components/postWrapper.js'

export class StoryScreen extends HTMLElement {
    constructor() {
        super();
        this.shadowDom = this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.shadowDom.innerHTML = `
            ${STYLE}
            <div class="story-screen-container">
                <story-header></story-header>
                <div class="story-body-container">
                    <post-creator></post-creator>
                    <post-wrapper-list></post-wrapper-list>
                </div> 
            </div>
        `

    }
}

customElements.define('story-screen', StoryScreen);

const STYLE = `
    <style>
        .story-screen-container{
            height: 100%;
        }

        .story-body-container{
            background-color: #f0f2f5;
            height: 100%;
        }
    </style>
`