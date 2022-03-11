const db = require('../db/connection');
const articles = require('../db/data/test-data/articles');
const comments = require('../db/data/test-data/comments');

const { checkExists } = require('../db/helpers/utils');

exports.fetchTopics = () => {
  return db.query('SELECT * FROM topics;').then((topics) => {
    return topics.rows;
  });
};

exports.fetchArticle = (article_id) => {
  return db
    .query(
      'SELECT articles.*, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;',
      [article_id]
    )
    .then((article) => {
      if (article.rows.length === 0) {
        return Promise.reject({ status: 404, msg: 'article does not exist' });
      }
      return article.rows[0];
    });
};

exports.fetchUsers = () => {
  return db.query('SELECT * FROM users;').then((users) => {
    return users.rows;
  });
};

exports.fetchAllArticles = (sort_by = 'created_at', order = 'desc', topic) => {
  if (
    !['title', 'topic', 'author', 'created_at', 'votes', 'article_id'].includes(
      sort_by
    )
  ) {
    return Promise.reject({ status: 400, msg: 'bad request' });
  }
  if (!['asc', 'desc'].includes(order)) {
    return Promise.reject({ status: 400, msg: 'bad request' });
  }

  let queryString = `SELECT title,topic,author,created_at,votes,article_id FROM articles `;

  const queryValues = [];
  if (topic) {
    queryValues.push(topic);
    queryString += `WHERE topic = $1 `;
  }

  queryString += `ORDER BY ${sort_by} ${order};`;

  return db.query(queryString, queryValues).then((articles) => {
    const topic = articles.rows[0];
    if (!topic) {
      return Promise.reject({ status: 404, msg: "topic doesn't exist" });
    }
    return articles.rows;
  });
};

exports.patchArticleVotes = (article_id, votesToIncrementBy) => {
  const votes = votesToIncrementBy.inc_votes;
  if (typeof votes !== 'number') {
    return Promise.reject({ status: 400, msg: 'bad request' });
  }
  return db
    .query(
      'UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;',
      [votes, article_id]
    )
    .then((article) => {
      if (article.rows.length === 0) {
        return Promise.reject({ status: 404, msg: 'article does not exist' });
      }
      return article.rows[0];
    });
};

exports.insertComment = (article_id, requestBody) => {
  const username = requestBody.username;
  const body = requestBody.body;
  return Promise.all([
    db.query(
      'INSERT INTO comments (author,body,votes,article_id) VALUES($1,$2,$3,$4) RETURNING *;',
      [username, body, 0, article_id]
    ),
    checkExists('articles', 'article_id', article_id),
  ]).then((comment) => {
    return comment[0].rows[0];
  });
};

exports.fetchArticleComments = (article_id) => {
  return Promise.all([
    db.query(
      'SELECT comment_id,votes,created_at,author,body FROM comments WHERE article_id = $1 ORDER BY created_at DESC;',
      [article_id]
    ),
    checkExists('articles', 'article_id', article_id),
  ]).then((comments) => {
    return comments[0].rows;
  });
};

exports.removeComment = (comment_id) => {
  return Promise.all([
    checkExists('comments', 'comment_id', comment_id),
    db.query('DELETE FROM comments WHERE comment_id = $1;', [comment_id]),
  ]);
};
