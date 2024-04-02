const Sequelize = require("sequelize")
const connection = require("../config/connection")
const Category = require("../models/Category")

const Article = connection.define('articles', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    },
    body: {
        type: Sequelize.TEXT,
        allowNull: false
    }
})

Category.hasMany(Article) // A Category has many Articles
Article.belongsTo(Category) // An Article belongs to a Category

Article.sync({force: false}).then(() => {console.log("Tabela criada!")})

module.exports = Article