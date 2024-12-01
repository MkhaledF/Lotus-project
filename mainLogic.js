function setupUI() {
    const token = localStorage.getItem("token")
    const registerBtn = document.getElementById("nav-register");
    const loginBtn = document.getElementById("nav-login");
    const logoutBtn = document.getElementById("nav-logout")
    const navImg = document.getElementById("nav-img")
    const navName = document.getElementById("nav-name")
    const postIcon = document.getElementById("add-post-icon-mobile")
    const commentInput = document.getElementById("commentInput")
    const sendBtn = document.getElementById("sendBtn")
    if (token == null) {
        if (postIcon != null) {
            postIcon.style.display = "none"
            postIcon.style.visibility = "hidden"
        }
        if(commentInput != null && sendBtn != null) {
            commentInput.style.display = "none"
            sendBtn.style.display = "none"
        }
        registerBtn.style.display = "inline-block"
        loginBtn.style.display = "inline-block"
        logoutBtn.style.display = "none"
        navImg.style.display = "none"
        navName.style.display = "none"
    } else {
        if (postIcon != null) {
            postIcon.style.display = "block"
            postIcon.style.visibility = "visible"
        }
        if(commentInput != null && sendBtn != null) {
            commentInput.style.display = "block"
            sendBtn.style.display = "block"
        }
        registerBtn.style.display = "none"
        loginBtn.style.display = "none"
        logoutBtn.style.display = "block"
        navImg.style.display = "block"
        navName.style.display = "block"
    }
    if (localStorage.getItem("user")) {
        setNavItems()
    }
}
function setNavItems() {
    let user = localStorage.getItem("user");
    let obj = JSON.parse(user);
    let navName = document.getElementById("nav-name")
    let navImg = document.getElementById("nav-img")
    navName.innerHTML = obj.username
    navImg.src = obj.profile_image
}
document.getElementById("nav-logout").onclick = function () {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    alertbox.render({
            alertIcon: 'warning',
            title: 'Logged out successfully!',
            message: 'You are logged out',
            btnTitle: 'Ok',
            themeColor: '#607d8b',
            btnColor: '#607d8b',
            border: false
        })
    setupUI()
}
document.getElementById("login-btn").addEventListener("click", function() {
    let userName = document.getElementById("recipient-name").value;
    let passWord = document.getElementById("recipient-password").value;
    
    let params = {
        "username": userName,
        "password": passWord
    }
    toggleLoader(true)
    axios.post("https://tarmeezacademy.com/api/v1/login", params)
    .then((response) => {
        toggleLoader(false)
        let token = response.data.token
        let user = response.data.user
        localStorage.setItem("token", token)
        localStorage.setItem("user", JSON.stringify(user))

        alertbox.render({
        alertIcon: 'success',
        title: 'Logged in successfully!',
        message: 'congratulations, you are logged in',
        btnTitle: 'Ok',
        themeColor: '#22cb29',
        btnColor: '#22cb29',
        border: false
    });
    setupUI()
})
.catch((err) => {
    toggleLoader(false)
    console.log(err)
    alertbox.render({
        alertIcon: 'error',
        title: 'login failed :(',
        message: "The username or the password is wrong",
        btnTitle: 'Ok',
        themeColor: '#ed0050',
        btnColor: '#ed0050',
        border: false
    });
})
.finally(() => {
    let modal = document.getElementById("login-modal");
    let modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide()
})
})
document.getElementById("register-btn").addEventListener("click", function() {
    let regName = document.getElementById("register-name").value;
    let regUserName = document.getElementById("register-userName").value;
    let regPassword = document.getElementById("register-password").value;
    let regImage = document.getElementById("register-image").files[0]
    
    let formData = new FormData();
    formData.append("name", regName);
    formData.append("username", regUserName);
    formData.append("password", regPassword);
    formData.append("image", regImage);
    toggleLoader(true)
    axios.post("https://tarmeezacademy.com/api/v1/register", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    })
    .then((response) => {
        toggleLoader(false)
        let token = response.data.token
        let user = response.data.user
        console.log(token)
        console.log(user)
        localStorage.setItem("token", token)
        localStorage.setItem("user", JSON.stringify(user))
        alertbox.render({
            alertIcon: 'success',
            title: 'New user registered successfully!',
            message: 'Thank you for registering',
            btnTitle: 'Ok',
            themeColor: '#22cb29',
            btnColor: '#22cb29',
            border: false
        })
        setupUI()
        let modal = document.getElementById("register-modal");
        let modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide()
    })
    .catch((err) => {
        toggleLoader(false)
        alertbox.render({
            alertIcon: 'error',
            title: 'Registering failed :(',
            message: err.response.data.message,
            btnTitle: 'Ok',
            themeColor: '#ed0050',
            btnColor: '#ed0050',
            border: false
        });
    })
    .finally(() => {
        let modal = document.getElementById("register-modal");
        let modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide()
    })
})
function getCurrentUser() {
    let user = null;
    const storageUser = localStorage.getItem("user");
    if (storageUser != null) {
        user = JSON.parse(storageUser);
    }
    return user
}
document.getElementById("create-post-btn").addEventListener("click", function() {
    let modal = document.getElementById("post-modal");
    let modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide()
    
    let postId = document.getElementById("post-id-input").value
    let isCreate = postId == null || postId == ""

    let title = document.getElementById("post-name").value;
    let body = document.getElementById("post-textarea").value;
    let image = document.getElementById("post-image").files[0]
    let token = localStorage.getItem("token")

    let formData = new FormData()
    formData.append("title", title);
    formData.append("body", body);
    formData.append("image", image);
    if(isCreate) {
        axios.post("https://tarmeezacademy.com/api/v1/posts", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "authorization": `Bearer ${token}`
            }
        })
        .then((response) => {
            alertbox.render({
                alertIcon: 'success',
                title: '',
                message: 'Post has been created successfully!',
                btnTitle: 'Ok',
                themeColor: '#22cb29',
                btnColor: '#22cb29',
                border: false
            });
            setTimeout(() => {
                location.reload()
            }, 2000)
        })
        .catch((err) => {
            let errMsg = err.response.data.message
            alertbox.render({
                alertIcon: 'error',
                title: '',
                message: errMsg,
                btnTitle: 'Ok',
                themeColor: '#ed0050',
                btnColor: '#ed0050',
                border: false
            });
        })
    } else {
        formData.append("_method", "put")
        axios.post(`https://tarmeezacademy.com/api/v1/posts/${postId}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "authorization": `Bearer ${token}`
            }
        })
        .then((response) => {
            alertbox.render({
                alertIcon: 'success',
                title: '',
                message: 'Post has been updated successfully!',
                btnTitle: 'Ok',
                themeColor: '#22cb29',
                btnColor: '#22cb29',
                border: false
            });
            setTimeout(() => {
                location.reload()
            }, 2000)
        })
        .catch((err) => {
            let errMsg = err.response.data.message
            alertbox.render({
                alertIcon: 'error',
                title: '',
                message: "You can't edit this post",
                btnTitle: 'Ok',
                themeColor: '#ed0050',
                btnColor: '#ed0050',
                border: false
            });
        })
    }
})
function editPostBtnClicked(post) {
    document.getElementById("post-modal-title").innerHTML = "Edit Post"
    document.getElementById("post-name").value = post.title
    document.getElementById("post-textarea").value = post.body
    document.getElementById("post-id-input").value = post.id
    document.getElementById("create-post-btn").innerHTML = "Update"
    let editPostModal = new bootstrap.Modal(document.getElementById("post-modal"), {})
    editPostModal.toggle()
}
function deletePostBtnClicked(post) {
    document.getElementById("delete-input-id-post").value = post.id
    let editPostModal = new bootstrap.Modal(document.getElementById("delete-modal"), {})
    editPostModal.toggle()
}
function confirmPostDelete() {
    let modal = document.getElementById("delete-modal");
    let modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide()
    let postId = document.getElementById("delete-input-id-post").value;
    let token = localStorage.getItem("token")
    axios.delete(`https://tarmeezacademy.com/api/v1/posts/${postId}`, {
        headers: {
            "Content-Type": "multipart/form-data",
            "authorization": `Bearer ${token}`
        }
    })
    .then((response) => {
        alertbox.render({
            alertIcon: 'success',
            title: '',
            message: 'Your post has been deleted successfully!',
            btnTitle: 'Ok',
            themeColor: '#22cb29',
            btnColor: '#22cb29',
            border: false
        });
        setTimeout(() => {
            location.reload()
        }, 2000)
    })
    .catch((err) => {
        alertbox.render({
            alertIcon: 'error',
            title: '',
            message: "You can't delete this post",
            btnTitle: 'Ok',
            themeColor: '#ed0050',
            btnColor: '#ed0050',
            border: false
        });
    })
}
function addPostBtnClicked() {
    document.getElementById("post-modal-title").innerHTML = "Create A New Post"
    document.getElementById("create-post-btn").innerHTML = "Create"
    document.getElementById("post-name").value = ""
    document.getElementById("post-textarea").value = ""
    let editPostModal = new bootstrap.Modal(document.getElementById("post-modal"), {})
    editPostModal.toggle()
}
function profileClicked() {
    let user = getCurrentUser();
    if (user != null) {
        window.location = `profile.html?userid=${user.id}`
    } else {
        alertbox.render({
            alertIcon: 'error',
            title: '',
            message: "You dont have a profile page",
            btnTitle: 'Ok',
            themeColor: '#ed0050',
            btnColor: '#ed0050',
            border: false
        });
    }
}
function openProfile(userId) {
    window.location = `profile.html?userid=${userId}`
}
function toggleLoader(show = true) {
    if (show) {
        document.getElementById("loader").style.visibility = "visible";
    } else {
        document.getElementById("loader").style.visibility = "hidden"
    }
}