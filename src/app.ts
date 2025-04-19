import express from "express";
import sequelize from "./config/database";

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
    this.database();
  }

  private config(): void {
    this.app.use(express.json());
  }

  private async database(): Promise<void> {
    try {
      await sequelize.authenticate();
      await sequelize.sync({ force: false });
      console.log("Database inventory_db connected successfully");
    } catch (error) {
      console.error("Database connection error:", error);
    }
  }
}

export default new App().app;
