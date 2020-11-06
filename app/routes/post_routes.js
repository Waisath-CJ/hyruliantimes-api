const express = require('express')
const passport = require('passport')

const Post = require('../models/post')

const router = express.Router()
const requiresToken = passport.authenticate('bearer', {session: false})
const {BadCredentialsError, BadParamsError, handle404, requireOwnership} = require('../../lib/custom_errors')

// CREATE
// Create a Post
router.post('/posts', requiresToken, (req, res, next) => {
  const postInfo = req.body.post
  postInfo.owner = req.user.id

  Post.create(postInfo)
    .then(post => res.status(201).json(post))
    .catch(next)
})

module.exports = router