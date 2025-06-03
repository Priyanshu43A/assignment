import request from "supertest";
import mongoose from "mongoose";
import { app } from "../index.js";

describe("Server Tests", () => {
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(
      process.env.MONGODB_URI_TEST || process.env.MONGODB_URI
    );
  });

  afterAll(async () => {
    // Close database connection
    await mongoose.connection.close();
  });

  describe("Health Check Endpoint", () => {
    it("should return 200 and status ok", async () => {
      const response = await request(app).get("/health");
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ status: "ok" });
    });
  });

  describe("404 Handler", () => {
    it("should return 404 for non-existent routes", async () => {
      const response = await request(app).get("/non-existent-route");
      expect(response.status).toBe(404);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.status).toBe(404);
    });
  });
});
