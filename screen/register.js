import { addUserDocument, getUserDocumentsByEmail, isValidEmail, isValidName, isValidPassword, isValidRegistration } from "../utils.js"

export class RegisterScreen extends HTMLElement {
    constructor() {
        super();
        this.shadowDom = this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.shadowDom.innerHTML = `
            ${STYLE}
            <div class="register-container">
                <form id="register-form">
                    <h1>CI Project</h1>
                    <div id="full-name">
                        <input-wrapper id="first-name" type="text" placeholder="First name"></input-wrapper>
                        <input-wrapper id="last-name" type="text" placeholder="Last name"></input-wrapper>
                    </div>
                    <input-wrapper id="email" type="email" placeholder="Email"></input-wrapper>
                    <input-wrapper id="password" type="password" placeholder="Password"></input-wrapper>
                    <input-wrapper id="confirm-password" type="password" placeholder="Confirm password"></input-wrapper>
                    <button type="submit">Register</button>
                    <div id="redirect-login"><a>Already have an account?</a></div>
                </form>
            </div>
        `

        const redirectLogin = this.shadowDom.querySelector('#redirect-login');
        redirectLogin.onclick = () => router.navigate('/login');

        const registerForm = this.shadowDom.querySelector('#register-form');

        const firstNameInput = registerForm.querySelector('#first-name');
        firstNameInput.onkeyup = () => {
            const firstName = firstNameInput.value.trim();
            if (firstName.length === 0) firstNameInput.setAttribute('alert-message', 'First name?');
            else if (!isValidName(firstName)) firstNameInput.setAttribute('alert-message', 'Only letters and white spaces allowed');
            else firstNameInput.removeAttribute('alert-message');
        }

        const lastNameInput = registerForm.querySelector('#last-name');
        lastNameInput.onkeyup = () => {
            const lastName = lastNameInput.value.trim();
            if (lastName.length === 0) lastNameInput.setAttribute('alert-message', 'Last name?');
            else if (!isValidName(lastName)) lastNameInput.setAttribute('alert-message', 'Only letters and white spaces allowed');
            else lastNameInput.removeAttribute('alert-message');
        }

        const emailInput = registerForm.querySelector('#email');
        emailInput.onkeyup = () => {
            const email = emailInput.value;
            if (email.length === 0) emailInput.setAttribute('alert-message', 'Please fill in your email');
            else if (!isValidEmail(email)) emailInput.setAttribute('alert-message', 'Invalid email format');
            else emailInput.removeAttribute('alert-message');
        }

        const passwordInput = registerForm.querySelector('#password');
        passwordInput.onkeyup = () => {
            const password = passwordInput.value;
            if (!isValidPassword(password)) passwordInput.setAttribute('alert-message', 'Password must be 6-15 characters containing only digits and/or numbers');
            else passwordInput.removeAttribute('alert-message');
        }

        const confirmPasswordInput = registerForm.querySelector('#confirm-password');
        confirmPasswordInput.onkeyup = () => {
            const confirmPassword = confirmPasswordInput.value;
            if (confirmPassword.length === 0) confirmPasswordInput.setAttribute('alert-message', 'Please confirm your password');
            else if (confirmPassword !== passwordInput.value) confirmPasswordInput.setAttribute('alert-message', 'Confirm password did not match');
            else confirmPasswordInput.removeAttribute('alert-message');
        }

        registerForm.addEventListener('submit', e => {
            e.preventDefault();
            const firstName = firstNameInput.value.trim();
            const lastName = lastNameInput.value.trim();
            const email = emailInput.value.trim();
            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;
            if (isValidRegistration(firstName, lastName, email, password, confirmPassword)) {
                getUserDocumentsByEmail(email).then(users => {
                    if (users.length > 0) emailInput.setAttribute('alert-message', 'Email already exists');
                    else {
                        const newUser = {
                            'fullName': firstName + ' ' + lastName,
                            'email': email,
                            'password': CryptoJS.MD5(password).toString(CryptoJS.enc.Hex)
                        }
                        addUserDocument(newUser);
                        emailInput.removeAttribute('alert-message');
                        alert('Register successfully');
                        router.navigate('/login');
                    }
                })
            }
        })
    }
}

customElements.define('register-screen', RegisterScreen);

const STYLE = `
    <style>
        .register-container{
            width: 100vw;
            height: 100vh;
            display: flex;
            justify-content: flex-end;
            background: url('https://picsum.photos/id/1/1920/1080');
            background-repeat: no-repeat;
            background-size: cover;
        }

        #register-form{
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

        #full-name{
            display: flex;
        }

        #first-name{
            width: 65%;
        }

        #last-name{
            width: 45%;
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

        #redirect-login{
            color: #1d9ced;
            margin-top: 1rem;
        }

        #redirect-login:hover{
            color: #3d7ea6;
            cursor: pointer;
        }
    </style>
`