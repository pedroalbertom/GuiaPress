const express = require("express")
const session = require("express-session")
const connection = require("../config/connection")
const router = require("./router")

const app = express()

// View engine
app.set("view engine", "ejs")

// Sessions
app.use(session({
    secret:"segredo", 
    cookie: {maxAge: 30000},
    resave: true,
    saveUninitialized: true
}));

// Static
app.use(express.static("public"))

app.use(express.urlencoded({extended: false}))
app.use(express.json())

// Database
connection
    .authenticate()
    .then(() => {
        console.log("Conexão feita com sucesso!")
    }).catch((err) => {
        console.log(err)
    })

// Routes
app.use(router)

module.exports = app