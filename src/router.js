const express = require("express")
const categoriesController = require("../controller/categoriesController")
const articlesController = require("../controller/articlesController")
const userController = require("../controller/userController")

const router = express.Router()

router.use("/", categoriesController)
router.use("/", articlesController)
router.use("/", userController)

module.exports = router