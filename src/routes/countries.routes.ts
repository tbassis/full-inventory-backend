import { Router } from "express";
import CountriesController from "../controllers/countries.controller";

const router = Router();

router.get("/", CountriesController.getAll);
router.get("/search", CountriesController.searchByName);
router.get("/:id", CountriesController.getById); // Dinamic rouste must always come after specific routs

router.post("/", CountriesController.create);

router.put("/:id", CountriesController.update);

export default router;
