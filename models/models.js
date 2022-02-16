const db = require("../db/connection");

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

exports.fetchAllArticles = () => {
  return db
    .query(
      "SELECT title,topic,author,created_at,votes,article_id FROM articles ORDER BY created_at DESC;"
    )
    .then((articles) => {
      return articles.rows;
    });
};
