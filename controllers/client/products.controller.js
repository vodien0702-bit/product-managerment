const Product = require('../../model/product.model.js');

module.exports.index = async (req, res) => {
    const products = await Product.find({deleted: false}).sort({position: "desc"});
    // console.log(products);
    const newListPriceProduct = products.map(item => {
        item.priceNew = (item.price * (100 - item.discountPercentage)/100).toFixed(2);
        return item;
    })
     res.render("client/pages/products/index.pug", {
        title: "Sản phẩm",
        products: newListPriceProduct
    });
}

// [GET] /products/detail/:slug
module.exports.detail = async (req, res) => {
    const find = {
        deleted: false,
        slug: req.params.slug,
        status: "active"
    }
    const product = await Product.findOne(find);
    // console.log(product);
    res.render('client/pages/products/detail.pug', {
        title: req.params.slug,
        product: product
    })
}