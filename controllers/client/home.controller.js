module.exports.index = (req, res) => {
    res.render("client/pages/home/index.pug", {
        title: "Trang chủ",
        message: "Đây là trang chủ"
    });
}