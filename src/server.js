const app = require("./app")
require("dotenv").config()

const PORT = process.env.PORT || 50135

app.listen(PORT, () => {
    console.log(`O servidor está rodando na porta ${PORT}!`)
})
