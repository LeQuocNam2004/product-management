const express = require("express");
const dotenv = require("dotenv");
const routesClient = require('./routes/client/index.route');

dotenv.config();

const app = express();//tạo app để sử dụng express
const port = process.env.PORT;

app.set('views','./views');
app.set('view engine','pug');

app.use(express.static("public"));

//Routes client
routesClient(app);

app.listen(port, () =>{
    console.log(`App listening on ${port}`);
});