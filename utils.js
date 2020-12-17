export function getDataFromDoc(doc) {
    const data = doc.data();
    data.id = doc.id;
    return data;
}

export function getDataFromDocs(docs) {
    return docs.map(getDataFromDoc);
}

// ------------------------------------------------------
// ------------------------------------------------------
// ------------------------------------------------------

export async function getUserDocumentByID(id) {
    const res = await firebase.firestore().collection('users').doc(id).get();
    const user = getDataFromDoc(res);
    return user;
}

export async function getUserDocuments() {
    const res = await firebase.firestore().collection('users').get();
    let users = getDataFromDocs(res.docs);
    return users;
}

export function addUserDocument(data) {
    const res = firebase.firestore().collection('users').add(data);
    return res;
}

export async function getUserDocumentsByEmail(email) {
    const res = await firebase.firestore()
        .collection('users')
        .where("email", "==", email)
        .get();
    const users = getDataFromDocs(res.docs);
    return users;
}

// ------------------------------------------------------
// ------------------------------------------------------
// ------------------------------------------------------

export async function getPostDocumentsByUserID(userID) {
    const res = await firebase.firestore()
        .collection('posts')
        .where('userID', '==', userID)
        .get();
    const posts = getDataFromDocs(res.docs);
    return posts;
}

export async function getPublicPostDocuments() {
    const res = await firebase.firestore()
        .collection('posts')
        .where('isPublic', '==', true)
        .get();
    const posts = getDataFromDocs(res.docs);
    return posts;
}

export function addPostDocument(post) {
    const res = firebase.firestore().collection('posts').add(post);
    return res;
}

// ------------------------------------------------------
// ------------------------------------------------------
// ------------------------------------------------------

export function isValidRegistration(firstName, lastName, email, password, confirmPassword) {
    return isValidName(firstName + lastName) &&
        isValidEmail(email) &&
        isValidPassword(password) &&
        password === confirmPassword;
}

export function isValidName(name) {
    let regex = /^[a-zA-Z-' ]*$/;
    return regex.test(name) && name.length > 0;
}

export function isValidEmail(email) {
    let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
}

export function isValidPassword(password) {
    let regex = /^[a-zA-Z0-9]{6,15}$/;
    return regex.test(password);
}

/**
 * 
 * @param {String} key 
 * @param {Object} value 
 */
export function writeToLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

/**
 * 
 * @param {String} key
 */
export function getItemFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
}

/**
 * 
 * @param {Date} date 
 */
export function formatDate(date) {
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
}

export function compareCreatedDate(a, b) {
    return new Date(b.createdDate) - new Date(a.createdDate);
}

export async function uploadFileToFireStore(file){
    if (file){
        const fileName = file.name;
        const filePath = `file/${fileName}`;
        const ref = firebase.storage().ref().child(filePath);
        await ref.put(file);
        return getFileUrl(ref);
    }
}

function getFileUrl(fileRef) {
    return `https://firebasestorage.googleapis.com/v0/b/${fileRef.bucket}/o/${encodeURIComponent(fileRef.fullPath)}?alt=media`
}