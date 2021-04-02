import { getDataFromDoc, getItemFromLocalStorage, compareCreatedDate, getPublicPostDocuments } from '../utils.js'

export class PostWrapperList extends HTMLElement {
    constructor() {
        super();
        this.shadowDom = this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {
        const currentUser = getItemFromLocalStorage('currentUser');
        const posts = await getPublicPostDocuments();
        this.observePostCollectionChange();

        let postListHTML = '';

        posts.sort(compareCreatedDate);
        posts.forEach(post => {
            postListHTML += `
                <post-wrapper 
                    user-name="${currentUser.fullName}"
                    created-time="${post.createdDate}"
                    content="${post.content}">
                </post-wrapper>
            `
        })
        this.shadowDom.innerHTML = `
            ${STYLE}
            <div class="post-list">${postListHTML}</div>
        `
    }

    observePostCollectionChange() {
        let firstRun = true;
        firebase.firestore()
            .collection('posts')
            .where('isPublic', '==', true)
            .onSnapshot(snapShot => {
                if (firstRun) firstRun = false;
                else {
                    const docChanges = snapShot.docChanges();
                    for (const docChange of docChanges) {
                        if (docChange.type === 'added') {
                            this.appendNewPost(getDataFromDoc(docChange.doc));
                        }
                    }
                }
            });
    }

    appendNewPost(data) {
        const currentUser = getItemFromLocalStorage('currentUser');
        const newPostWrapper = document.createElement("post-wrapper");
        newPostWrapper.setAttribute('user-name', currentUser.fullName);
        newPostWrapper.setAttribute('created-time', data.createdDate);
        newPostWrapper.setAttribute('content', data.content);

        const postList = this.shadowDom.querySelector('.post-list');
        postList.insertBefore(newPostWrapper, postList.firstChild);
    }
}

customElements.define('post-wrapper-list', PostWrapperList);

const STYLE = `
    <style>
        .post-list{
            display: flex; 
            justify-content: center; 
            width: 100%; 
            flex-direction: column; 
            align-items: center;
        }

        post-wrapper{
            width: 40%;
        }
    </style>
`