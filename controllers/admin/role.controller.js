const Role = require('../../model/role.model');
const systemConfig = require('../../config/systems');
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    };
    const records = await Role.find(find);
    res.render('admin/pages/roles/index', {
        titlePage: "Trang nhóm quyền",
        records: records
    });
}

module.exports.create = (req, res) => {
    res.render('admin/pages/roles/create', {
        titlePage: "Thêm nhóm quyền"
    })
}

module.exports.createPost = async (req, res) => {
    try {
        const record = new Role(req.body);
        await record.save();

        req.flash('success', 'Thêm nhóm quyền thành công');

        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    } catch (error) {
        req.flash('error', 'Thêm nhóm quyền thất bại');
        res.redirect(`${systemConfig.prefixAdmin}/roles/create`);
    }
};

module.exports.edit = async (req, res) => {
    try {
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
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }
}

module.exports.editPatch = async (req, res) => {
    try {
        const id = req.params.id;
        await Role.updateOne({ _id: id }, req.body);
        req.flash('success', 'Cập nhật thành công');
        res.redirect(req.headers.referer);
    } catch (error) {
        req.flash('error', 'Cập nhật thất bại');
        res.redirect("/admin/roles")
    }
}

module.exports.delete = async (req, res) => {
    try {
        const id = req.params.id;
        await Role.updateOne({ _id: id }, { deleted: true })
        req.flash('success', 'xóa thành công');
        res.redirect(req.headers.referer);
    } catch (error) {
        req.flash('error', 'Xóa thất bại');
        res.redirect(`${systemConfig.prefixAdmin}/roles`)
    }
}

module.exports.detail = async (req, res) => {
    try {
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
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }
}

module.exports.permissions = async (req, res) => {
    let find = {
        deleted: false
    }
    const records = await Role.find(find);
    res.render("admin/pages/roles/permissions", {
        pageTitle: "Phân quyền",
        records: records
    })
}

module.exports.permissionsPatch = async (req, res) => {
    try {
        const permissions = JSON.parse(req.body.permissions);
        for (const item of permissions) {
            await Role.updateOne({ _id: item.id }, { permissions: item.permissions })
        }
        req.flash("success", "Cập nhật phân quyền thành công")
        res.redirect(req.headers.referer);
    } catch (error) {
        res.flash("error", "Cập nhật phân quyền thất bại");
        req.redirect(req.headers.referer);

    }

}