const router = require("express").Router()
const User = require("../models/User")
const bcrypt = require("bcryptjs")
const adminAuths = require("../middlewares/adminAuths")

// READ
router.get("/admin/users", adminAuths,(req, res) => {
    User.findAll().then(users => {
        res.render("admin/users/index", { users: users })
    })
})

// CREATE
router.get("/admin/users/create", adminAuths,(req, res) => {
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
router.get("/admin/users/edit/:id", adminAuths,(req, res) => {
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

router.get("/login", (req, res) => {
    res.render("admin/users/login")
})
router.post("/authenticate", (req, res) => {
    let email = req.body.email
    let password = req.body.password

    User.findOne({where: {email: email}}).then(user => {
        if(user != undefined){
            // Validar senha
            let correct = bcrypt.compareSync(password, user.password)
            if(correct){
                req.session.user = {
                    id: user.id,
                    email: user.email
                }
                res.redirect("/admin/categories")
            }else{
                res.redirect("/login")
            }
        }else{
            res.redirect("/login")
        }
    })
})

router.get("/logout", (req, res) => {
    req.session.user = undefined
    res.redirect("/")
})

module.exports = router