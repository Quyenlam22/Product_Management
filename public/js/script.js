//Show alert
const showAlert = document.querySelector("[show-alert]")
if(showAlert){
    const time = parseInt(showAlert.getAttribute("data-time"))
    const closeAlert = showAlert.querySelector("[close-alert]")

    closeAlert.addEventListener("click", () => {
        showAlert.classList.add("alert-hidden")
    })

    setTimeout(() => {
        showAlert.classList.add("alert-hidden")
    }, time)
}

//Order Quantity
const orderQuantity = document.querySelector(".order-quantity")
if(orderQuantity){
    const buttonReduce = orderQuantity.querySelector("[button-reduce]");
    const buttonIncrease = orderQuantity.querySelector("[button-increase]");
    const inputOrder = orderQuantity.querySelector(".order-value")
    buttonReduce.addEventListener("click", (e) => {
        if(inputOrder.value <= 1){
            alert("Tối thiểu là 1 sản phẩm")
            return;
        }

        inputOrder.value = parseInt(inputOrder.value) - 1
    })
    buttonIncrease.addEventListener("click", (e) => {
        inputOrder.value = parseInt(inputOrder.value) + 1
    })
}

// window.addEventListener('beforeunload', (event) => {
//     socket.emit('CLIENT_CLOSE_WEB', "User close web")
// });

