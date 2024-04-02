const express = require("express")
const categoriesController = require("../controller/categoriesController")
const articlesController = require("../controller/articlesController")

const router = express.Router()

router.use("/", categoriesController)
router.use("/", articlesController)

module.exports = router