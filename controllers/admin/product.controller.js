const Product = require('../../models/product.model');
const ProductCategory = require("../../models/product-category.model");
const filterStatusHelper = require('../../helpers/filter-state.helper');
const systemConfig = require('../../config/system');
const paginationHelper = require('../../helpers/pagination.helper')
const createTreeHelper = require("../../helpers/create-tree.helper");

//[GET] /admin/products
module.exports.index = async(req, res) => {
    try {
        //Status filter
        const filterState = filterStatusHelper(req.query);
        //End status filter

        const find = {
            deleted: false,
        }

        if(req.query.status){
            find.status = req.query.status;
        }

        //Search
        if(req.query.keyword){
            const regex = new RegExp(req.query.keyword,"i");
        find.title = regex; 
        }
        //End search

        //Pagination
        const countProducts = await Product.countDocuments(find);
        const objectPagination = paginationHelper(4, req.query, countProducts)
        //End pagination

        //Sort
        const sort = {};
        if(req.query.sortKey && req.query.sortValue){
            sort[req.query.sortKey] = req.query.sortValue;
        }else{
            sort['position'] = 'desc';
        }
        //End sort

        const products = await Product.find(find)
        .sort(sort)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);

        res.render("admin/pages/products/index",{
            pageTitle:"Danh sách sản phẩm",
            products: products,
            filterState: filterState,
            keyword: req.query.keyword,
            pagination: objectPagination
        });
    } catch (error) {
        console.log(error);
        res.redirect(`/${systemConfig.prefixAdmin}/products`);
    }
    
}

//[PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async(req, res) => {
    const status = req.params.status;
    const id = req.params.id;

    await Product.updateOne({
        _id: id
    },{
        status: status
    });
    req.flash('success', 'Cập nhật trạng thái thành công!');

    res.redirect("back");
}
//[PATCH] /admin/products/change-multi
module.exports.changeMulti= async(req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");

    switch (type) {
        case "active":
        case "inactive":    
            await Product.updateMany({
                _id: {$in: ids}
            },{
                status: type
            });

            req.flash('success', 'Cập nhật trạng thái thành công!');

            break;
        case "delete-all":
            await Product.updateMany({
                _id: {$in: ids}
            },{
                deleted:true,
                deletedAt: new Date()
            });

            req.flash('success', 'Cập nhật trạng thái thành công!');

            break; 
        case "change-position":
            for (const item of ids) {
                let [id,position] = item.split("-");
                position = parseInt(position);
                
                await Product.updateOne({
                    _id: id
                },{
                    position: position
                });
            }

            req.flash('success', 'Cập nhật trạng thái thành công!');

            break;       
        default:
            break;        
    }

    res.redirect("back");
}
//[DELETE] /admin/products/delete/:id
module.exports.deleteItem= async(req, res) => {
    try {
        const id = req.params.id;
    //Xóa vĩnh viễn
    // await Product.deleteOne({_id: id});

    //Xóa mềm
        await Product.updateOne({
            _id:id
        },{
            deleted: true,
            deletedAt: new Date()
        });

        
    } catch (error) {
        console.log(error);
    }
    res.redirect("back");
}

//[GET] /admin/products/create : dùng để render ra giao diện
module.exports.create = async(req,res) =>{
    const records = await ProductCategory.find({
        deleted: false,
      });
    
    const newRecords = createTreeHelper(records);

    res.render("admin/pages/products/create", {
        pageTitle: "Thêm mới sản phẩm",
        records: newRecords
    });
}

//[POST] /admin/products/create :thêm mới sản phẩm vào database
module.exports.createPost = async(req,res) =>{
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    
    if(req.body.position == ""){
        const countProducts = await Product.countDocuments();
        req.body.position =countProducts + 1;
    }else{
        req.body.position = parseInt(req.body.position);
    }
    
    // console.log(req.file);
    // console.log(req.body);

    // if(req.file && req.file.filename){
    //     req.body.thumbnail = `/uploads/${req.file.filename}`;
    // }

    const product = new Product(req.body);
    await product.save();

    req.flash("success", "Thêm mới sản phẩm thành công!");

    res.redirect(`/${systemConfig.prefixAdmin}/products`); 
}

//[GET] /admin/products/edit/:id : dùng để render ra giao diện
module.exports.edit = async(req,res) =>{
    try {
        const id = req.params.id;

        const product = await Product.findOne({
            _id:id,
            deleted: false
        });

        const records = await ProductCategory.find({
            deleted: false,
          });
      
        const newRecords = createTreeHelper(records);

        res.render("admin/pages/products/edit", {
            pageTitle: "Chỉnh sửa sản phẩm",
            product:product,
            records: newRecords
        });
    } catch (error) {
        req.redirect(`/${systemConfig.prefixAdmin}/products`);   
    }
}

//[PATCH] /admin/products/edit/:id :thêm mới sản phẩm vào database
module.exports.editPatch = async(req,res) =>{
    try {
        const id = req.params.id;
        req.body.price = parseInt(req.body.price);
        req.body.discountPercentage = parseInt(req.body.discountPercentage);
        req.body.stock = parseInt(req.body.stock);
        
        if(req.file && req.file.filename) {
            req.body.thumbnail = `/uploads/${req.file.filename}`;
        }
        await Product.updateOne({
            _id:id,
            deleted:false
        },req.body);

        req.flash("success", "Cập nhật sản phẩm thành công!");

        res.redirect("back"); 
    } catch (error) {
        req.redirect(`/${systemConfig.prefixAdmin}/products`);
    }
    
}

//[GET] /admin/products/detail/:id : dùng để render ra giao diện
module.exports.detail = async(req,res) =>{
    try {
        const id = req.params.id;

        const product = await Product.findOne({
            _id:id,
            deleted: false
        });

        res.render("admin/pages/products/detail", {
            pageTitle: "Chi tiết sản phẩm",
            product:product
        });
    } catch (error) {
        req.redirect(`/${systemConfig.prefixAdmin}/products`);   
    }
}