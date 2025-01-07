var socket = io();

// Add Friend
const listBtnAddFriend = document.querySelectorAll("[btn-add-friend")
if(listBtnAddFriend.length > 0) {
    listBtnAddFriend.forEach(button => {
        button.addEventListener("click", () => {
            button.closest(".box-user").classList.add("add")
            const userId = button.getAttribute("btn-add-friend")
            
            socket.emit("CLIENT_ADD_FRIEND", userId)
        })
    })
}

// Request Friend
const listBtnCancelFriend = document.querySelectorAll("[btn-cancel-friend")
if(listBtnCancelFriend.length > 0) {
    listBtnCancelFriend.forEach(button => {
        button.addEventListener("click", () => {
            button.closest(".box-user").classList.remove("add")
            const userId = button.getAttribute("btn-cancel-friend")
            
            socket.emit("CLIENT_CANCEL_FRIEND", userId)
        })
    })
}

// Refuse Friend
const refuseFriend = (button) => {
    button.addEventListener("click", () => {
        button.closest(".box-user").classList.add("refuse")
        const userId = button.getAttribute("btn-refuse-friend")
        
        socket.emit("CLIENT_REFUSE_FRIEND", userId)
    })
}

const listBtnRefuseFriend = document.querySelectorAll("[btn-refuse-friend")
if(listBtnRefuseFriend.length > 0) {
    listBtnRefuseFriend.forEach(button => {
        refuseFriend(button)
    })
}

// Accept Friend
const acceptFriend = (button) => {
    button.addEventListener("click", () => {
        button.closest(".box-user").classList.add("accepted")
        const userId = button.getAttribute("btn-accept-friend")
        
        socket.emit("CLIENT_ACCEPT_FRIEND", userId)
    })
}

const listBtnAcceptFriend = document.querySelectorAll("[btn-accept-friend")
if(listBtnAcceptFriend.length > 0) {
    listBtnAcceptFriend.forEach(button => {
        acceptFriend(button)
    })
}

// SERVER_RETURN_LENGTH_ACCEPT_FRIEND
const badgeUserAccept = document.querySelector("[badge-user-accept]")

if(badgeUserAccept){
    const userId = badgeUserAccept.getAttribute("badge-user-accept")
    socket.on("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", (data) => {
        if(userId == data.userId) {
            badgeUserAccept.innerHTML = "( " + data.lengthAcceptFriends + " )"
        }        
    })
}



const dataUsersAccept = document.querySelector("[data-users-accept]")
// SERVER_RETURN_INFO_ACCEPT_FRIEND
if(dataUsersAccept){
    const userId = dataUsersAccept.getAttribute("data-users-accept")
    socket.on("SERVER_RETURN_INFO_ACCEPT_FRIEND", (data) => {
        if(userId == data.userId){
            const div = document.createElement("div")
            div.classList.add("col-6")
            div.setAttribute("user-id", data.infoUserA._id)

            div.innerHTML = `
                <div class="box-user">
                    <div class="inner-avatar">
                        <img src='/images/avatar.png'}" alt="${data.infoUserA.fullName}">
                    </div>
                    <div class="inner-info">
                        <div class="inner-name">${data.infoUserA.fullName}</div>
                        <div class="inner-buttons">
                            <button class="btn btn-sm btn-primary mx-1" btn-accept-friend="${data.infoUserA._id}">Chấp nhận</button>
                            <button class="btn btn-sm btn-secondary mx-1" btn-refuse-friend="${data.infoUserA._id}">Xóa</button>
                            <button class="btn btn-sm btn-secondary mx-1" btn-deleted-friend disabled>Đã Xóa</button>
                            <button class="btn btn-sm btn-primary mx-1" btn-accepted-friend disabled>Đã chấp nhận</button>
                        </div>
                    </div>
                </div>
            `
            dataUsersAccept.appendChild(div)

            // REFUSE_FRIEND
            const refuseButton = div.querySelector("[btn-refuse-friend]")
            refuseFriend(refuseButton)

            // ACCEPT_FRIEND
            const acceptButton = div.querySelector("[btn-accept-friend")
            acceptFriend(acceptButton)
        }
    })
}

// SERVER_RETURN_USER_ID_CANCEL_FRIEND
socket.on("SERVER_RETURN_USER_ID_CANCEL_FRIEND", (data) => {
    const myUserId = data.myUserId
    const boxUserRemove = document.querySelector(`[user-id='${myUserId}']`)
    if(boxUserRemove) {
        dataUsersAccept.removeChild(boxUserRemove)
    }
})
