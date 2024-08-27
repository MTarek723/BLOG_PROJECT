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
