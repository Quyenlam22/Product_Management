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

// Button Status
const buttonStatus = document.querySelectorAll("[button-status]")
if(buttonStatus.length > 0){
    let url = new URL(window.location.href)
    
    buttonStatus.forEach(button => {
        button.addEventListener("click", () =>{
            const status = button.getAttribute("button-status")
            
            if(status){
                url.searchParams.set("status", status)
            }
            else{
                 url.searchParams.delete("status")
            }

            window.location.href = url.href
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
                const action = `${path}/${id}?_method=PATCH`
                formDeleted.action = action

                formDeleted.submit()
            }
        })
    })
}

//Form Search
const formSearch = document.querySelector("#form-search")
if(formSearch){
    let url = new URL(window.location.href)
    formSearch.addEventListener("submit", (e) => {
        e.preventDefault()
        const keyword = e.target.elements.keyword.value
        if(keyword){
            url.searchParams.set("keyword", keyword)
        }
        else{
            url.searchParams.delete("keyword")
        }
        window.location.href = url.href
    })
}

//Pagination
const buttonsPagination = document.querySelectorAll("[button-pagination]")
if(buttonsPagination){
    let url = new URL(window.location.href)

    buttonsPagination.forEach(item => {
        item.addEventListener("click", () => {
            const page = item.getAttribute("button-pagination")
            url.searchParams.set("page", page)

            window.location.href = url.href
        })
    })
}

// Checkbox Multi
const checkboxMulti = document.querySelector("[checkbox-multi]")

if (checkboxMulti) {
    const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']")
    const inputsId = checkboxMulti.querySelectorAll("input[name='id']")
    inputCheckAll.addEventListener("click", () => {
        if (inputCheckAll.checked) {
            inputsId.forEach(input => {
                input.checked = true
            })
        } else {
            inputsId.forEach(input => {
                input.checked = false
            })
        }
    })

    inputsId.forEach(input => {
        input.addEventListener("click", () => {
            const countChecked = document.querySelectorAll("input[name='id']:checked")
            if (countChecked.length == inputsId.length) {
                inputCheckAll.checked = true;
            } else {
                inputCheckAll.checked = false
            }
        })
    })
}

// Form Change Multi
const formChangeMulti = document.querySelector("[form-change-multi]")
if (formChangeMulti) {
    formChangeMulti.addEventListener("submit", (e) => {
        e.preventDefault()
        const inputsChecked = document.querySelectorAll("input[name='id']:checked")
        
        const typeChange = e.target.elements.type.value
        if(typeChange == "delete-all"){
            const isConfirm = confirm("Đồng ý xóa?")
            if(!isConfirm){
                return
            }
        }

        if (inputsChecked.length > 0) {
            let ids = []
            const inputIds = formChangeMulti.querySelector("input[name='ids']")

            inputsChecked.forEach(input => {
                const id = input.value

                if(typeChange == "change-position"){
                    const position = input.closest("tr").querySelector("input[name='position']").value
                    ids.push(`${id}-${position}`)
                }
                else{
                    ids.push(id)
                }
            })

            inputIds.value = (ids.join(", "))

            formChangeMulti.submit()
        } else {
            alert("Vui lòng chọn ít nhất 1 bản ghi!")
        }
    })
}

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

//Upload Image
const uploadImage = document.querySelector("[upload-image]")
if(uploadImage){
    const uploadImageInput = document.querySelector("[upload-image-input]")
    const uploadImagePreview = document.querySelector("[upload-image-preview]")
    const closeImage = document.querySelector("[close-image]")

    uploadImageInput.addEventListener("change", (e) => {
        const file = e.target.files[0]
        // const [file] = uploadImageInput.files
        
        if(file){
            uploadImagePreview.src = URL.createObjectURL(file)
            closeImage.style.display = "block"

            //Remove Image
            closeImage.addEventListener("click", () => {
                uploadImagePreview.src = ""
                uploadImageInput.value = ""
                closeImage.style.display = "none"
            })
        }
    }) 
}

//Sort
const sort = document.querySelector("[sort]")
if(sort){
    let url = new URL(window.location.href)

    const sortSelect = document.querySelector("[sort-select]")
    const sortClear = document.querySelector("[sort-clear]")
    
    sortSelect.addEventListener("change", () => {
        const [sortKey, sortValue] = sortSelect.value.split("-")
        console.log(sortKey)
        console.log(sortValue)
        
        url.searchParams.set("sortKey", sortKey)
        url.searchParams.set("sortValue", sortValue)

        window.location.href = url.href
        
    })
    
    sortClear.addEventListener("click", () => {
        url.searchParams.delete("sortKey")
        url.searchParams.delete("sortValue")

        window.location.href = url.href
    })

    const sortKey = url.searchParams.get("sortKey")
    const sortValue = url.searchParams.get("sortValue")
    if(sortKey && sortValue){
        const value = `${sortKey}-${sortValue}`
        const optionSelected = sortSelect.querySelector(`option[value='${value}']`)
        optionSelected.selected = true
    }
}
