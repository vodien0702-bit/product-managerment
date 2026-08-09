// Button Status
const buttonsStatus = document.querySelectorAll("[button-status]");
if (buttonsStatus.length > 0) {
    let url = new URL(window.location.href);
    // console.log(url);
    buttonsStatus.forEach(button => {
        button.addEventListener('click', () => {
            const status = button.getAttribute('button-status');
            if (status) {
                url.searchParams.set('status', status);
            }
            else {
                url.searchParams.delete('status');
            }

            window.location.href = url.href;
        })
    })
}
// End Button Status

// Form Search
const formSearch = document.querySelector('#form-search');
if (formSearch) {
    let url = new URL(window.location.href);

    formSearch.addEventListener('submit', (e) => {
        e.preventDefault();
        const keyword = e.target.elements.keyword.value;
        console.log(keyword);
        if (keyword) {
            url.searchParams.set("keyword", keyword);
        }
        else {
            url.searchParams.delete("keyword");
        }
        window.location.href = url.href;
    })
}
// End Form Search

// Pagination
// const pagesPagination = document.querySelectorAll('.page-item');
// if(pagesPagination.length > 0) {
//     let url = new URL(window.location.href);
//     pagesPagination.forEach(item => {
//         item.addEventListener('click', (e) => {
//             e.preventDefault();
//             console.log(e.target.innerText);
//             if(e.target.innerText) {
//                 url.searchParams.set("page", e.target.innerText);
//             }
//             else {
//                 url.searchParams.delete("page");
//             }
//             window.location.href = url.href;
//         })
//     })
// }
const buttonsPagination = document.querySelectorAll('[button-pagination]');
if (buttonsPagination.length > 0) {
    let url = new URL(window.location.href);
    buttonsPagination.forEach(item => {
        item.addEventListener('click', () => {
            const page = item.getAttribute("button-pagination");
            if (page) {
                url.searchParams.set("page", page);
            }
            else {
                url.searchParams.delete("page");
            }
            window.location.href = url.href;
        })
    })
}
// End Pagination

// Change-Multi status
const checkboxMulti = document.querySelector("[checkbox-multi]");
// console.log(checkboxMulti);
if (checkboxMulti) {
    const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']");
    const inputsId = checkboxMulti.querySelectorAll("input[name='id']");

    inputCheckAll.addEventListener('click', () => {
        if (inputCheckAll.checked) {
            inputsId.forEach((input) => {
                input.checked = true;
            })
        }
        else {
            inputsId.forEach(input => {
                input.checked = false;
            })
        }
    });

    inputsId.forEach((input) => {
        input.addEventListener('click', () => {
            const countInputChecked = document.querySelectorAll("input[name='id']:checked").length;
            if (countInputChecked == inputsId.length) {
                inputCheckAll.checked = true;
            }
            else {
                inputCheckAll.checked = false;
            }
        })
    })
    // console.log(inputCheckAll);
    // console.log(inputsId);
}
// End Change-Multi status

// Form Change Multi
const formChangeMulti = document.querySelector("[form-change-multi]");
if (formChangeMulti) {
    formChangeMulti.addEventListener('submit', (e) => {
        e.preventDefault();
        const checkboxMulti = document.querySelector("checkbox-multi");
        const inputChecked = document.querySelectorAll("input[name='id']:checked");
        const typeChange = e.target.elements.type.value;
        if (inputChecked.length > 0) {
            if (typeChange == 'delete-multi') {
                const isConfirm = confirm("Bạn có chăng muốn xóa những sản phẩm này");
                if (!confirm) {
                    return;
                }
            }
            let ids = [];
            const inputIds = formChangeMulti.querySelector("input[name='ids']");
            inputChecked.forEach(input => {
                const id = input.value;
                if (typeChange == 'change-position') {
                    const position = input.closest("tr").querySelector("input[name='position']").value
                    ids.push(`${id}-${position}`);
                }
                else {
                    ids.push(id);
                }
            })
            console.log(ids);
            inputIds.value = ids.join(", ");
            formChangeMulti.submit();
        }
        else {
            alert("Vui lòng chọn ít nhất một sản phẩm");
        }
    })
}

// End Form Change Multi

// Show Alert
const showAlert = document.querySelector("[show-alert]");
if(showAlert) {
    const time = parseInt(showAlert.getAttribute("data-time"));
    const buttonCloseAlert = showAlert.querySelector("[close-alert");

    setTimeout(() => {
        showAlert.classList.add("alert-hidden");
    }, time);

    buttonCloseAlert.addEventListener('click', () => {
        showAlert.classList.add("alert-hidden");
    })
}


// End Show Alert


// Upload Image
const uploadImage = document.querySelector("[upload-image]");
if(uploadImage) {
    const uploadImageInput = document.querySelector("[upload-image-input]");
    const uploadImagePreview = document.querySelector("[upload-image-preview]");

    uploadImageInput.addEventListener('change', (e) => {
        console.log(e);
        const file = e.target.files[0];
        if(file) {
            uploadImagePreview.src = URL.createObjectURL(file);
        }
    });
}
// End Upload Image


// Condition Sort
const sort = document.querySelector("[sort]");
if(sort) {
    const sortSelect = sort.querySelector("[sort-select]");
    const sortClear = sort.querySelector("[sort-clear]");
    let url = new URL(window.location.href);
    if(sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            const value = e.target.value;
            const [sortKey, sortValue] = value.split("-");
            url.searchParams.set("sortKey", sortKey);
            url.searchParams.set("sortValue", sortValue);
            window.location.href = url.href;
        });
    }
    if(sortClear) {
        sortClear.addEventListener('click', () => {
            url.searchParams.delete("sortKey");
            url.searchParams.delete("sortValue");
            window.location.href = url.href;
        })
    }
    const sortKey = url.searchParams.get("sortKey");
    const sortValue = url.searchParams.get("sortValue");
    
    if(sortKey && sortValue) {
        const stringValue = `${sortKey}-${sortValue}`;
        const optionSelect = sortSelect.querySelector(`option[value=${stringValue}]`);
        optionSelect.selected = true;
    }
}
// End Condition Sort

