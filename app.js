const express = require("express");
const {
  getTopics,
  getArticle,
  getUsers,
  getAllArticles,
} = require("./controllers/controllers");
const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require("./Errors/index");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticle);
app.get("/api/users", getUsers);
app.get("/api/articles", getAllArticles);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "path not found" });
});

module.exports = app;
