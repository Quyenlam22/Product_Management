const inputsQuantity = document.querySelectorAll('input[name="quantity"]')
if(inputsQuantity.length > 0){
    inputsQuantity.forEach(input => {
        input.addEventListener("change", (e) => {
            const productId = input.getAttribute("item-id")
            const quantity = parseInt(e.target.value)
            console.log(productId)
            console.log(quantity)
            window.location.href = `/cart/update/${productId}/${quantity}`
        })
    })
}