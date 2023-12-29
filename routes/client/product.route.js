const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
    res.render("client/pages/products/index");
});

// router.get("/detail", (req, res) => {
    
// });

// router.get("/edit", (req, res) => {
    
// });

// router.get("/create", (req, res) => {
    
// });

module.exports = router;