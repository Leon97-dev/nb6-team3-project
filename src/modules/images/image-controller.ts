import { Request, Response } from "express";
import { imageService } from "./image-service";

class ImageController {
  async uploadImage(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const imageUrl = await imageService.saveImage(req.file);

      res.status(201).json({ imageUrl });
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error });
    }
  }
}

export const imageController = new ImageController();   