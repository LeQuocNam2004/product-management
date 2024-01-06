const express = require("express");
const dotenv = require("dotenv");
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const database = require("./config/database");
const systemConfig = require('./config/system');

dotenv.config();

database.connect();

const routesAdmin = require('./routes/admin/index.route');
const routesClient = require('./routes/client/index.route');

const app = express();//tạo app để sử dụng express
const port = process.env.PORT;

app.use(bodyParser.urlencoded({ extended: false }))

app.use(methodOverride('_method'))

app.set('views','./views');
app.set('view engine','pug');

app.use(express.static("public"));

//App local variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;

//Routes admin
routesAdmin(app);

//Routes client
routesClient(app);

app.listen(port, () =>{
    console.log(`App listening on ${port}`);
});