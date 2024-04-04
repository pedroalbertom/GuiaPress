const express = require("express")
const categoriesController = require("../controller/categoriesController")
const articlesController = require("../controller/articlesController")
const userController = require("../controller/userController")

const router = express.Router()

router.use(categoriesController)
router.use(articlesController)
router.use(userController)

router.get("/session", (req, res) => {
    req.session.treinamento = "formação node js"
    req.session.ano = 2024
    req.session.email = "victor@udemy.com"
    req.session.user = {
        username: "victorlima",
        email: "email@email.com",
        id: 10
    }
    res.send("Sessão gerada!")
})

router.get("/leitura", (req, res) => {
    res.json({
        treinamento: req.session.treinamento,
        ano: req.session.ano,
        email: req.session.email,
        user: req.session.user
    })
})

module.exports = router