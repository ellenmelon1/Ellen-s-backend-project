const cors = require('cors');

const express = require('express');
const {
  getTopics,
  getArticle,
  getUsers,
  getComment,
  getAllArticles,
  updateVotes,
  updateCommentVotes,
  getArticleComments,
  postComment,
  deleteComment,
  getJSON,
} = require('./controllers/controllers');
const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require('./Errors/index');

const app = express();
app.use(express.json());
app.use(cors());

app.get('/api', getJSON);
app.get('/api/topics', getTopics);
app.get('/api/articles/:article_id', getArticle);
app.get('/api/users', getUsers);
app.get('/api/articles', getAllArticles);
app.get('/api/articles/:article_id/comments', getArticleComments);
app.get('/api/comments/:comment_id', getComment);

app.patch('/api/articles/:article_id', updateVotes);
app.patch('/api/comments/:comment_id', updateCommentVotes);
app.post('/api/articles/:article_id/comments', postComment);
app.delete('/api/comments/:comment_id', deleteComment);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

app.all('*', (req, res) => {
  res.status(404).send({ msg: 'path not found' });
});

module.exports = app;
