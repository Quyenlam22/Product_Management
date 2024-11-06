//Delete Item
const buttonsDelete = document.querySelectorAll("[button-deleted]")
if (buttonsDelete.length > 0) {
    const formDeleted = document.querySelector("#form-deleted")
    const path = formDeleted.getAttribute("data-path")

    buttonsDelete.forEach(button => {
        button.addEventListener("click", () => {
            const isConfirm = confirm("Bạn có chắc chắn xóa sản phẩm?")

            if (isConfirm) {
                const id = button.getAttribute("data-id")
                const action = `${path}/${id}?_method=DELETE`
                formDeleted.action = action

                formDeleted.submit()
            }
        })
    })
}