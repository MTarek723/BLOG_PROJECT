const express = require('express')
const router = express.Router()
const Post = require("../models/post")
const User = require("../models/user")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const jwtSecret = process.env.JWT_SECRET

const adminLayout = "../views/layouts/admin"

//Sign In - Get Route
router.get('/admin', async (req, res) => {
    const locals = {
        title: "admin Page"
    }
    try {
        res.render('admin/index', { locals, layout: adminLayout })
    } catch (error) {
        console.log(error)
    }
})

//Sign In - Post Route
router.post('/admin', async (req, res) => {
    try {
        const {username, password} = req.body
        const user = await User.findOne({ username })
        if (!user) {
            return res.status(401).json({ message: 'invalid' })
        }
        const validation = await bcrypt.compare(password, user.password)
        if (!validation) {
            return res.status(401).json({ message: 'invalid' })
        }
        const token = jwt.sign({userid: user._id}, jwtSecret)
        res.cookie('token', token, { httpOnly: true})

        res.redirect('admin/dashboard')
    } catch (error) {
        console.log(error)
    }
})

//Dashboard - Get Route
router.get('/admin/dashboard',authMiddleware, async (req, res) => {
    try {
        const data = await Post.find()
        res.render('admin/dashboard', {layout: adminLayout, data})
    } catch (error) {

    }

})
