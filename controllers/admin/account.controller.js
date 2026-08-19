const Account = require('../../model/account.model');
const md5 = require('md5');
const Role = require('../../model/role.model');
const systemConfig = require('../../config/systems');

// [GET] /admin/accounts/
module.exports.index = async (req, res) => {
    try {
        if (res.locals.role.permissions.includes("accounts_view")) {
            let find = {
                deleted: false
            };

            const records = await Account.find(find).select("-password -token");
            for (const record of records) {
                const role = await Role.findOne({ _id: record.role_id }, { deleted: false });
                record.role = role;
            }
            res.render('admin/pages/accounts/index', {
                titlePage: "Danh sách tài khoản",
                records: records
            });
        }
        else {
            req.flash("error", "Bạn không có quyền truy cập vào trang này");
            res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/dashboard`);
        }
    } catch (error) {
        req.flash("error", "Lỗi tải dữ liệu!");
        res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/dashboard`);
    }
};

// [GET] /admin/accounts/create
module.exports.create = async (req, res) => {
    try {
        if (res.locals.role.permissions.includes("accounts_create")) {
            let find = {
                deleted: false
            };

            const roles = await Role.find(find);

            res.render('admin/pages/accounts/create', {
                titlePage: "Tạo mới tài khoản",
                roles: roles
            });
        }
        else {
            req.flash("error", "Bạn không có quyền truy cập vào trang này");
            res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/dashboard`);
        }
    } catch (error) {
        req.flash("error", "Lỗi tải giao diện!");
        res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/accounts`);
    }
};

// [POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {

    let find = {
        deleted: false,
        email: req.body.email
    }
    try {
        if (res.locals.role.permissions.includes("accounts_create")) {
            const emailExit = await Account.findOne(find);
            if (emailExit) {
                req.flash("error", "Email đã tồn tại");
                res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/accounts`);
            }
            else {
                req.body.password = md5(req.body.password);
                const account = new Account(req.body);
                await account.save();

                req.flash("success", "Tạo mới tài khoản thành công!");
                res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/accounts`);
            }
        }
        else {
            req.flash("error", "Bạn không có quyền truy cập vào trang này");
            res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/dashboard`);
        }
    } catch (error) {
        req.flash("error", "Tạo mới tài khoản thất bại!");
        res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/accounts/create`);
    }
};

// [GET] /admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
    let find = {
        _id: req.params.id,
        deleted: false
    };
    try {
        if (res.locals.role.permissions.includes("accounts_edit")) {
            const data = await Account.findOne(find).select("-password -token");
            const roles = await Role.find({ deleted: false });

            res.render("admin/pages/accounts/edit", {
                titlePage: "Chỉnh sửa tài khoản",
                data: data,
                roles: roles
            })
        }
        else {
            req.flash("error", "Bạn không có quyền truy cập vào trang này");
            res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/accounts`);
        }
    } catch (error) {
        req.flash("error", "Lỗi tải dữ liệu!");
        res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/accounts`);
    }
}

// [PATCH] /admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
    let find = {
        deleted: false,
        email: req.body.email
    }
    try {
        if (res.locals.role.permissions.includes("accounts_edit")) {
            const account = await Account.findOne(find);
            if (account) {
                if (account._id != req.params.id) {
                    req.flash("error", "Email đã tồn tại");
                    res.redirect(req.headers.referer);
                    return;
                }
            }
            if (req.body.password) {
                req.body.password = md5(req.body.password);
            }
            else {
                delete req.body.password
            }
            await Account.updateOne({ _id: req.params.id }, req.body);
            req.flash("success", "Câp nhật thành công");
            res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/accounts`);
        }
        else {
            req.flash("error", "Bạn không có quyền truy cập vào trang này");
            res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/dashboard`);
        }
    } catch (error) {
        req.flash("error", "Cập nhật thất bại");
        res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/accounts`);
    }
}

// [DELETE] /admin/accounts/delete/:id
module.exports.delete = async (req, res) => {
    try {
        if (res.locals.role.permissions.includes("accounts_delete")) {
            await Account.updateOne({ _id: req.params.id }, { deleted: true });
            req.flash("success", "Xóa tài khoản thành công");
            res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/accounts`);
        }
        else {
            req.flash("error", "Bạn không có quyền truy cập vào trang này");
            res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/dashboard`);
        }
    } catch (error) {
        req.flash("error", "Lỗi, xóa thất bại !");
        res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/accounts`);
    }
}

// [GET] /admin/accounts/detail/:id
module.exports.detail = async (req, res) => {
    try {
        if (res.locals.role.permissions.includes("accounts_view")) {
            let find = {
                deleted: false,
                _id: req.params.id
            }
            const user = await Account.findOne(find);
            if (user) {
                const role = await Role.findOne({_id: user.role_id});
                res.render('admin/pages/accounts/detail', {
                    titlePage: "Chi tiết tài khoản",
                    user: user,
                    role: role
                })
            }
            else {
                req.flash("error", "Lỗi truy cập");
                res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/accounts`);
            }
        }
        else {
            req.flash("error", "Bạn không có quyền truy cập vào trang này");
            res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/accounts`);
        }
    } catch (error) {
        req.flash("error", "Lỗi truy cập");
        res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/accounts`);
    }
}