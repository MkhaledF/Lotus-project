let urlParam = new URLSearchParams(window.location.search);
let userId = urlParam.get("userid")
setupUI()
getUser()
getUserPosts()


function getUser() {
    let id = userId
    axios.get(`https://tarmeezacademy.com/api/v1/users/${id}`)
    .then((response) => {
        let user = response.data.data;
        document.getElementById("profileImage").src = user.profile_image
        document.getElementById("profileEmail").innerHTML = user.email
        document.getElementById("profileName").innerHTML = user.name
        document.getElementById("profileUsername").innerHTML = user.username
        document.getElementById("postsCount").innerHTML = user.posts_count
        document.getElementById("commentsCount").innerHTML = user.comments_count
        document.getElementById("postOwnerTitle").innerHTML = `${user.username} Post`
    })
}
function getUserPosts() {
    let id = userId
    axios.get(`https://tarmeezacademy.com/api/v1/users/${id}/posts`)
    .then((response) => {
        let posts = response.data.data;
        let cardsDiv = document.getElementById("cardsDiv");
        cardsDiv.innerHTML = ""
        for (post of posts) {
            let user = getCurrentUser()
            let isMyPost = user != null && post.author.id == user.id
            let editButtonContent = ""
            let deleteButtonContent = ""
            if (isMyPost) {
                editButtonContent = `<i class="fa-regular fa-pen-to-square" id='editIcon' onclick='editPostBtnClicked(${JSON.stringify(post)})'></i>`
                deleteButtonContent = `<i class="fa-regular fa-trash-can" id='deleteIcon' onclick='deletePostBtnClicked(${JSON.stringify(post)})'></i>`
            }
            let content = `
                    <div class="card mb-3 shadow">
                        <div class="card-header d-flex align-items-center">
                            <div style='flex: 1;'>
                                <img src="${post.author.profile_image}" alt="" style="width: 40px; height: 40px;" class="rounded-circle border border-2">
                                <p class="d-inline fw-bold">${post.author.username}</p>
                                </div>
                                ${editButtonContent}
                                ${deleteButtonContent}
                        </div>
                        <div class="card-body" onclick='postClicked(${post.id})' style="cursor: pointer;">
                            <img src="${post.image}" alt="" class="w-100 rounded">
                            <span style="color: grey; font-weight: bold; font-size: 14px;">${post.created_at}</span>
                            <h5 class="card-title mt-1">${post.title}</h5>
                            <p class="card-text">${post.body}</p>
                            <hr>
                            <footer>
                                <i class="fa-solid fa-pen"></i>
                                <span>(${post.comments_count}) Comments</span>
                            </footer>
                        </div>
                    </div>
            `
            cardsDiv.innerHTML += content
        }
    })
}
function postClicked(postId) {
    window.location = `postDetails.html?postId=${postId}`
}
