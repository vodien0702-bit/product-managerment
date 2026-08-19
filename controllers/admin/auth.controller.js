const Account = require('../../model/account.model');
const md5 = require('md5');
const systemConfig = require('../../config/systems');
// [GET] /admin/auth/login
module.exports.login = async (req, res) => {
    if(req.cookies.token) {
        const user = await Account.findOne({deleted: false, token: req.cookies.token});
        if(user) {
            res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
            return;
        }
    }
    res.render("admin/pages/auth/login", {
        titlePage: "Trang đăng nhập"
    });
}

// [POST] /admin/auth/login
module.exports.loginPost = async (req, res) => {
    let find = {
        deleted: false,
        email: req.body.email
    }
    const user = await Account.findOne(find);
    if(!user) {
        req.flash("error", "Tài khoản không tồn tại");
        res.redirect(req.headers.referer);
        return;
    }
    if(md5(req.body.password) != user.password) {
        req.flash("error", "Sai mật khẩu");
        res.redirect(req.headers.referer);
        return;
    }
    if(user.status == "inActive") {
        req.flash("error", "Tài khoản đã bị khóa");
        res.redirect(req.headers.referer);
        return;
    }
    res.cookie("token", user.token);
    req.flash("success", `Đăng nhập thành công, Chào mừng ${user.fullName} đến với shop Hoàng Diện`);
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
}

// [GET] /admin/auth/logout
module.exports.logout = (req, res) => {
    res.clearCookie("token");
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
}