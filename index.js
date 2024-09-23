const express = require('express');

//Code hidden after up to GitHub
require("dotenv").config();

const app = express();
const port = process.env.PORT;

const route = require("./routes/client/index.router")

//Connect database
const database = require("./config/database")
database.connect()

app.set('views', './views');
app.set('view engine', 'pug');

app.use(express.static("public"));

route(app)

app.listen(port, () => {
    console.log(`Example listening on port ${port}`)
})