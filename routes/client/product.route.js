const express = require('express');
const router = express.Router();

const controller = require('../../controllers/client/product.controller');

router.get("/", controller.index);

// router.get("/detail", (req, res) => {
    
// });

// router.get("/edit", (req, res) => {
    
// });

// router.get("/create", (req, res) => {
    
// });

module.exports = router;