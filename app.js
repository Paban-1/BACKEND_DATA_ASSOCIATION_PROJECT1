const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')

const userModel = require('./models/user')

app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.get('/', (req, res) => {
    res.render('index')
})

app.post('/register', async (req, res) => {
    const { username, name, age, email, password } = req.body
})

app.listen(3000, () => {
    console.log("SERVER RUNING ON PORT: 3000");
})