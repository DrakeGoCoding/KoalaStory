import { getUserDocumentsByEmail, writeToLocalStorage } from "../utils.js";

export class LoginScreen extends HTMLElement {
    constructor() {
        super();
        this.shadowDom = this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.shadowDom.innerHTML = `
            ${STYLE}
            <div class="login-container">
                <form id="login-form">
                    <h1>CI Project</h1>
                    <input-wrapper id="email" type="email" placeholder="Email"></input-wrapper>
                    <input-wrapper id="password" type="password" placeholder="Password"></input-wrapper>
                    <button type="submit">Login</button>
                    <div id="redirect-register"><a>Don't have an account?</a></div>
                </form>
            </div>
        `

        const redirectLogin = this.shadowDom.querySelector('#redirect-register');
        redirectLogin.onclick = () => router.navigate('register');

        const loginForm = this.shadowDom.querySelector('#login-form');
        const emailInput = loginForm.querySelector('#email');
        const passwordInput = loginForm.querySelector('#password');

        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = emailInput.value;
            const password = passwordInput.value;
            const users = await getUserDocumentsByEmail(email);

            if (users.length === 0) emailInput.setAttribute('alert-message', 'Email not found');
            else {
                const user = users[0];
                emailInput.removeAttribute('alert-message');
                if (CryptoJS.MD5(password).toString(CryptoJS.enc.Hex) === user.password) {
                    passwordInput.removeAttribute('alert-message');
                    writeToLocalStorage('currentUser', user);
                    router.navigate('story');
                }
                else passwordInput.setAttribute('alert-message', 'Incorrect password');
            }
        })
    }
}

customElements.define('login-screen', LoginScreen);

const STYLE = `
    <style>
        .login-container{
            width: 100vw;
            height: 100vh;
            display: flex;
            justify-content: flex-end;
            background: url('https://picsum.photos/id/1/1920/1080');
            background-repeat: no-repeat;
            background-size: cover;
        }

        #login-form{
            padding: 0 1.5rem;
            width: 30%;
            height: 100vh;
            background-color: white;
        }

        h1{
            text-align: center;
            color: #1d9ced;
            font-size: 3em;
        }

        input-wrapper{
            display: block;
            margin-bottom: 1rem;
        }

        button{
            width: 100%;
            font-size: 2rem;
            margin-top: 1rem;
            padding: 0.75rem 0;
            color: white;
            background-color: #1d9ced;
            border-style: none;
            border-radius: 6px;
            user-select: none;
        }

        button:focus{
            border: none;
            outline: none;
        }

        button:hover{
            background-color: #3d7ea6;
            cursor: pointer;
        }

        #redirect-register{
            color: #1d9ced;
            margin-top: 1rem;
        }

        #redirect-register:hover{
            color: #3d7ea6;
            cursor: pointer;
        }

        @media only screen and (max-width: 768px){
            #login-form{
                width: 100%;
            }
        }
    </style>
`