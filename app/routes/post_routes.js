const express = require('express')
const passport = require('passport')

const Post = require('../models/post')

const router = express.Router()
const requiresToken = passport.authenticate('bearer', { session: false })
const { BadCredentialsError, BadParamsError, handle404, requireOwnership } = require('../../lib/custom_errors')

// CREATE
// Create a Post
router.post('/posts', requiresToken, (req, res, next) => {
  const postInfo = req.body.post
  postInfo.owner = req.user.id

  Post.create(postInfo)
    .then(post => res.status(201).json(post))
    .catch(next)
})

// INDEX
// Show all Posts
router.get('/posts', requiresToken, (req, res, next) => {
  Post.find()
    .populate('owner')
    .then(posts => {
      const postObj = {posts: []}
      posts.forEach(post => {
        postObj.posts.push({
          _id: post._id,
          content: post.content,
          owner: post.owner,
          createdAt: post.createdAt
        })
      })
      return postObj
    })
    .then(posts => res.json(posts))
    .catch(next)
})

// UPDATE
// Update a Post
router.patch('/posts/:post_id', requiresToken, (req, res, next) => {
  delete req.body.post.owner

  Post.findById(req.params.post_id)
    .then(handle404)
    .then(post => requireOwnership(req, post))
    .then(post => post.updateOne(req.body.post))
    .then(() => res.sendStatus(204))
    .catch(next)
})

// DELETE
// Delete a specific event
router.delete('/posts/:post_id', requiresToken, (req, res, next) => {
  Post.findById(req.params.post_id)
    .then(handle404)
    .then(post => requireOwnership(req, post))
    .then(post => post.deleteOne())
    .then(() => res.sendStatus(204))
    .catch(next)
})

module.exports = router