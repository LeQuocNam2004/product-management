const Role = require("../../models/role.model");

const systemConfig = require("../../config/system");

// [GET] /admin/roles/
module.exports.index = async(req, res) => {
    const records = await Role.find({
      deleted: false
    });
    res.render("admin/pages/roles/index", {
      pageTitle: "Nhóm quyền",
      records: records
    });
}

// [GET] /admin/roles/create
module.exports.create = (req, res) => {
  res.render("admin/pages/roles/create", {
    pageTitle: "Thêm mới Nhóm quyền"
  });
}

// [POST] /admin/roles/create
module.exports.createPost = async (req, res) => {
  const record = new Role(req.body);
  await record.save();

  res.redirect(`/${systemConfig.prefixAdmin}/roles`);
}

// [GET] /admin/roles/edit/:id
module.exports.edit = async (req, res) => {
  // Tự thêm try/catch
  const record = await Role.findOne({
    _id: req.params.id,
    deleted: false
  });

  res.render("admin/pages/roles/edit", {
    pageTitle: "Chỉnh sửa Nhóm quyền",
    record: record
  });
}

// [PATCH] /admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {
  // Tự thêm try/catch
  await Role.updateOne({
    _id: req.params.id,
    deleted: false
  }, req.body);

  res.redirect(`back`);
}