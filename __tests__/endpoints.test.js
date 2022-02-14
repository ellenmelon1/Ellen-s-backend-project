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
        .then((topics) => {
          expect(topics.body).toHaveLength(3);
          expect(Array.isArray(topics.body));
        });
    });
    it("each object in the returned array contains the properties 'slug' and 'description'", () => {
      return request(app)
        .get("/api/topics")
        .then(({ body }) => {
          body.forEach((topic) => {
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
});
