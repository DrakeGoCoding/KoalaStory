import { getItemFromLocalStorage } from '../utils.js';

export class StoryHeader extends HTMLElement {
    constructor() {
        super();
        this.shadowDom = this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.shadowDom.innerHTML = `
            ${STYLE}
            <div class="story-header-container">
                <div class="logo">
                    <img src="./imgs/koala.png" alt="Web Icon">
                    <div class="branch">Koala's story</div>
                </div>

                <div class="user-feature">
                    <div class="avatar">
                        <i class="fa fa-user-circle-o" aria-hidden="true"></i>
                        <div class="user-name">${getItemFromLocalStorage('currentUser').fullName}</div>
                    </div>
                    <div class="sign-out-btn">
                        <i class="fa fa-sign-out" aria-hidden="true"></i>
                    </div>
                </div>      
            </div>
        `

        const signOutBtn = this.shadowDom.querySelector('.sign-out-btn');
        signOutBtn.onclick = () => {
            localStorage.removeItem('currentUser');
            router.navigate('login');
        }
    }
}

customElements.define('story-header', StoryHeader);

const STYLE = `
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <style>
        *{
            margin: 0;
            padding: 0;
            font-family: 'Ubuntu', sans-serif;
        }

        .story-header-container{
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 1%;
            height: 60px;
            background-color: #6ccfff;
            position: sticky;
            top: 0;
        }

        .logo{
            display: flex;
            align-items: center;
            color: white;
        }

        .logo img{
            width: 40px;
            height: 40px;
        }

        .logo .branch{
            margin-left: 1rem;
            font-size: 1.5rem;
            font-weight: 600;           
        }
    
        .user-feature{
            display: flex;
            font-size: 1.8rem;
            color: white;
        }

        .user-feature .avatar{
            display: flex;
            align-items: center;
            margin-right: 1rem;
        }

        .user-feature .avatar .user-name{
            font-size: 1.5rem;
            font-weight: 600;
            margin-left: 0.5rem; 
        }

        .logo img:hover, .user-feature .avatar .user-name:hover{
            cursor: pointer;
        }

        .fa{
            background-color: transparent;
            border: none;
            outline: none;
            cursor: pointer;
        }

        .fa:hover{
            color: black;
            transition: all ease-in-out 0.5s;
        }
    </style>
`