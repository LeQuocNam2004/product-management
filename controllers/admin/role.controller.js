// [GET] /admin/roles/
module.exports.index = (req, res) => {
    res.render("admin/pages/roles/index", {
      pageTitle: "Nhóm quyền"
    });
}