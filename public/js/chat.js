var socket = io();

import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'

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
        if (content) {
            socket.emit("CLIENT_SEND_MESSAGE", content)
            e.target.elements.content.value = ""
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

    if (myId == data.userId) {
        div.classList.add("inner-outgoing")
    } else {
        htmlFullName = `<div class="inner-name">${data.fullName}</div>`
        div.classList.add("inner-incoming")
    }

    div.innerHTML = `
        ${htmlFullName}
        <div class="inner-content">${data.content}</div>
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