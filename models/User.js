const Sequelize = require("sequelize")
const connection = require("../config/connection")

const User = connection.define('users', {
    email:{
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

User.sync({force: false}).then(() => {console.log("Tabela users criada!")})

module.exports = User