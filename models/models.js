const db = require("../db/connection");
const articles = require("../db/data/test-data/articles");
const comments = require("../db/data/test-data/comments");

const { checkExists } = require("../db/helpers/utils");

exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics;").then((topics) => {
    return topics.rows;
  });
};

exports.fetchArticle = (article_id) => {
  return db
    .query(
      "SELECT articles.*, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;",
      [article_id]
    )
    .then((article) => {
      console.log("inside the model:", article);
      if (article.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "article does not exist" });
      }
      return article.rows[0];
    });
};

exports.fetchUsers = () => {
  return db.query("SELECT * FROM users;").then((users) => {
    return users.rows;
  });
};

exports.fetchAllArticles = () => {
  return db
    .query(
      "SELECT title,topic,author,created_at,votes,article_id FROM articles ORDER BY created_at DESC;"
    )
    .then((articles) => {
      return articles.rows;
    });
};

exports.patchArticleVotes = (article_id, votesToIncrementBy) => {
  const votes = votesToIncrementBy.inc_votes;
  if (typeof votes !== "number") {
    return Promise.reject({ status: 400, msg: "bad request" });
  }
  return db
    .query(
      "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;",
      [votes, article_id]
    )
    .then((article) => {
      if (article.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "article does not exist" });
      }
      return article.rows[0];
    });
};

exports.fetchArticleComments = (article_id) => {
  return Promise.all([
    db.query(
      "SELECT comment_id,votes,created_at,author,body FROM comments WHERE article_id = $1;",
      [article_id]
    ),
    checkExists("articles", "article_id", article_id),
  ]).then((comments) => {
    console.log("returned from the query in the model: ", comments);
    return comments[0].rows;
  });
};
