module.exports.index = (req, res) => {
    res.render('admin/pages/dashboards/index', {
        titlePage: "Trang chủ admin"
    });
}
// module.exports.create = (req, res) => {
//     res.send("Trang admin create");
// }