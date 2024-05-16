/* const { default: axios } = require("axios"); */

let currentPage = 1
let lastPage = 1
//===== INFINITE SCROLL ====//
window.addEventListener("scroll", function () {
    const endOfPage = window.innerHeight + window.pageYOffset >= document.body.offsetHeight;
    console.log(endOfPage);
    if (endOfPage && currentPage < lastPage) {
        getPosts(currentPage + 1, false)
        currentPage++
    }
});
//=====// INFINITE SCROLL //====//


//=====API Request for Posts====//
function getPosts(page = 1, reload = true) {
    axios.get(`${baseUrl}/posts?limit=4&page=${page}`)
        .then((response) => {
            console.log(response.data);
            lastPage = response.data.meta.last_page

            if (reload) {
                document.getElementById('posts').innerHTML = ''
            }

            const posts = response.data.data
            for (let post of posts) {
                let user = getCurrentUser()
                let isMyPost = user != null && post.author.id == user.id
                let edit = ``
                let Delete = ``
                if (isMyPost == true) {
                    edit = `<button class="edit-btn" style="float: right;margin-right:7px" onclick ="handleEditClicked('${encodeURIComponent(JSON.stringify(post))}')">Edit</button>`
                    Delete = `<button class="edit-btn" data-bs-toggle="modal" data-bs-target="#delete-post-modal" style="float: right;background-color:red;color:snow" onclick ="handleDeleteClicked('${encodeURIComponent(JSON.stringify(post))}')">Delete</button>`
                }
                document.getElementById('posts').innerHTML += `
        <div class="card" style="background-color:black";>
             <div class="card-header">
                 <img class="rounded-circle border border-1" style="width: 4%; height: 4vh"
                     src=${post.author.profile_image} alt="">
                 <b class='email'>${post.author.email ? post.author.email : ''}</b>
                    ${Delete}
                       
                    ${edit}
                                
            <div>   
        </div>
             
        <div class="card-body" onClick='postClicked(${post.id})' style='cursor: pointer;'>
                 <img class="w-100" src=${post.image} alt="" style='opacity:1'>
                 <h6 class="fs-6 fw-medium text-secondary">${post.created_at}</h6>
                 <h4 class='title'>${post.title ? post.title : ''}</h4>
                
                 <p class='body'>${post.body}</p>
                 <hr class='hr'>
                 <div style="display: flex;align-items: center;gap:6px;">
                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                         class="bi bi-pen" viewBox="0 0 16 16">
                         <path style='color: white;'
                             d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z" />
                     </svg>
                     <span class='comments'>
                         (${post.comments_count}) Comments
                     </span>
                    
                     <span id=post-tags${post.id}>
                                   
                     </span>
                     
              
                     </div>
             </div>
         </div>
     `
                let currentPostTagsId = `post-tags${post.id}`
                document.getElementById(currentPostTagsId).innerHTML = ''
                for (tag of post.tags) {
                    document.getElementById(currentPostTagsId).innerHTML += `
           <button class="btn btn-sm rounded-5 text-white fw-semibold" style="background-color: gray;">${tag.name}</button>
         `
                }
            }

        })
}
//=====//API Request for Posts//====//
getPosts()

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
            const message = error.response.data.message
            showAlert(message)
            /* Closing Login-Modal after Login Process */
            const modal = document.getElementById('add-post-modal')
            const modalInstance = bootstrap.Modal.getInstance(modal)
            modalInstance.hide()
            /*=== Closing Login-Modal after Login Process ===*/

        })
}
//=====//API REQUEST FOR CREATE-POST//====//


/*================================================================
  Call the tokenCheck function directly in order to know the token status,
  and based on knowing the token status,
  the appropriate buttons are shown
  ================================================================*/
setupUIBasedOnTokenStatus()
/*=================================================================*/

function postClicked(postId) {
    /* alert(postId) */
    window.location = `postDetails.html?postId=${postId}`
}

function handleAddBtnClicked() {
    document.getElementById('post-id-input').value = ''

    document.getElementById('post-modal-title').innerHTML = 'Create A New Post'
    document.getElementById('post-modal-btn').innerHTML = 'Create'
    document.getElementById('post-title').value = ''
    document.getElementById('post-body').value = ''
    document.getElementById('post-image').files[0] = ''

    let postModal = new bootstrap.Modal(document.getElementById('add-post-modal'), {})
    postModal.toggle()
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

function handleDeleteClicked(postObject) {
    console.log(JSON.parse(decodeURIComponent(postObject)));
    let post = JSON.parse(decodeURIComponent(postObject))
    document.getElementById('delete-post-modal-input').value = post.id

}
function handleDeleteConfirm() {
    let postId = document.getElementById('delete-post-modal-input').value
    const token = localStorage.getItem('token')
    /* alert(postId)
    alert(token) */
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
        })
}
