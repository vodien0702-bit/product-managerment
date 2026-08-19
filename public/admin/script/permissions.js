const tablePermissions = document.querySelector("[table-permissions]");
if (tablePermissions) {
    // console.log(tablePermissions);
    const buttonSubmit = document.querySelector("[button-submit]");
    if (buttonSubmit) {
        buttonSubmit.addEventListener('click', () => {
            let permissions = [];
            let rows = tablePermissions.querySelectorAll("[data-name]");
            rows.forEach(row => {
                const name = row.getAttribute("data-name");
                const inputs = row.querySelectorAll("input");
                if (name == "id") {
                    inputs.forEach(input => {
                        const id = input.value;
                        permissions.push({
                            id: id,
                            permissions: []
                        });
                    });
                }
                else {
                    inputs.forEach((input, index) => {
                        const checked = input.checked;
                        if (checked) {
                            permissions[index].permissions.push(name);
                        }
                    })
                }
            });
            if (permissions.length > 0) {
                const formChangePermissions = document.querySelector("#form-change-permissions");
                const inputPermissions = formChangePermissions.querySelector("input[name='permissions']");
                inputPermissions.value = JSON.stringify(permissions);
                formChangePermissions.submit();
            }
        });
    }
}
// End Permissions

// Permissions Data Default
const dataRecords = document.querySelector("[data-records]");
if (dataRecords) {
    records = JSON.parse(dataRecords.getAttribute("data-records"));
    // console.log(records);
    const tablePermissions = document.querySelector("[table-permissions]");

    records.forEach((record, index) => {
        const permissions = record.permissions;

        permissions.forEach(permission => {
            const row = tablePermissions.querySelector(`[data-name="${permission}"]`);
            if (row) {
                const inputs = row.querySelectorAll("input");
                inputs[index].checked = true;
            }
        })
    })
}
// End Permissions Data Default