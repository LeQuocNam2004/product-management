const express = require("express");
const routesClient = require('./routes/client/index.route');

const app = express();//tạo app để sử dụng express
const port = 3000;

app.set('views','./views');
app.set('view engine','pug');

//Routes client
routesClient(app);

app.listen(port, () =>{
    console.log(`App listening on ${port}`);
});