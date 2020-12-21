import { addPostDocument, getItemFromLocalStorage, uploadFileToFireStore } from "../utils.js";

export class PostCreator extends HTMLElement {
    constructor() {
        super();
        this.shadowDom = this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.shadowDom.innerHTML = `
            ${STYLE}
            <div class="post-creator-container">
                <form id="post-form">
                    <textarea id="post-content" name="content" 
                        cols="50" rows="5" 
                        placeholder="What's on your mind?" 
                        spellcheck="false"></textarea> <br>
                    <input type="file" id="post-file" name="file">
                    <button id="post-btn" type="submit" disabled>Post</button>
                </form>
            </div>
        `
        const currentUser = getItemFromLocalStorage('currentUser');
        const postForm = this.shadowDom.querySelector('#post-form');
        const postContentInput = this.shadowDom.querySelector('#post-content');
        const postFilesInput = this.shadowDom.querySelector('#post-file');

        postContentInput.onkeyup = () => {
            const postContent = postContentInput.value.trim();
            if (postContent.length > 0)
                this.shadowDom.querySelector('#post-btn').removeAttribute('disabled');
            else
                this.shadowDom.querySelector('#post-btn').setAttribute('disabled', true);
        }

        postForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const newPost = {
                'userID': currentUser.id,
                'content': postContentInput.value,
                'comments': [],
                'createdDate': new Date().toISOString(),
                'isPublic': true
            }

            const res = await addPostDocument(newPost);
            const fileUrl = await uploadFileToFireStore(postFilesInput.files[0]);
            postForm.reset();

            this.updateFileList(fileUrl, res.id);
        })
    }

    updateFileList(url, docId){
        const dataUpDate = {
            files: firebase.firestore.FieldValue.arrayUnion(url)
        }

        firebase.firestore().collection('posts').doc(docId).update(dataUpDate);
    }
}

customElements.define('post-creator', PostCreator);

const STYLE = `
    <style>
        *{
            font-family: 'Ubuntu', sans-serif;
        }

        .post-creator-container{
            width: 100%;
            padding: 20px 0;
            display: flex;
            justify-content: center;
        }

        #post-form{
            width: 40%;
        }

        #post-content{
            width: 100%;
            padding: 1rem 1rem;
            font-size: 1.5rem;
            border-style: none;
            border-radius: 6px;
            outline: none;
            resize: none;
            box-sizing: border-box;
        }

        #post-content::placeholder{
            text-align: center;
            line-height: 130px;
        }

        #post-btn{
            margin-top: 0.5rem;
            width: 100%;
            font-size: 1.5rem;
            padding: 0.25rem 0;
            color: white;
            background-color: #1d9ced;
            border-style: none;
            border-radius: 6px;
            user-select: none;
        }

        #post-btn:disabled{
            background-color: #e4e6eb;
        }

        #post-btn:disabled:hover{
            background-color: #e4e6eb;
            cursor: not-allowed;
        }

        #post-btn:focus{
            border: none;
            outline: none;
        }

        #post-btn:hover{
            background-color: #3d7ea6;
            cursor: pointer;
        }
    </style>
`;