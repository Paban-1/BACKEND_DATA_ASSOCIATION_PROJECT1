const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const bcrypt = require('bcrypt')

const userModel = require('./models/user')
const postModel = require('./models/post')

app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.get('/', (req, res) => {
    res.render('index')
})

app.post('/register', async (req, res) => {
    const { username, name, age, email, password } = req.body
    let user = await userModel.findOne({ email })
    if (user) return res.status(500).send("User already exists")

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            let user = await userModel.create({
                username,
                name,
                age,
                email,
                password: hash
            })
            let token = jwt.sign({
                email: user.email,
                userId: user._id
            }, "shhhhh",)

            res.cookie('token', token)
            res.send("User Registered Successfully")
        })

    })
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.get("/profile", isLoggedIn, (req, res) => {
    res.send(req.user)
})

app.post('/login', async (req, res) => {
    const { email, password } = req.body

    let user = await userModel.findOne({ email })
    if (!user) return res.status(500).send("Something went wrong")

    bcrypt.compare(password, user.password, (err, result) => {
        if (result) return res.status(200).send("Login Successful")
        else res.redirect('/login')

    })
})

app.get('/logout', (req, res) => {
    res.cookie('token', "")
    res.redirect('/login')
})

function isLoggedIn(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.send('You must be logged in to access this page');
    }

    try {
        const data = jwt.verify(token, "shhhhh");
        req.user = data;
        next();
    } catch (err) {
        return res.status(403).send('Invalid or expired token');
    }
}

app.listen(3000, () => {
    console.log("SERVER RUNING ON PORT: 3000");
})