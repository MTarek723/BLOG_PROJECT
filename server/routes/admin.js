const express = require('express')
const router = express.Router()
const Post = require("../models/post")
const User = require("../models/user")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const jwtSecret = process.env.JWT_SECRET

const adminLayout = "../views/layouts/admin"

const authMiddleware = (req, res, next ) => {
    const token = req.cookies.token;
    if(!token) {
      return res.status(401).json( { message: 'Unauthorized'} );
    }

    try {
      const decoded = jwt.verify(token, jwtSecret);
      req.userId = decoded.userId;
      next();
    } catch(error) {
      res.status(401).json( { message: 'Unauthorized'} );
    }
  }

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

//Add Post - Get Route
router.get('/add-post', authMiddleware, async (req, res) => {
    try {
      const locals = {
        title: 'Add Post',
        description: 'Simple Blog created with NodeJs, Express & MongoDb.'
      }

      const data = await Post.find();
      res.render('admin/add-post', {
        locals,
        layout: adminLayout
      });

    } catch (error) {
      console.log(error);
    }

  });

//Add Post - Post Route
router.post('/add-post', authMiddleware, async (req, res) => {
    try {
      try {
        const newPost = new Post({
          title: req.body.title,
          body: req.body.body
        });

        await Post.create(newPost);
        res.redirect('/admin/dashboard');
      } catch (error) {
        console.log(error);
      }

    } catch (error) {
      console.log(error);
    }
  });

//Edit Post - Get Route
router.get('/edit-post/:id', authMiddleware, async (req, res) => {
    try {

      const locals = {
        title: "Edit Post",
        description: "Free NodeJs User Management System",
      };

      const data = await Post.findOne({ _id: req.params.id });

      res.render('admin/edit-post', {
        locals,
        data,
        layout: adminLayout
      })

    } catch (error) {
      console.log(error);
    }

  });

//Edit Post - Put Route
router.put('/edit-post/:id', authMiddleware, async (req, res) => {
    try {

      await Post.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        body: req.body.body,
        updatedAt: Date.now()
      });

      res.redirect(`/admin/dashboard`);

    } catch (error) {
      console.log(error);
    }

  });

//Delete post - Delete Route
router.delete('/delete-post/:id', authMiddleware, async (req, res) => {

    try {
      await Post.deleteOne( { _id: req.params.id } );
      res.redirect('/admin/dashboard');
    } catch (error) {
      console.log(error);
    }

  });

//Logout - Get Route
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    //res.json({ message: 'Logout successful.'});
    res.redirect('/');
  });


module.exports = router
