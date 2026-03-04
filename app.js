const express = require('express')
const app = express()

const userModel = require('./models/user')

app.get('/', (req, res) => {
    res.send('hi')
})

app.listen(3000, () => {
    console.log("SERVER RUNING ON PORT: 3000");
})