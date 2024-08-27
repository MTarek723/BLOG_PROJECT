const express = require('express')
const router = express.Router()
const Post = require("../models/post")
const User = require("../models/user")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const jwtSecret = process.env.JWT_SECRET

const adminLayout = "../views/layouts/admin"
