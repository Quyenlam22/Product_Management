var socket = io();

import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'

// FileUploadWithPreview
const upload = new FileUploadWithPreview('upload-images', {
    multiple: true,
    maxFileCount: 6
})

const body = document.querySelector(".chat .inner-body")
const elementListTyping = document.querySelector(".chat .inner-list-typing")

// CLIENT_SEND_MESSAGE
const formSendData = document.querySelector(".chat .inner-form")
if (formSendData) {
    const contentInput = formSendData.querySelector("input[name='content']")
    formSendData.addEventListener("submit", (e) => {
        e.preventDefault()
        const content = e.target.elements.content.value
        // const content = contentInput.value
        const images = upload.cachedFileArray

        if (content || images.length > 0) {
            socket.emit("CLIENT_SEND_MESSAGE", {
                content: content,
                images: images
            })
            e.target.elements.content.value = ""
            upload.clearPreviewPanel() // Clear all selected images
            socket.emit("CLIENT_SEND_TYPING", "hidden")
        }
        // console.log(contentInput.value)
    })
}

// SERVER_RETURN_MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (data) => {
    const myId = document.querySelector("[my-id]").getAttribute("my-id")

    const div = document.createElement("div")
    let htmlFullName = ""
    let htmlContent = ""
    let htmlImages = ""

    if (myId == data.userId) {
        div.classList.add("inner-outgoing")
    } else {
        htmlFullName = `<div class="inner-name">${data.fullName}</div>`
        div.classList.add("inner-incoming")
    }

    if(data.content){
        htmlContent = `
            <div class="inner-content">${data.content}</div>
        `
    }

    if(data.images.length > 0){
        htmlImages += `<div class="inner-images">`
        for (const image of data.images) {
            htmlImages += `<img src="${image}">`
        }
        htmlImages += `</div>`
    }

    div.innerHTML = `
        ${htmlFullName}
        ${htmlContent}
        ${htmlImages}
    `
    body.insertBefore(div, elementListTyping)

    body.scrollTop = body.scrollHeight
})

// Scroll Chat to Bottom
if (body) {
    body.scrollTop = body.scrollHeight
}

// Emoji Picker 
// Show Icon Chat

// Show Popup
// document.querySelector('emoji-picker')
//   .addEventListener('emoji-click', event => console.log(event.detail));
const buttonIcon = document.querySelector('.button-icon')
if (buttonIcon) {
    const tooltip = document.querySelector('.tooltip')
    Popper.createPopper(buttonIcon, tooltip)

    buttonIcon.onclick = () => {
        tooltip.classList.toggle('shown')
    }
}

// Show Typing
var timeOut
const showTyping = () => {
    socket.emit("CLIENT_SEND_TYPING", "show")

    clearTimeout(timeOut)

    timeOut = setTimeout(() => {
        socket.emit("CLIENT_SEND_TYPING", "hidden")
    }, 3000)
}

// Insert Icon
const emojiPicker = document.querySelector("emoji-picker")
if (emojiPicker) {
    const inputChat = document.querySelector(".chat .inner-form input[name='content']")

    emojiPicker.addEventListener('emoji-click', (e) => {
        const icon = e.detail.unicode
        inputChat.value = inputChat.value + icon

        inputChat.setSelectionRange(inputChat.value.length, inputChat.value.length)            
        inputChat.focus()
        showTyping()
    })

    // Input Keyup
    inputChat.addEventListener("keyup", () => {
        showTyping()
    })
}


//SERVER_RETURN_TYPING

if (elementListTyping) {
    socket.on("SERVER_RETURN_TYPING", (data) => {

        const existTyping = elementListTyping.querySelector(`[user-id="${data.userId}"]`)
        if (data.type == "show") {
            if (!existTyping) {
                const boxTyping = document.createElement("div")
                boxTyping.classList.add("box-typing")
                boxTyping.setAttribute("user-id", data.userId)

                boxTyping.innerHTML = `
                <div class="inner-name"> ${data.fullName} </div>
                <div class="inner-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                `
                elementListTyping.appendChild(boxTyping)
            }
            
            body.scrollTop = body.scrollHeight
        }
        else{
            if(existTyping){
                elementListTyping.removeChild(existTyping)
            }
        }
    })
}