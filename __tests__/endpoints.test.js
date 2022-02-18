const request = require("supertest");
const db = require("../db/connection");
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed.js");
const app = require("../app");

beforeEach(() => seed(testData));

afterAll(() => {
  return db.end();
});

describe("GET requests", () => {
  describe("/api/topics", () => {
    it("responds with an array of objects of the correct length", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((response) => {
          expect(response.body.topics).toHaveLength(3);
          expect(Array.isArray(response.body.topics));
        });
    });
    it("each object in the returned array contains the properties 'slug' and 'description'", () => {
      return request(app)
        .get("/api/topics")
        .then(({ body: { topics } }) => {
          topics.forEach((topic) => {
            expect(topic).toEqual(
              expect.objectContaining({
                slug: expect.any(String),
                description: expect.any(String),
              })
            );
          });
        });
    });
    it("responds with '404 - path not found' when an incorrect file path is requested", () => {
      return request(app)
        .get("/api/bad-path")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("path not found");
        });
    });
  });
  describe("/api/articles/:article_id", () => {
    it("responds with a single article object", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then((response) => {
          expect(typeof response.body.article).toBe("object");
        });
    });
    it("the returned object contains the correct properties", () => {
      const article_id = 1;
      return request(app)
        .get(`/api/articles/${article_id}`)
        .then(({ body }) => {
          expect(body.article).toEqual(
            expect.objectContaining({
              author: "butter_bridge",
              title: "Living in the shadow of a great man",
              article_id: 1,
              body: "I find this existence challenging",
              topic: "mitch",
              created_at: "2020-07-09T20:11:00.000Z",
              votes: 100,
            })
          );
        });
    });
    it("the article response object includes a comment_count property, containing the total number of comments with the article_id", () => {
      return request(app)
        .get("/api/articles/1")
        .then(({ body }) => {
          expect(body.article.comment_count).toBe("11");
        });
    });
    it("comment_count property in the returned object is 0, when no comments are associated with the article", () => {
      return request(app)
        .get("/api/articles/2")
        .expect(200)
        .then(({ body }) => {
          expect(body.article.comment_count).toBe("0");
        });
    });
    it("returns '400 - bad request' when invalid id given", () => {
      return request(app)
        .get("/api/articles/invalid_id")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("bad request");
        });
    });
    it("returns '404 - article does not exist' when given a valid but non-existent id", () => {
      return request(app)
        .get("/api/articles/99")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("article does not exist");
        });
    });
  });
  describe("/api/users", () => {
    it("returns an array of objects of the expected length", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then((response) => {
          expect(response.body.users.length).toBe(4);
        });
    });
    it("each returned object containins a 'username' property", () => {
      return request(app)
        .get("/api/users")
        .then((response) => {
          expect(
            response.body.users.forEach((user) => {
              expect(user).toHaveProperty("username");
            })
          );
        });
    });
  });
  describe("/api/articles", () => {
    it("responds with an array of article objects of the correct length", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
          expect(response.body.articles.length).toBe(12);
        });
    });
    it("each object contains the expected properties", () => {
      return request(app)
        .get("/api/articles")
        .then((response) => {
          expect(
            response.body.articles.forEach((article) => {
              expect(article).toEqual(
                expect.objectContaining({
                  title: expect.any(String),
                  topic: expect.any(String),
                  author: expect.any(String),
                  created_at: expect.any(String),
                  votes: expect.any(Number),
                  article_id: expect.any(Number),
                })
              );
            })
          );
        });
    });
    it("articles are sorted by date in descending order as default", () => {
      return request(app)
        .get("/api/articles")
        .then((response) => {
          expect(response.body.articles).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
    it("articles can be sorted by a valid column, default descending order", () => {
      return request(app)
        .get("/api/articles?sort_by=votes")
        .expect(200)
        .then((response) => {
          expect(response.body.articles).toBeSortedBy("votes", {
            descending: true,
          });
        });
    });
    it("articles can be sorted by a valid column in ascending order if specified", () => {
      return request(app)
        .get("/api/articles?sort_by=topic&order=asc")
        .expect(200)
        .then((response) => {
          expect(response.body.articles).toBeSortedBy("topic");
        });
    });
    it("returns '400 - bad request' if sort_by query is invalid", () => {
      return request(app)
        .get("/api/articles?sort_by=invalidInput")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("bad request");
        });
    });
    it("returns '400 - bad request' if order query is invalid", () => {
      return request(app)
        .get("/api/articles?sort_by=topic&order=invalidInput")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("bad request");
        });
    });
    it("filters articles by the topic requested in the query", () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then((response) => {
          expect(
            response.body.articles.forEach((article) => {
              expect(article).toEqual(
                expect.objectContaining({
                  topic: "mitch",
                })
              );
            })
          );
        });
    });
    it("returns '404 - topic doesn't exist' when given an invalid topic query", () => {
      return request(app)
        .get("/api/articles?topic=invalidTopic")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("topic doesn't exist");
        });
    });
  });
  describe("/api/articles/:article_id/comments", () => {
    it("returns an array of the expected length", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then((response) => {
          expect(response.body.comments).toHaveLength(11);
        });
    });
    it("returned objects each contain the expected properties", () => {
      const article_id = 1;
      return request(app)
        .get(`/api/articles/${article_id}/comments`)
        .then((response) => {
          expect(
            response.body.comments.forEach((comment) => {
              expect(comment).toEqual(
                expect.objectContaining({
                  comment_id: expect.any(Number),
                  votes: expect.any(Number),
                  created_at: expect.any(String),
                  author: expect.any(String),
                  body: expect.any(String),
                })
              );
            })
          );
        });
    });
  });
  it("returns 200 and an empty array when a valid article_id requested but no associated comments found", () => {
    return request(app)
      .get("/api/articles/4/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.comments).toHaveLength(0);
      });
  });
  it(`responds\'404 - article does not exist\' when given a valid but non-existent id`, () => {
    return request(app)
      .get("/api/articles/99/comments")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("article does not exist");
      });
  });
});

describe("PATCH requests", () => {
  describe("/api/articles/:article_id", () => {
    it("responds with the updated article", () => {
      const updateVotes = { inc_votes: 1 };
      return request(app)
        .patch("/api/articles/1")
        .send(updateVotes)
        .expect(200)
        .then((response) => {
          expect(response.body.article).toEqual({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 101,
          });
        });
    });
    it("increments or decrements votes by the appropriate amount", () => {
      const updateVotes = { inc_votes: -100 };
      return request(app)
        .patch("/api/articles/1")
        .send(updateVotes)
        .then((response) => {
          expect(response.body.article.votes).toBe(0);
        });
    });
    it("responds with '404 - article doesn't exist', when article doesn't exist", () => {
      return request(app)
        .patch("/api/articles/99")
        .send({ inc_votes: 1 })
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("article does not exist");
        });
    });
    it("responds with '400 - bad request', when invalid article_id given", () => {
      return request(app)
        .patch("/api/articles/invalid-id")
        .send({ inc_votes: 1 })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("bad request");
        });
    });
    it("responds with '400 - bad request', when the request body is missing the required fields", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({})
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("bad request");
        });
    });
  });
});
