const db = require("../db/connection");
const articles = require("../db/data/test-data/articles");

exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics;").then((topics) => {
    return topics.rows;
  });
};

exports.fetchArticle = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then((article) => {
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
