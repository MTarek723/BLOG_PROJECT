const express = require('express')
const router = express.Router()
const Post = require("../models/post")

//Home Page - Get Route
router.get('', async (req, res) => {
    const locals = {
        title: "Home Page"
    }
    try {
        const data = await Post.find();
        res.render('index', { locals, data })
    } catch (error) {
        console.log(error)
    } 
})

//Post - Get Route
router.get('/post/:id', async (req, res)=> {
    try {
        
        const postid = req.params.id;
        const selectedpostid =  await Post.findById(postid)
        const locals = {
            title: selectedpostid.title
        }
         res.render('post', { selectedpostid, locals })
    } catch (error) {
        
    }
    
})
//Search Bar - Post Route
router.post('/search', async (req, res)=> {
    try {
        const searchTerm = req.body.searchTerm
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")
        const data = await Post.find({
            $or: [
              { title: { $regex: new RegExp(searchNoSpecialChar, 'i') }},
              { body: { $regex: new RegExp(searchNoSpecialChar, 'i') }}
            ]
          });
        res.render('search', {data})
    } catch (error) {
        
    }
    
})
 
//about - Get Route
router.get('/about', (req, res) => {
    res.render('about')
})

module.exports = router;
