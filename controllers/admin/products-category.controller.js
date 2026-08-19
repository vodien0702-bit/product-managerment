const ProductCategory = require('../../model/products-category.model');
const filterStatusHelper = require('../../helpers/filterStatus');
const searchHelper = require('../../helpers/search');
const paginationHelper = require('../../helpers/pagination');
const createTree = require('../../helpers/createTree');
const systemConfig = require('../../config/systems');

module.exports.index = async (req, res) => {
    try {
        if (res.locals.role.permissions.includes("products-category_view")) {
            const filterStatus = filterStatusHelper(req.query);
            let find = {
                deleted: false
            };
            // filter status
            if (req.query.status) {
                find.status = req.query.status;
            }
            // End filter status

            // Search
            const objectSearch = searchHelper(req.query);
            // End Search
            if (objectSearch.regex) {
                find.title = objectSearch.regex;
            }
            // End Search


            const records = await ProductCategory.find(find)
            const newRecords = createTree.tree(records);
            // console.log("RECORDS:", records);
            // console.log("IS ARRAY:", Array.isArray(records));

            res.render('admin/pages/products-category/index', {
                titlePage: "Danh mục sản phẩm",
                records: newRecords || [], // Đảm bảo luôn gửi mảng
                filterStatus: filterStatus,
                keyword: objectSearch.keyword,
            });
        }
        else {
            req.flash("error", "Bạn không có quyền truy cập vào trang này");
            res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/dashboard`);
        }

    } catch (error) {
        console.log("Lỗi index danh mục:", error);
        res.render('admin/pages/products-category/index', {
            titlePage: "Danh mục sản phẩm",
            records: []
        });
    }
}

//[PATCH] /admin/products-category/change-status/:status/:id
module.exports.status = async (req, res) => {
    try {
        if (res.locals.role.permissions.includes("products-category_edit")) {
            const status = req.params.status;
            const id = req.params.id;

            await ProductCategory.updateOne({ _id: id }, { status: status });
            req.flash('success', 'Cập nhật trạng thái thành công');
            // console.log(req.headers);
            res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/products-category`);
        }
        else {
            req.flash("error", "Bạn không được phép truy cập vào trang này");
            res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/products-category`);
        }
    } catch (error) {
        req.flash("error", "Lỗi truy cập");
        res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/products-category`);
    }
}

// [DELETE] /admin/products-category/delete/:id
module.exports.delete = async (req, res) => {
    try {
        if (res.locals.role.permissions.includes("products-category_delete")) {
            const id = req.params.id;
            await ProductCategory.updateOne({ _id: id }, { deleted: true, deleteAt: new Date() });
            req.flash('success', 'Xóa sản phẩm thành công');
            res.redirect(req.headers.referer || "/admin/products-category");
        }
        else {
            req.flash("error", "Bạn không được phép truy cập vào trang này");
            res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/products-category`);
            return;
        }
    } catch (error) {
        req.flash("error", "Lỗi truy cập");
        res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/products-category`);
    }
}

// [GET] /admin/products-category/detail/:slug
module.exports.detail = async (req, res) => {
    try {
        if (res.locals.role.permissions.includes("products-category_view")) {
            const find = {
                deleted: false,
                slug: req.params.slug
            }
            const productCategory = await ProductCategory.findOne(find);
            if (!productCategory) {
                req.flash("error", "Lỗi truy cập");
                res.redirect(`${systemConfig.prefixAdmin}/products-category`);
                return;
            }
            let category = null;
            if (productCategory.parent_id) {
                category = await ProductCategory.findOne({ _id: productCategory.parent_id });
            }

            res.render('admin/pages/products-category/detail.pug', {
                titlePage: req.params.slug,
                productCategory: productCategory,
                category: category
            });
        }
        else {
            req.flash("error", "Bạn không có quyền truy cập vào trang này");
            res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/products-category`);
        }
    } catch (error) {
        req.flash("error", "Lỗi truy cập");
        res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/products-category`);
    }

}

// [GET] /admin/products-category/edit/:id
module.exports.edit = async (req, res) => {
    try {
        if (res.locals.role.permissions.includes("products-category_edit")) {
            const id = req.params.id;
            // console.log(id);
            const find = {
                deleted: false,
                _id: id
            }
            const productCategory = await ProductCategory.findOne(find);
            const records = await ProductCategory.find({ deleted: false });
            const newRecords = createTree.tree(records);
            // console.log(product)
            res.render('admin/pages/products-category/edit', {
                titlePage: "Chỉnh sửa sản phẩm",
                productCategory: productCategory,
                records: newRecords
            });
        }
        else {
            req.flash("error", "Bạn không được phép truy cập vào trang này");
            res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/products-category`);
        }
    } catch (error) {
        req.flash("error", "Lỗi truy cập");
        res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/products-category`);
    }
}

// [PATCH] /admin/products-category/edit/:id
module.exports.editPatch = async (req, res) => {
    try {
        if (res.locals.role.permissions.includes("products-category_edit")) {
            const id = req.params.id
            if (req.body.position == "") {
                const countProductsCategory = await ProductCategory.countDocuments();
                req.body.position = countProductsCategory + 1;
            }
            else {
                req.body.position = parseInt(req.body.position);
            }
            // if(req.file) {
            //     req.body.thumbnail = `/uploads/${req.file.filename}`;
            // }
            // console.log(req.file);
            await ProductCategory.updateOne({ _id: id }, req.body);
            req.flash('success', 'Cập nhật thành công');
            res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/products-category`);
        }
        else {
            req.flash("error", "Bạn không được phép truy cập vào trang này");
            res.redirect(`${systemConfig.prefixAdmin}/products-category`);
        }
    } catch (error) {
        req.flash('error', 'Cập nhật thất bại');
        res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/products-category`)
    }
}

// [PATCH] /admin/products-category/change-multi-status
module.exports.changeMultiStatus = async (req, res) => {
    // console.log(req.body);
    try {
        if (res.locals.role.permissions.includes("products-category_edit")) {
            const type = req.body.type;
            const ids = req.body.ids.split(", ");
            // console.log(type);
            // console.log(ids);
            switch (type) {
                case "active":
                    await ProductCategory.updateMany({ _id: { $in: ids } }, { status: "active" });
                    req.flash('success', `Cập nhật trạng thái cho ${ids.length} sản phẩm thành công`);
                    break;
                case "inActive":
                    await ProductCategory.updateMany({ _id: { $in: ids } }, { status: "inActive" });
                    req.flash('success', `Cập nhật trạng thái cho ${ids.length} sản phẩm thành công`);
                    break;
                case "delete-multi":
                    if (res.locals.role.permissions.includes("products-category_delete")) {
                        await ProductCategory.updateMany({ _id: { $in: ids } }, { deleted: true, deleteAt: new Date() });
                        req.flash('success', `Xóa  ${ids.length} sản phẩm thành công`);
                    }
                    else {
                        req.flash("error", "Bạn không được phép truy cập vào trang này");
                        res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/products-category`);
                        return;
                    }
                    break;
                case "change-position":
                    // console.log(req.body.ids);
                    // console.log(ids);
                    for (const item of ids) {
                        let [id, position] = item.split("-");
                        // console.log(id);
                        // console.log(position);
                        position = parseInt(position);

                        await ProductCategory.updateOne({ _id: id }, { position: position });
                    }
                    req.flash('success', `Thay đổi vị trí cho ${ids.length} sản phẩm thành công`);
                    break;
                default:
                    break;
            }
            res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/products-category`);
        }
        else {
            req.flash("error", "Bạn không được phép truy cập vào trang này");
            res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/products-category`);
            return;
        }
    } catch (error) {
        req.flash("error", "Lỗi truy cập");
        res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/products-category`);
    }

}

module.exports.create = async (req, res) => {
    try {
        if (res.locals.role.permissions.includes("products-category_create")) {
            let find = {
                deleted: false
            }
            // console.log(records);

            const records = await ProductCategory.find(find);
            const newRecords = createTree.tree(records);
            res.render('admin/pages/products-category/create', {
                titlePage: "Thêm danh mục sản phẩm",
                records: newRecords
            })
        }
        else {
            req.flash("error", "Bạn không được phép truy cập vào trang này");
            res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/products-category`);
            return;
        }
    } catch (error) {
        req.flash("error", "Lỗi truy cập");
        res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/products-category`);
    }
}

module.exports.createPost = async (req, res) => {
    try {
        if (res.locals.role.permissions.includes("products-category_create")) {
            // console.log(req.body);
            if (req.body.position == "") {
                const count = await ProductCategory.countDocuments();
                req.body.position = count + 1;
            }
            else {
                req.body.position = parseInt(req.body.position);
            }
            const record = new ProductCategory(req.body);
            await record.save();
            req.flash('success', 'Thêm danh mục thành công');
            res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/products-category`);
        }
        else {
            req.flash("error", "Bạn không được phép truy cập vào trang này");
            res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/products-category`);
            return;
        }
    } catch (error) {
        req.flash("error", "Lỗi truy cập");
        res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/products-category`);
    }
}