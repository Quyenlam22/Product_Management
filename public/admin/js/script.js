// button-status
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