// Change Status
const buttonsChangeStatus = document.querySelectorAll("[button-change-status]");
if (buttonsChangeStatus.length > 0) {
    const formChangeStatus = document.querySelector("#form-change-status");
    const path = formChangeStatus.getAttribute("data-path");

    buttonsChangeStatus.forEach(button => {
        button.addEventListener('click', () => {
            const statusCurrent = button.getAttribute('data-status');
            const id = button.getAttribute('data-id');

            let statusChange = statusCurrent == "active" ? "inActive" : "active";
            // console.log(statusChange);
            // console.log(id);
            const action = path + `/${statusChange}/${id}?_method=PATCH`;
            // console.log(action);
            formChangeStatus.action = action;
            formChangeStatus.submit();
            // console.log(formChangeStatus);
        })
    })
}
// End Change Status

// Delete Item Product
const buttonsDelete = document.querySelectorAll("[button-delete]");
const formDelete = document.querySelector("#form-delete");

if (buttonsDelete.length > 0) {
    // console.log(buttonsDelete);
    buttonsDelete.forEach(button => {
        button.addEventListener('click', () => {
            if(formDelete) {
                const isConfirm = confirm("Bạn có chắc muốn xóa sản phẩm này");
                if(isConfirm) {
                    const id = button.getAttribute("button-delete");
                    console.log(id);
                    const path = formDelete.getAttribute("data-path");
                    const action = path + `/${id}?_method=DELETE`;
                    formDelete.action = action;
                    formDelete.submit();
                }
                else {
                    return;
                }
            }
            
        })
    })
}
// End Delete Item Product
