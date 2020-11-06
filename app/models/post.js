const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
  content: {
    type: String,
    required: true,
    maxlength: 512
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Post', postSchema)