const baseUrl = 'https://tarmeezacademy.com/api/v1'

setupUIBasedOnTokenStatus()

//SHOW THE APPROPRIATE BUTTONS AND INPUTS BASED ON THE TOKEN STATUS
function setupUIBasedOnTokenStatus() {
    const token = localStorage.getItem('token')
    const loginAndRegisterDiv = document.getElementById('login-register-div')
    const logoutDiv = document.getElementById('logout-div')
    const addPostButton = document.getElementById('add-btn')
    const inputBtnDiv = document.getElementById('input-btn-div')
    if (token) {
        loginAndRegisterDiv.setAttribute('style', 'display:none !important');
        logoutDiv.setAttribute('style', 'display:flex;justify-content:center;align-items:center;gap:20px !important');
        if (addPostButton != null && inputBtnDiv != null) {
            addPostButton.style.display = 'block'
        }
        if (inputBtnDiv != null) {
            inputBtnDiv.setAttribute('style', 'display:flex !important');
        }
        const user = getCurrentUser()
        document.getElementById('user-name').innerHTML = user.username
        document.getElementById('user-image').src = user.profile_image
    }
    else {
        loginAndRegisterDiv.setAttribute('style', 'display:flex !important');
        logoutDiv.setAttribute('style', 'display:none !important');
        if (addPostButton != null && inputBtnDiv != null) {
            addPostButton.style.display = 'none'
        }

        if (inputBtnDiv != null) {
            inputBtnDiv.setAttribute('style', 'display:none !important');

        }
    }
}
/*EXTRACT THE USER FROM LOCALSTORAGE then CONVERT IT TO AN OBJECT USING (JSON.parse)
  AND STORE IT INSIDE A VARIABLE NAMED USER*/
function getCurrentUser() {
    let user = null
    const storageUser = localStorage.getItem("user")

    if (storageUser != null) {
        user = JSON.parse(storageUser)
    }
    return user
}

/*--------------------------AUTH FUNCTION----------------------------*/
//API REQUEST FOR A LOGIN
function handleLoginClicked() {
    let username = document.getElementById('username').value
    let password = document.getElementById('password').value

    const loginPramers = {
        "username": username,
        "password": password
    }
    axios.post(`${baseUrl}/login`, loginPramers)
        .then((response) => {
            console.log(response.data);
            localStorage.setItem('token', response.data.token)
            localStorage.setItem('user', JSON.stringify(response.data.user))

            /* Closing Login-Modal after Login Process */
            const modal = document.getElementById('login-modal')
            const modalInstance = bootstrap.Modal.getInstance(modal)
            modalInstance.hide()
            /*=== Closing Login-Modal after Login Process ===*/
            setupUIBasedOnTokenStatus()
            showAlert('Logged In Successfully')
            getPosts()


        }).catch((error) => {
            console.log(error);
            const message = error.response.data.message
            console.log(message);
            showAlert(message)

            /* Closing Add-Post-Modal after Adding Process */
            const modal = document.getElementById('login-modal')
            const modalInstance = bootstrap.Modal.getInstance(modal)
            modalInstance.hide()
            /*=== Closing Add-Post-Modal after Adding Process ===*/
        })
}

//REMOVE THE TOKEN FROM LOCALSTORAGE WHEN LOGGING OUT
function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    showAlert('Logged Out Successfully')
    document.getElementById('login-success-alert').classList[0]

    setupUIBasedOnTokenStatus()
    getPosts()


}

//ALERT LOGIC FOR LOGIN && LOGOUT    
function showAlert(customMassage) {


    $('#login-success-alert').fadeIn(1000);
    document.getElementById('login-success-alert').innerHTML = customMassage
    setTimeout(function () {
        $('#login-success-alert').fadeOut(1000);
        document.getElementById('login-success-alert').innerHTML = customMassage

    }, 3000);
}

//API REQUEST FOR Register 
function handleRegisterClicked() {
    const registerUrl = `${baseUrl}/register`
    let username = document.getElementById('username').value
    let password = document.getElementById('password').value
    let name = document.getElementById('name-input').value
    let userImage = document.getElementById('image-input').files[0]

    const form = new FormData();
    form.append("username", username);
    form.append("password", password,);
    form.append("name", name);
    form.append('image', userImage);

    /* Closing Register-Modal after Register Process */
    const modal = document.getElementById('register-modal')
    const modalInstance = bootstrap.Modal.getInstance(modal)
    modalInstance.hide()
    /*=== Closing Register-Modal after Register Process ===*/

    axios.post(`${baseUrl}/register`, form)
        .then((response) => {
            console.log(response.data);
            localStorage.setItem('token', response.data.token)
            localStorage.setItem('user', JSON.stringify(response.data.user))

            showAlert('Logged In Successfully')
            setupUIBasedOnTokenStatus()
        }).catch(function (error) {
            console.log(error)
            const message = error.response.data.message
            showAlert(message)
        })
}
/*==========================AUTH FUNCTION=============================*/









function handleDeleteClicked(postObject) {
    console.log(JSON.parse(decodeURIComponent(postObject)));
    let post = JSON.parse(decodeURIComponent(postObject))
    document.getElementById('delete-post-modal-input').value = post.id

}
function handleDeleteConfirm() {
    let postId = document.getElementById('delete-post-modal-input').value
    const token = localStorage.getItem('token')
    let url = `${baseUrl}/posts/${postId}`
    let headers = {
        'Authorization': `Bearer ${token}`
    }
    axios.delete(url, {
        headers: headers
    })
        .then((response) => {
            console.log(response);
            getPosts()
            /* Closing Delete-Modal after Login Process */
            const modal = document.getElementById('delete-post-modal')
            const modalInstance = bootstrap.Modal.getInstance(modal)
            modalInstance.hide()
            /*=== Closing Delete-Modal after Login Process ===*/
            showAlert('Deleted In Successfully')
        }).catch((error) => {
            const message = error.response.data.message
            console.log(message);
            showAlert(message)
        })
}



function handleEditClicked(postObject) {
    console.log(JSON.parse(decodeURIComponent(postObject)));
    let post = JSON.parse(decodeURIComponent(postObject))
    console.log(post.image);
    document.getElementById('post-id-input').value = post.id

    document.getElementById('post-modal-title').innerHTML = 'Edit Post'
    document.getElementById('post-modal-btn').innerHTML = 'Update'
    document.getElementById('post-title').value = post.title
    document.getElementById('post-body').value = post.body
    document.getElementById('post-image').files[0] = post.image
    let editPostModal = new bootstrap.Modal(document.getElementById('add-post-modal'))
    editPostModal.toggle()
}



//=====API REQUEST FOR CREATE-POST====//
function createNewPost() {
    let postId = document.getElementById('post-id-input').value
    /* alert(postId) */

    let isCreate = postId == null || postId == ''
    /* alert(isCreate) */

    const title = document.getElementById('post-title').value
    const body = document.getElementById('post-body').value
    const image = document.getElementById('post-image').files[0]

    const form = new FormData();
    form.append('title', title);
    form.append('body', body);
    form.append('image', image);

    const token = localStorage.getItem('token')
    const headers = { 'Authorization': `Bearer ${token}` }
    let url = ``

    if (isCreate) {
        url = `${baseUrl}/posts`
    } else {
        form.append("_method", "put");
        url = `${baseUrl}/posts/${postId}`
    }

    axios.post(url, form, { headers: headers })
        .then((response) => {
            console.log(response);
            showAlert('New Post Has Been Created In Successfully')
            getPosts()
            /* Closing Login-Modal after Login Process */
            const modal = document.getElementById('add-post-modal')
            const modalInstance = bootstrap.Modal.getInstance(modal)
            modalInstance.hide()
            /*=== Closing Login-Modal after Login Process ===*/
        }).catch((error) => {
            console.log(error.response.data.message);
            let message = error.response.data.message
            showAlert(message)
            /* Closing Login-Modal after Login Process */
            const modal = document.getElementById('add-post-modal')
            const modalInstance = bootstrap.Modal.getInstance(modal)
            modalInstance.hide()
            /*=== Closing Login-Modal after Login Process ===*/

        })
}
//=====//API REQUEST FOR CREATE-POST//====//



