const baseUrl = 'https://tarmeezacademy.com/api/v1'

//SHOW THE APPROPRIATE BUTTONS AND INPUTS BASED ON THE TOKEN STATUS
function tokenStatus() {
    const loginAndRegisterDiv = document.getElementById('login-register-div')
    const logoutDiv = document.getElementById('logout-div')
    const addPostButton = document.getElementById('add-btn')

    const token = localStorage.getItem('token')
    //EXTRACT THE USER FROM LOCAL STORAGE AND CONVERT IT TO AN OBJECT USING JSON.PARSE
    const userObject = JSON.parse(localStorage.getItem('user'))
    const userName = document.getElementById('user-name')
    const userImage = document.getElementById('user-image')
    const inputBtnDiv = document.getElementById('input-btn-div')

    if (token) {
        loginAndRegisterDiv.setAttribute('style', 'display:none !important');
        logoutDiv.setAttribute('style', 'display:flex;justify-content:center;align-items:center;gap:20px !important');
        if (addPostButton != null) {
            addPostButton.style.display = 'block'
        }
        userName.innerHTML = userObject.username
        userImage.src = userObject.profile_image
        if (inputBtnDiv != null) {
            inputBtnDiv.setAttribute('style', 'display:flex !important');
            /* inputBtnDiv.style.display = 'flex' */
        }



    } else {
        loginAndRegisterDiv.setAttribute('style', 'display:flex !important');
        logoutDiv.setAttribute('style', 'display:none !important');
        if (addPostButton != null) {
            addPostButton.style.display = 'none'
        }

        userName.innerHTML = ''
        userImage.src = ''
        if (inputBtnDiv != null) {
            inputBtnDiv.setAttribute('style', 'display:none !important');
            /* inputBtnDiv.style.display = 'none' */
        }
    }
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
            tokenStatus()
            showAlert('Logged In Successfully')

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

    tokenStatus()

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
            tokenStatus()
        }).catch(function (error) {
            console.log(error)
            const message = error.response.data.message
            showAlert(message)
        })
}
/*==========================AUTH FUNCTION=============================*/

