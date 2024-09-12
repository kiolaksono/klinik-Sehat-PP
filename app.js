const express = require('express')

const app = express()
const port = 3000

app.set("view engine","ejs")
app.use(express.urlencoded({extended:true}))

app.use('/',require("./routers/index"))

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})