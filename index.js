const express = require('express')

// Override Method
const methodOverride = require('method-override')

//Body Parser
const bodyParser = require('body-parser')

//Flash
const cookieParser = require('cookie-parser')
const session = require('express-session')
const flash = require("express-flash")

//Code hidden after up to GitHub
require("dotenv").config()

const app = express()
const port = process.env.PORT

// app.use(methodOverride('X-HTTP-Method-Override'))
app.use(methodOverride('_method'))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

const routeAdmin = require("./routes/admin/index.router")
const route = require("./routes/client/index.router")

//Connect database
const database = require("./config/database")
database.connect()

app.set('views', './views')
app.set('view engine', 'pug')

//App Locals Variables
const systemConfig = require("./config/system")
app.locals.prefixAdmin = systemConfig.prefixAdmin

//Display message to view
app.use(cookieParser("HJFJFJFUUFJGG"));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

app.use(express.static("public"))

routeAdmin(app)
route(app)

app.listen(port, () => {
    console.log(`Example listening on port ${port}`)
})