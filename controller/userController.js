const router = require("express").Router()
const User = require("../models/User")
const bcrypt = require("bcryptjs")

// READ
router.get("/admin/users", (req, res) => {
    User.findAll().then(users => {
        res.render("admin/users/index", { users: users })
    })
})

// CREATE
router.get("/admin/users/create", (req, res) => {
    res.render("admin/users/create")
})
router.post("/users/create", (req, res) => {
    let email = req.body.email
    let password = req.body.password

    User.findOne({where: {email: email}}).then( user => {
        if(user == undefined){
            let salt = bcrypt.genSaltSync(10)
            let hash = bcrypt.hashSync(password, salt)
            User.create({
                email: email,
                password: hash
            }).then(() => {
                res.redirect("/admin/users")
            }).catch(() => {
                res.redirect("/admin/users")
            })
        } else {
            res.redirect("/admin/users/create")
        }
    })
})

// DELETE
router.post("/users/delete", (req, res) => {
    let id = req.body.id
    if (id != undefined) {
        if (!isNaN(id)) {
            User.destroy({ where: { id: id } }).then(() => {
                res.redirect("/admin/users")
            })
        } else {
            res.redirect("/admin/users")
        }
    } else {
        res.redirect("/admin/users")
    }
})

// UPDATE
router.get("/admin/users/edit/:id", (req, res) => {
    let id = req.params.id
    if (isNaN(id)) {
        res.redirect("/admin/users")
    }
    User.findByPk(id).then(user => {
        if (user != undefined) {
            res.render("admin/users/edit", { user: user })
        } else {
            res.redirect("/admin/users")
        }
    }).catch(erro => {
        res.redirect("/admin/users")
    })
})

router.post("/users/update", (req, res) => {
    let id = req.body.id
    let email = req.body.email
    let password = req.body.password

    let salt = bcrypt.genSaltSync(10)
    let hash = bcrypt.hashSync(password, salt)

    User.update({ email: email , password: hash }, {
        where: {
            id: id
        }
    }).then(() => {
        res.redirect("/admin/users")
    })
})

router.get("/session/iniciar", (req, res) => {
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

router.get("/session/leitura", (req, res) => {
    res.json({
        treinamento: req.session.treinamento,
        ano: req.session.ano,
        email: req.session.email,
        user: req.session.user
    })
})

module.exports = router