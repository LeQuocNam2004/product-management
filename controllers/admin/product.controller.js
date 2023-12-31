const Product = require('../../models/product.model');
const filterStatusHelper = require('../../helpers/filter-state.helper');
const systemConfig = require('../../config/system');
const paginationHelper = require('../../helpers/pagination.helper')

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

        const products = await Product.find(find)
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