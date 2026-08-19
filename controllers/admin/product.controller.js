const Product = require('../../model/product.model');
const ProductCategory = require('../../model/products-category.model');
const Account = require('../../model/account.model');
const createTree = require('../../helpers/createTree');
const filterStatusHelper = require('../../helpers/filterStatus');
const searchHelper = require('../../helpers/search');
const paginationHelper = require('../../helpers/pagination');
const systemConfig = require('../../config/systems');

module.exports.index = async (req, res) => {
    try {
        if (res.locals.role.permissions.includes("products_view")) {
            const filterStatus = filterStatusHelper(req.query);
            let find = {
                deleted: false
            }

            // condition sort
            let sort = {};
            if (req.query.sortKey && req.query.sortValue) {
                sort[req.query.sortKey] = req.query.sortValue;
                // console.log(sort);

            }
            else {
                sort.position = "desc";
            }
            // end condition sort

            // Filter Status
            if (req.query.status) {
                find.status = req.query.status;
            }
            // End Filter Status

            // Search
            const objectSearch = searchHelper(req.query);
            // End Search
            if (objectSearch.regex) {
                find.title = objectSearch.regex;
            }
            // End Search

            // Pagination
            const countProducts = await Product.countDocuments(find);

            const objectPagination = paginationHelper(
                {
                    currentPage: 1,
                    limitItems: 5
                },
                req.query,
                countProducts
            );
            // End Pagination
            // create by user
            const products = await Product.find(find)
                .sort(sort)
                .limit(objectPagination.limitItems)
                .skip(objectPagination.skip);

            for (const product of products) {
                const user = await Account.findOne({ _id: product.createBy.account_id });
                if (user) {
                    product.createBy.accountFullName = user.fullName;
                }
            }
            const newListPriceProduct = products.map(item => {
                item.priceNew = (item.price * (100 - item.discountPercentage) / 100).toFixed(2);
                return item;
            })
            res.render('admin/pages/products/index', {
                titlePage: "Danh sách sản phẩm",
                products: newListPriceProduct,
                filterStatus: filterStatus,
                keyword: objectSearch.keyword,
                objectPagination: objectPagination
            })
        }
        else {
            req.flash("error", "Bạn không được phép truy cập vào trang này");
            res.redirect(req.headers.referer || `${prefixAdmin}/dashboard`);
        }
    } catch (error) {
        req.flash("error", "Lỗi truy cập");
        res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/dashboard`);
    }
}

//[PATCH] /admin/products/change-status/:status/:id
module.exports.status = async (req, res) => {
    try {
        if (res.locals.role.permissions.includes("products_edit")) {
            const status = req.params.status;
            const id = req.params.id;

            await Product.updateOne({ _id: id }, { status: status });
            req.flash('success', 'Cập nhật trạng thái thành công');
            // console.log(req.headers);
            res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/products`);
        }
        else {
            req.flash("error", "Bạn không được phép truy cập vào trang này");
            res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/products`);
        }
    } catch (error) {
        req.flash("error", "Lỗi truy cập");
        res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/products`);
    }
}
// [PATCH] /admin/products/change-multi-status
module.exports.changeMultiStatus = async (req, res) => {
    try {
        if (res.locals.role.permissions.includes("products_edit")) {
            const type = req.body.type;
            const ids = req.body.ids.split(", ");
            // console.log(type);
            // console.log(ids);
            switch (type) {
                case "active":
                    await Product.updateMany({ _id: { $in: ids } }, { status: "active" });
                    req.flash('success', `Cập nhật trạng thái cho ${ids.length} sản phẩm thành công`);
                    break;
                case "inActive":
                    await Product.updateMany({ _id: { $in: ids } }, { status: "inActive" });
                    req.flash('success', `Cập nhật trạng thái cho ${ids.length} sản phẩm thành công`);
                    break;
                case "delete-multi":
                    if (res.locals.role.permissions.includes("products_delete")) {
                        await Product.updateMany({ _id: { $in: ids } }, { deleted: true, deleteBy: { account_id: res.locals.user.id, deleteAt: new Date() } });
                        req.flash('success', `Xóa  ${ids.length} sản phẩm thành công`);
                    }
                    else {
                        req.flash("error", "Bạn không được phép truy cập vào trang này");
                        res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/products`);
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

                        await Product.updateOne({ _id: id }, { position: position });
                    }
                    req.flash('success', `Thay đổi vị trí cho ${ids.length} sản phẩm thành công`);
                    break;
                default:
                    break;
            }
            res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/products`);
        }
        else {
            req.flash("error", "Bạn không được phép truy cập vào trang này");
            res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/products`);
        }
    } catch (error) {
        req.flash("error", "Lỗi truy cập");
        res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/products`);
    }
    // console.log(req.body);
}
// [DELETE] /admin.products/delete/:id
module.exports.delete = async (req, res) => {
    try {
        if (res.locals.role.permissions.includes("products_delete")) {
            const id = req.params.id;
            await Product.updateOne({ _id: id }, { deleted: true, deleteBy: { account_id: res.locals.user.id, deleteAt: new Date() } });
            req.flash('success', 'Xóa sản phẩm thành công');
            res.redirect(req.headers.referer || "/admin/products");
        }
        else {
            req.flash("error", "Bạn không được phép truy cập vào trang này");
            res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/products`);
        }
    } catch (error) {
        req.flash("error", "Lỗi truy cập");
        res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/products`);
    }
}

// [GET] /admin/products/create
module.exports.create = async (req, res) => {
    try {
        if (res.locals.role.permissions.includes("products_create")) {
            const categories = await ProductCategory.find({ deleted: false });
            const newCategories = createTree.tree(categories);
            // console.log(newCategories);
            res.render('admin/pages/products/create', {
                titlePage: "Thêm mới sản phẩm",
                categories: newCategories
            });
        }
        else {
            req.flash("error", "Bạn không được phép truy cập vào trang này");
            res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/products`);
        }
    } catch (error) {
        req.flash("error", "Lỗi truy cập");
        res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/products`);
    }
}

module.exports.createPost = async (req, res) => {
    try {
        if (res.locals.role.permissions.includes("products_create")) {

            req.body.price = parseFloat(req.body.price);
            req.body.discountPercentage = parseFloat(req.body.discountPercentage);
            req.body.stock = parseInt(req.body.stock);
            if (req.body.position == "") {
                const countProducts = await Product.countDocuments();
                req.body.position = countProducts + 1;
            }
            else {
                req.body.position = parseInt(req.body.position);
            }
            // if(req.file) {
            //     req.body.thumbnail = `/uploads/${req.file.filename}`;
            // }
            // console.log(req.file);
            const product = new Product(req.body);
            product.createBy.account_id = res.locals.user.id;
            await product.save();
            req.flash('success', 'Thêm sản phẩm thành công');
            res.redirect(`${systemConfig.prefixAdmin}/products`);
        }
        else {
            req.flash("error", "Bạn không được phép truy cập vào trang này");
            res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/products`);
        }
    } catch (error) {
        req.flash("error", "Lỗi truy cập");
        res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/products`);
    }
}

// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
    try {
        if (res.locals.role.permissions.includes("products_edit")) {
            const id = req.params.id;
            // console.log(id);
            const find = {
                deleted: false,
                _id: id
            }
            const product = await Product.findOne(find);
            const categories = await ProductCategory.find({ deleted: false });
            const newCategories = createTree.tree(categories);
            // console.log(product)
            res.render('admin/pages/products/edit', {
                titlePage: "Chỉnh sửa sản phẩm",
                product: product,
                categories: newCategories
            });
        }
        else {
            req.flash("error", "Bạn không được phép truy cập vào trang này");
            res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/products`);
        }
    } catch (error) {
        req.flash("error", "Lỗi truy cập");
        res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/products`);
    }
}

// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
    try {
        if (res.locals.role.permissions.includes("products_edit")) {
            const id = req.params.id
            req.body.price = parseFloat(req.body.price);
            req.body.discountPercentage = parseFloat(req.body.discountPercentage);
            req.body.stock = parseInt(req.body.stock);
            if (req.body.position == "") {
                const countProducts = await Product.countDocuments();
                req.body.position = countProducts + 1;
            }
            else {
                req.body.position = parseInt(req.body.position);
            }
            // if(req.file) {
            //     req.body.thumbnail = `/uploads/${req.file.filename}`;
            // }
            // console.log(req.file);
            await Product.updateOne({ _id: id }, req.body);
            req.flash('success', 'Cập nhật thành công');
            res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/products`);
        }
        else {
            req.flash("error", "Bạn không được phép truy cập vào trang này");
            res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/products`);
        }
    } catch (error) {
        req.flash('error', 'Cập nhật thất bại');
        req.flash("error", "Bạn không được phép truy cập vào trang này");
        res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/products`);
    }
}

// [GET] /admin/products/detail:slug

module.exports.detail = async (req, res) => {
    try {
        if (res.locals.role.permissions.includes("products_view")) {
            const find = {
                deleted: false,
                slug: req.params.slug
            };

            const product = await Product.findOne(find);

            let category = null;
            if (product && product.product_category_id) {
                category = await ProductCategory.findOne({
                    deleted: false,
                    _id: product.product_category_id
                });
            }
            else {
                req.flash("error", "Lỗi truy cập");
                res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/products`);
                return;
            }

            res.render('admin/pages/products/detail.pug', {
                titlePage: req.params.slug,
                product: product,
                category: category // Chỉ có key category nếu category tồn tại
            });
        }
        else {
            req.flash("error", "Bạn không có quyền truy cập vào trang này");
            res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/products`);
        }
    } catch (error) {
        req.flash("error", "Lỗi truy cập");
        res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/products`);
    }
}