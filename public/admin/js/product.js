// Change status
const buttonsChangeStatus = document.querySelectorAll("[button-change-status]")
if (buttonsChangeStatus.length > 0) {
    const formChangeStatus = document.querySelector("#form-change-status");
    const path = formChangeStatus.getAttribute("data-path")

    buttonsChangeStatus.forEach(button => {
        button.addEventListener("click", () => {
            const statusCurrent = button.getAttribute("data-status")
            const id = button.getAttribute("data-id");

            let statusChange = statusCurrent == "active" ? "inactive" : "active"

            const action = path + `/${statusChange}/${id}?_method=PATCH`
            formChangeStatus.action = action

            formChangeStatus.submit()
        })
    })
}

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