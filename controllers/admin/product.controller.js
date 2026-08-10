const Product = require('../../model/product.model');
const filterStatusHelper = require('../../helpers/filterStatus');
const searchHelper = require('../../helpers/search');
const paginationHelper = require('../../helpers/pagination');
const systemConfig = require('../../config/systems');
module.exports.index = async (req, res) => {
    const filterStatus = filterStatusHelper(req.query);
    let find = {
        deleted: false
    }
    
    // condition sort
    let sort = {};
    if(req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue;
        // console.log(sort);

    }
    else {
        sort.position = "desc";
    }
    // end condition sort
    
    // Filter Status
    if(req.query.status) {
        find.status = req.query.status;
    }
    // End Filter Status

    // Search
    const objectSearch = searchHelper(req.query);
    // End Search
    if(objectSearch.regex) {
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
    const products = await Product.find(find)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);
    const newListPriceProduct = products.map(item => {
        item.priceNew = (item.price * (100 - item.discountPercentage)/100).toFixed(2);
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

//[GET] /admin/products/change-status/:status/:id
module.exports.status = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;
    
    await Product.updateOne({_id: id}, {status: status});
    req.flash('success', 'Cập nhật trạng thái thành công');
    // console.log(req.headers);
    res.redirect(req.headers.referer || "/admin/products");
}
// [PÂTCJ] /admin/products/change-multi-status
module.exports.changeMultiStatus = async (req, res) => {
    // console.log(req.body);
    const type = req.body.type;
    const ids = req.body.ids.split(", ");
    // console.log(type);
    // console.log(ids);
    switch (type) {
        case "active":
            await Product.updateMany({ _id: { $in: ids }}, { status: "active"});
            req.flash('success', `Cập nhật trạng thái cho ${ids.length} sản phẩm thành công`);
            break;
        case "inActive":
            await Product.updateMany({ _id: { $in: ids }}, { status: "inActive"});
            req.flash('success', `Cập nhật trạng thái cho ${ids.length} sản phẩm thành công`);
            break;
        case "delete-multi":
            await Product.updateMany({_id: { $in: ids }}, { deleted: true, deleteAt: new Date()});
            req.flash('success', `Xóa  ${ids.length} sản phẩm thành công`);
        case "change-position":
            // console.log(req.body.ids);
            // console.log(ids);
            for(const item of ids){
                let [id, position] = item.split("-");
                // console.log(id);
                // console.log(position);
                position = parseInt(position);

                await Product.updateOne({_id: id}, {position: position});
            }
            req.flash('success', `Thay đổi vị trí cho ${ids.length} sản phẩm thành công`);
            break;
        default:
            break;
    }
    res.redirect(req.headers.referer || "/admin/products");
}
// [DELETE] /admin.products/delete/:id
module.exports.delete = async (req, res) => {
    const id = req.params.id;
    await Product.updateOne({_id: id}, {deleted: true, deleteAt: new Date()});
    req.flash('success', 'Xóa sản phẩm thành công');
    res.redirect(req.headers.referer || "/admin/products");
}

// [GET] /admin/products/create
module.exports.create = async (req, res) => {
    res.render('admin/pages/products/create', {
        titlePage: "Thêm mới sản phẩm"
    });
}

module.exports.createPost = async (req, res) => {
    req.body.price = parseFloat(req.body.price);
    req.body.discountPercentage = parseFloat(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    if(req.body.position == "") {
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
    await product.save();
    req.flash('success', 'Thêm sản phẩm thành công');
    res.redirect(`${systemConfig.prefixAdmin}/products`);
}

// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;
        // console.log(id);
        const find = {
            deleted: false,
            _id: id
        }
        const product = await Product.findOne(find);
        // console.log(product)
        res.render('admin/pages/products/edit', {
            titlePage: "Chỉnh sửa sản phẩm",
            product: product
        });
    } catch (error) {
        res.redirect('/admin/products');
    }
}

// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
    try {
        const id = req.params.id
        req.body.price = parseFloat(req.body.price);
        req.body.discountPercentage = parseFloat(req.body.discountPercentage);
        req.body.stock = parseInt(req.body.stock);
        if(req.body.position == "") {
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
        await Product.updateOne({ _id: id}, req.body);
        req.flash('success', 'Cập nhật thành công');
        res.redirect(req.headers.referer || "/admin/products");
    } catch (error) {
        req.flash('error', 'Cập nhật thất bại');
        res.redirect(req.headers.referer || "/admin/products")
    }
}

// [GET] /admin/products/detail:slug

module.exports.detail = async (req, res) => {
    const find = {
        deleted: false,
        slug: req.params.slug
    }
    const product = await Product.findOne(find);
    res.render('admin/pages/products/detail.pug', {
        titlePage: req.params.slug,
        product: product
    });
}