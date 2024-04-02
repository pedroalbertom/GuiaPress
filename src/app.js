const express = require("express")
const connection = require("../config/connection")
const router = require("./router")

const app = express()

// View engine
app.set("view engine", "ejs")

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