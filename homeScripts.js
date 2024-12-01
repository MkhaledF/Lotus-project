let currentPage = 1
let lastPage = 1
window.addEventListener("scroll", function() {
    const endOfPage = window.innerHeight + window.pageYOffset >= document.body.scrollHeight;
    if (endOfPage == true && currentPage <= lastPage) {
        currentPage += 1
        getPost(currentPage)
    }
})
setupUI()
function getPost(page = 1) {
    toggleLoader(true)
    axios.get(`https://tarmeezacademy.com/api/v1/posts?limit=15&page=${page}`)
    .then((response) => {
        toggleLoader(false)
        let posts = response.data.data
        lastPage = response.data.meta.last_page
        for (post of posts) {
            let postTitle = ""
            if (post.title != null) {
                postTitle = post.title
            }
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
                            <span style='cursor: pointer;' onclick='openProfile(${post.author.id})'>
                                <img src="${post.author.profile_image}" alt="" style="width: 40px; height: 40px;" class="rounded-circle border border-2">
                                <p class="d-inline fw-bold">${post.author.username}</p>
                            </span>
                        </div>
                        ${editButtonContent}
                        ${deleteButtonContent}
                    </div>
                    <div class="card-body" onclick='postClicked(${post.id})' style="cursor: pointer;"'>
                        <img src="${post.image}" alt="" class="w-100 rounded">
                        <span style="color: grey; font-weight: bold; font-size: 14px;">${post.created_at}</span>
                        <h5 class="card-title mt-1">${postTitle}</h5>
                        <p class="card-text">${post.body}</p>
                        <hr>
                        <footer>
                            <i class="fa-solid fa-pen"></i>
                            <span>(${post.comments_count}) Comments</span>
                            <div style='display: inline-block; id="post-tags-${post.id}"'>
                            </div>
                        </footer>
                    </div>
                </div>
            `
            document.getElementById("posts").innerHTML += content
            const currentPost = `post-tags-${post.id}`
            for (tag of post.tags) {
                console.log(tag.name)
                let tagsContent = `
                                <span class='btn-sm bg-danger rounded-5 p-2' style='color: white; margin: 5px;'>
                                    ${tag.name}
                                </span>
                `
                document.getElementById(currentPost).innerHTML += tagsContent
            }
        }
    })
}
getPost()
function postClicked(postId) {
    window.location = `postDetails.html?postId=${postId}`
}