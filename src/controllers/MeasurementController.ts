import { NextFunction, Request, Response } from "express";
import { Controller } from "./Controller";
import { sub } from "date-fns";

type Procedure = "get_daily_sample" | "get_weekly_sample";

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
    const { period } = req.query;

    
    try {
      const PERIOD_OPTIONS: Record<string, Procedure> = {
        '1d': 'get_daily_sample',
        '1w': 'get_weekly_sample',
      }
      if (period) {
        if (!PERIOD_OPTIONS[period.toString()]) {
          throw new Error('invalid time value');
        }

        const { data, error } = await this.listAverageByPeriod(
          id,
          PERIOD_OPTIONS[period.toString()]
        );

        const periodMessage = period === '1d' ? 'daily' : 'weekly'
        return res.status(200).json({
          status: true,
          message: `measurement sampled ${periodMessage} listed successfully
          
          `,
          results: data,
        })
      }

      const { data, error } = await this.listLatest30Min(id);

      return res.status(200).json({
        status: true,
        message: 'measurement for last 30 minute listed successfully',
        results: data,
      })
    } catch (error) {
      next(error);
    }
  }

  private listLatest30Min = async (deviceId: string) => {
    return await this.supabase.from('measurements')
      .select()
      .eq('deviceId', deviceId)
      .gte('createdAt', sub(new Date(), { minutes: 30 }).toISOString())
      .order('createdAt');
  }

  private listAverageByPeriod = async (
    deviceId: string,
    procedure: Procedure
  ) => {
    return await this.supabase.rpc(procedure, {
      p_deviceid: deviceId,
    });
  }
}
