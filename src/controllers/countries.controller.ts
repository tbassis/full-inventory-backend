import { Request, Response } from "express";
import { ValidationError, Op } from "sequelize";

import sequelize from "../config/database";
import Country from "../models/country.model";

class CountriesController {
  public async getAll(req: Request, res: Response): Promise<void> {
    try {
      const countries = await Country.findAll();
      res.json(countries);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  public async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const country = await Country.findByPk(id);

      if (!country) {
        res.status(404).json({ error: "Country not found" });
        return;
      }

      res.json(country);
    } catch (error) {
      console.error("GET by ID Error:", error);
      res.status(500).json({
        error: "Failed to fetch country",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  public async searchByName(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.query;

      // Query validation
      if (!name || typeof name !== "string") {
        res.status(400).json({ error: "Name query parameter is required" });
        return;
      }

      // Removes the leading and trailing white space and line terminator characters from name
      const sanitizedName: string = name.trim();

      if (sanitizedName.length < 3) {
        res.status(400).json({ error: "Name must be at least 3 characters" });
        return;
      }

      const countries = await Country.findAll({
        where: {
          name: {
            [Op.iLike]: `%${sanitizedName}%`, // Busca parcial case-insensitive
          },
        },
      });

      if (countries.length === 0) {
        res.status(404).json({ error: "No countries found" });
        return;
      }

      res.json(countries);
    } catch (error) {
      console.error("Search Error:", error);
      res.status(500).json({
        error: "Failed to search countries",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  public async create(req: Request, res: Response): Promise<void> {
    try {
      const country = await Country.create(req.body);
      res.status(201).json(country);
    } catch (error) {
      res.status(400).json({ error: "Bad request" });
    }
  }

  public async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name } = req.body;

      // Validation for coutry name
      if (!name || name.trim().length < 3) {
        res.status(400).json({ error: "Name must be at least 3 characters" });
        return;
      }

      const country = await Country.findByPk(id);
      if (!country) {
        res.status(404).json({ error: "Country not found" });
        return;
      }

      // Update with transaction make the updat atomic and revert if an error occur
      await sequelize.transaction(async (t) => {
        await country.update({ name }, { transaction: t });
      });

      // Response with country updated
      res.json(country);
    } catch (error) {
      console.error("PUT Error:", error);

      // Trata erros de validação do Sequelize
      if (error instanceof ValidationError) {
        res.status(400).json({
          error: "Validation error",
          details: error.errors.map((e) => e.message),
        });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }
}

export default new CountriesController();
