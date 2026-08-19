module.exports.createPost = (req, res, next) => {
    const backUrl = req.headers.referer || "/admin/accounts";

    // 1. Kiểm tra Họ tên
    if (!req.body.fullName || !req.body.fullName.trim()) {
        req.flash("error", "Vui lòng nhập Họ Tên");
        res.redirect(backUrl);
        return;
    }

    // 2. Kiểm tra Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!req.body.email || !emailRegex.test(req.body.email.trim())) {
        req.flash("error", "Email không hợp lệ hoặc bị để trống");
        res.redirect(backUrl);
        return;
    }

    // 3. Kiểm tra Mật khẩu
    if (!req.body.password || req.body.password.length < 6) {
        req.flash("error", "Mật khẩu phải có ít nhất 6 ký tự");
        res.redirect(backUrl);
        return;
    }

    // 4. Kiểm tra Số điện thoại
    if (!req.body.phone || !req.body.phone.trim()) {
        req.flash("error", "Vui lòng nhập số điện thoại");
        res.redirect(backUrl);
        return;
    }

    // 5. Kiểm tra Phân quyền
    if (!req.body.role_id) {
        req.flash("error", "Vui lòng chọn nhóm quyền cho tài khoản");
        res.redirect(backUrl);
        return;
    }

    next();
};

module.exports.editPost = (req, res, next) => {
    const backUrl = req.headers.referer || "/admin/accounts";

    // 1. Kiểm tra Họ tên
    if (!req.body.fullName || !req.body.fullName.trim()) {
        req.flash("error", "Vui lòng nhập Họ Tên");
        res.redirect(backUrl);
        return;
    }

    // 2. Kiểm tra Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!req.body.email || !emailRegex.test(req.body.email.trim())) {
        req.flash("error", "Email không hợp lệ hoặc bị để trống");
        res.redirect(backUrl);
        return;
    }


    // 4. Kiểm tra Số điện thoại
    if (!req.body.phone || !req.body.phone.trim()) {
        req.flash("error", "Vui lòng nhập số điện thoại");
        res.redirect(backUrl);
        return;
    }

    // 5. Kiểm tra Phân quyền
    if (!req.body.role_id) {
        req.flash("error", "Vui lòng chọn nhóm quyền cho tài khoản");
        res.redirect(backUrl);
        return;
    }

    next();
};