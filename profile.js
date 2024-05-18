baseUrl = 'https://tarmeezacademy.com/api/v1'

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('userId')
console.log(id);

function getUser() {
    axios.get(`${baseUrl}/users/${id}`)
        .then((response) => {
            console.log(response.data.data);
            const user = response.data.data
            document.getElementById('user-email').innerHTML = user.email
            document.getElementById('user-username').innerHTML = user.username
            document.getElementById('name').innerHTML = user.name
            document.getElementById('user-posts-count').innerHTML = user.posts_count
            document.getElementById('user-comments-count').innerHTML = user.comments_count
            document.getElementById('user-img').src = user.profile_image
        })
}
getUser()
//=====API Request for Posts====//
function getPosts() {
    axios.get(`${baseUrl}/users/${id}/posts`)
        .then((response) => {
            console.log(response.data.data);
            /* const posts = response.data.data */
            const posts = response.data.data
            document.getElementById('posts').innerHTML = ''
            for (let post of posts) {
                let user = getCurrentUser()
                let isMyPost = user != null && post.author.id == user.id
                let edit = ``
                let Delete = ``
                if (isMyPost == true) {
                    edit = `<button class="edit-btn" style="float: right;margin-right:7px" onclick ="handleEditClicked('${encodeURIComponent(JSON.stringify(post))}')">Edit</button>`
                    Delete = `<button class="delete-btn" data-bs-toggle="modal" data-bs-target="#delete-post-modal" style="float: right;background-color:red;color:snow" onclick ="handleDeleteClicked('${encodeURIComponent(JSON.stringify(post))}')">Delete</button>`
                }
                document.getElementById('posts').innerHTML += `
        <div class="card">
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



/* function showPostsOneuser() {
    console.log(id);
} */

/* showPostsOneuser() */