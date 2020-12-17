import './components/inputWrapper.js'
import './components/storyHeader.js'
import './components/postCreator.js'
import './components/postWrapper.js'
import './components/postWrapperList.js'

import './screen/register.js';
import './screen/login.js'
import './screen/story.js'

import { getItemFromLocalStorage } from './utils.js';

checkAuthentication();

async function checkAuthentication() {
    const currentUser = getItemFromLocalStorage('currentUser');
    if (currentUser) {
        const res = await firebase.firestore()
            .collection('users')
            .where('email', '==', currentUser.email)
            .where('password', '==', currentUser.password)
            .get();
        if (res.empty) redirect('login');
        else redirect('story');
    }
    else redirect('login');
}

export function redirect(screen) {
    if (screen === 'register') {
        document.querySelector('#main-container').innerHTML = `
            <register-screen></register-screen>
        `
    }
    else if (screen === 'login') {
        document.querySelector('#main-container').innerHTML = `
            <login-screen></login-screen>
        `
    }
    else if (screen === 'story') {
        document.querySelector('#main-container').innerHTML = `
            <story-screen></story-screen>
        `
    }
}