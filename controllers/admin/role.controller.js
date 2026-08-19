const Role = require('../../model/role.model');
const systemConfig = require('../../config/systems');
// [GET] /admin/roles
module.exports.index = async (req, res) => {
    try {
        if (res.locals.role.permissions.includes("roles_view")) {
            let find = {
                deleted: false
            };
            const records = await Role.find(find);
            res.render('admin/pages/roles/index', {
                titlePage: "Trang nhóm quyền",
                records: records
            });
        }
        else {
            req.flash("error", "Bạn không có quyền truy cập vào trang này");
            res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/dashboard`);
        }
    } catch (error) {
        req.flash("error", "Lỗi truy cập");
        res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/roles`);
    }
}

// [GET] /admin/roles/create
module.exports.create = (req, res) => {
    try {
        if (res.locals.role.permissions.includes("roles_create")) {
            res.render('admin/pages/roles/create', {
                titlePage: "Thêm nhóm quyền"
            })
        }
        else {
            req.flash("error", "Bạn không có quyền truy cập vào trang này");
            res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/roles`);
        }
    } catch (error) {
        req.flash("error", "Lỗi truy cập");
        res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/roles`);
    }
}

// [POST] /admin/roles/create
module.exports.createPost = async (req, res) => {
    try {
        if (res.locals.role.permissions.includes("roles_create")) {
            const record = new Role(req.body);
            await record.save();

            req.flash('success', 'Thêm nhóm quyền thành công');

            res.redirect(`${systemConfig.prefixAdmin}/roles`);
        }
        else {
            req.flash("error", "Bạn không có quyền truy cập vào trang này");
            res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/roles`);
        }
    } catch (error) {
        req.flash("error", "Thêm thất bại");
        res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/roles`);
    }
};

// [GET] /admin/roles/edit/:id
module.exports.edit = async (req, res) => {
    try {
        if (res.locals.role.permissions.includes("roles_edit")) {
            const id = req.params.id;
            let find = {
                _id: id,
                deleted: false
            }
            const record = await Role.findOne(find)
            res.render('admin/pages/roles/edit', {
                titlePage: "Chỉnh sửa nhóm quyền",
                record: record
            });
        }
        else {
            req.flash("error", "Bạn không có quyền truy cập vào trang này");
            res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/roles`);
        }
    } catch (error) {
        req.flash("error", "Chinh sửa thất bại");
        res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/roles`);
    }
}

// [PATCH] /admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {
    try {
        if (res.locals.role.permissions.includes("roles_edit")) {
            const id = req.params.id;
            await Role.updateOne({ _id: id }, req.body);
            req.flash('success', 'Cập nhật thành công');
            res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/roles`);
        }
        else {
            req.flash("error", "Bạn không có quyền truy cập vào trang này");
            res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/roles`);
        }
    } catch (error) {
        req.flash('error', 'Cập nhật thất bại');
        res.redirect("/admin/roles")
    }
}

module.exports.delete = async (req, res) => {
    try {
        if (res.locals.role.permissions.includes("roles_delete")) {
            const id = req.params.id;
            await Role.updateOne({ _id: id }, { deleted: true })
            req.flash('success', 'xóa thành công');
            res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/roles`);
        }
        else {
            req.flash("error", "Bạn không có quyền truy cập vào trang này");
            res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/roles`);
        }
    } catch (error) {
        req.flash('error', 'Xóa thất bại');
        res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/roles`)
    }
}

module.exports.detail = async (req, res) => {
    try {
        if (res.locals.role.permissions.includes("roles_view")) {
            const id = req.params.id;
            let find = {
                _id: id,
                deleted: false
            }
            const record = await Role.findOne(find);
            res.render('admin/pages/roles/detail', {
                titlePage: "Chi tiết nhóm quyền",
                record: record
            })
        }
        else {
            req.flash("error", "Bạn không có quyền truy cập vào trang này");
            res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/roles`);
        }
    } catch (error) {
        req.flash("error", "Lỗi truy cập");
        res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/roles`);
    }
}

module.exports.permissions = async (req, res) => {
    try {
        if (res.locals.role.permissions.includes("roles_view") && res.locals.role.permissions.includes("roles_view-permissions")) {
            let find = {
                deleted: false
            }
            const records = await Role.find(find);
            res.render("admin/pages/roles/permissions", {
                titlePage: "Phân quyền",
                records: records
            })
        }
        else {
            req.flash("error", "Bạn không có quyền truy cập vào trang này");
            res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/dashboard`);
        }
    } catch (error) {
        req.flash("error", "Lỗi truy cập");
        res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/roles`);
    }

}

module.exports.permissionsPatch = async (req, res) => {
    try {
        if (res.locals.role.permissions.includes("roles_edit")) {
            const permissions = JSON.parse(req.body.permissions);
            for (const item of permissions) {
                await Role.updateOne({ _id: item.id }, { permissions: item.permissions })
            }
            req.flash("success", "Cập nhật phân quyền thành công")
            res.redirect(req.headers.referer);
        }
        else {
            req.flash("error", "Bạn không có quyền truy cập vào trang này");
            res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/roles`);
        }
    } catch (error) {
        req.flash("error", "Cập nhật phân quyền thất bại");
        res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/roles`);
    }

}