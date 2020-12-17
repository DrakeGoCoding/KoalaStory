import { formatDate } from '../utils.js'

export class PostWrapper extends HTMLElement {
    constructor() {
        super();
        this.shadowDom = this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.userName = this.getAttribute('user-name');
        this.createdTime = this.getAttribute('created-time');
        this.content = this.getAttribute('content');
        this.shadowDom.innerHTML = `
            ${STYLE}
            <div class="user-post">
                <div class="user-post-header">
                    <i class="fa fa-user-circle-o" aria-hidden="true"></i>
                    <div class="user-post-info">
                        <div class="user-name">${this.userName}</div>
                        <div class="user-post-time">${formatDate(new Date(this.createdTime))}</div>
                    </div>    
                </div>
                <div class="user-post-detail">
                    <div class="user-post-content">${this.content}</div>
                    <div class="user-post-figures"></div>
                </div>         
            </div>
        `
    }
}

customElements.define('post-wrapper', PostWrapper);

const STYLE = `
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <style>
        .user-post{
            margin-bottom: 1rem; 
            background-color: white; 
            padding: 1rem; 
            box-sizing: border-box;
            border-radius: 6px;
        }

        .user-post-header{
            display: flex;
        }

        .user-post-header i{
            font-size: 2rem; 
            margin-right: 0.5rem;
            color: #6ccfff
        }

        .user-post-header .user-post-info .user-name{
            font-weight: 600;
            margin-bottom: 5px;
            color: #6ccfff
        }

        .user-post-header i:hover{
            cursor: pointer;
        }

        .user-post-header .user-post-info .user-name:hover{
            cursor: pointer;
        }

        .user-post-header .user-post-info .user-post-time{
            font-size: 0.8rem;
            font-weight: 600;
            color: gray;
        }

        .user-post-detail .user-post-content{
            margin: 1rem 0;
        }
    </style>
`