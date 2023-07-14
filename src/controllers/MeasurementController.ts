import { NextFunction, Request, Response } from "express";
import { Controller } from "./Controller";

export class MeasurementController extends Controller {
  constructor() {
    super()
  }

  add = async (req: Request, res: Response, next: NextFunction) => {
    const { ppm, temperature, source, deviceId } = req.body;

    try {
      const { data, error } = await this.supabase.from('measurements')
        .insert({ ppm, temperature, source, deviceId });

      return res.status(201).json({
        status: true,
        message: 'measurement added successfully',
        results: data,
      })
    } catch (error) {
      next(error);
    }
  }
}
