const Sequelize = require("sequelize")
const connection = require("../config/connection")

const Category = connection.define('categories', {
    title:{
        type: Sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

Category.sync({force: false}).then(() => {console.log("Tabela criada!")})

module.exports = Category