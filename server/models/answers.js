// Answer Document Schema
const mongoose = require('mongoose')
const Comment = require('./comments.js')

const Schema = mongoose.Schema

const answerSchema = new Schema({
  text: {
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ans_by: {
    type: String,
    required: true
  },
  ans_date_time: {
    type: Date,
    default: Date.now
  },
  comments: {
    type: [Comment.schema]
  },
  votes: {
    type: Number,
    default: 0
  }
})

answerSchema.virtual('url').get(function () {
  return `posts/answer/${this._id}`
})

module.exports = mongoose.model('Answer', answerSchema)
