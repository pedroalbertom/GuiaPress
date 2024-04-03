const router = require("express").Router()
const Category = require("../models/Category")
const Article = require("../models/Article")
const slugify = require("slugify")

router.get("/", (req, res) => {
    Article.findAll({
        limit: 4,
        order:[
            ['id', 'DESC']
        ]
    }).then(articles => {
        Category.findAll().then(categories => {
            res.render("index", { articles: articles, categories: categories })
        })
    })
})

router.get("/admin/articles", (req, res) => {
    Article.findAll({
        include: [{ model: Category }]
    }).then((articles) => {
        res.render("admin/articles/index", { articles: articles })
    })
})

router.get("/admin/articles/new", (req, res) => {
    Category.findAll().then(categories => {
        res.render("admin/articles/new", { categories: categories })
    })
})

router.post("/articles/save", (req, res) => {
    let title = req.body.title
    let body = req.body.body
    let category = req.body.category

    Article.create({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category
    }).then(() => {
        res.redirect("/admin/articles")
    })
})

router.post("/articles/delete", (req, res) => {
    let id = req.body.id
    if (id != undefined) {
        if (!isNaN(id)) {
            Article.destroy({ where: { id: id } }).then(() => {
                res.redirect("/admin/articles")
            })
        } else {
            res.redirect("/admin/articles")
        }
    } else {
        res.redirect("/admin/articles")
    }
})

router.get("/admin/articles/edit/:id", (req, res) => {
    let id = req.params.id
    if (isNaN(id)) {
        res.redirect("/admin/articles")
    }
    Article.findByPk(id).then(article => {
        if (article != undefined) {
            Category.findAll().then(categories => {
                res.render("admin/articles/edit", { categories: categories, article: article })
            })
        } else {
            res.redirect("/admin/articles")
        }
    }).catch(err => {
        res.redirect("/admin/articles")
    })
})

router.post("/articles/update", (req, res) => {
    let id = req.body.id
    let title = req.body.title
    let body = req.body.body
    let category = req.body.category

    Article.update({title: title, body: body, categoryId: category, slug: slugify(title)}, {
        where: {
            id: id
        }
    }).then(() => {
        res.redirect("/admin/articles")
    }).catch(err => {
        res.redirect("/admin/articles")
    })
})

router.get("/:slug", (req, res) => {
    let slug = req.params.slug
    Article.findOne({where:{slug: slug}}).then(article => {
        if (article != undefined) {
            Category.findAll().then(categories => {
                res.render("article", { article: article, categories: categories })
            })
        } else {
            res.redirect("/")
        }
    }).catch(err => {
        res.redirect("/")
    })
})

router.get("/category/:slug", (req, res) => {
    let slug = req.params.slug
    Category.findOne({
        where:{
            slug: slug
        },
        include: [{model: Article}]
    }).then(category => {
        if(category != undefined){
            Category.findAll().then(categories => {
                res.render("index", {articles: category.articles, categories: categories})
            })            
        }else{
            res.redirect("/")
        }
    }).catch(err => {
        res.redirect("/")
    })
})

router.get("/articles/page/:num", (req, res) => {
    let page = req.params.num
    let offset = 0;

    if(isNaN(page) || page == 1){
        offset = 0
    }else{
        offset = (parseInt(page) - 1) * 4
    }

    Article.findAndCountAll({
        limit: 4,
        offset: offset,
        order: [['id', 'DESC']]
    }).then(articles => {
        let next;
        if(offset + 4 >= articles.count){
            next = false
        }else{
            next = true
        }
        let result = {
            page: parseInt(page),
            next: next,
            articles: articles,
        }

        Category.findAll().then(categories => {
            res.render("admin/articles/page", {result: result, categories: categories})
        })
    })
})

module.exports = router