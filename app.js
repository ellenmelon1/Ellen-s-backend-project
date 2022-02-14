const express = require("express");
const app = express();
const { getTopics } = require("./controllers/controllers");

app.get("/api/topics", getTopics);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "path not found" });
});

module.exports = app;
