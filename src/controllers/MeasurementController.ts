import { NextFunction, Request, Response } from "express";
import { Controller } from "./Controller";
import { sub } from "date-fns";

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

  listByPeriod = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      const { data, error } = await this.supabase.from('measurements')
        .select()
        .eq('deviceId', id)
        .gte('createdAt', sub(new Date(), { minutes: 30 }).toISOString())
        .order('createdAt');

      return res.status(200).json({
        status: true,
        message: 'measurement listed successfully',
        results: data,
      })
    } catch (error) {
      next(error);
    }
  }
}
