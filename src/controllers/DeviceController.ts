import { NextFunction, Request, Response } from "express";
import { Controller } from "./Controller";
import { MqttSingleton } from "../services/MqttSingleton";

export class DeviceController extends Controller {
  private mqttSingleton: MqttSingleton;
  constructor() {
    super()
    this.mqttSingleton = MqttSingleton.getInstance();
  }

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { data, error, status } = await this.supabase.from('devices')
        .select()
        .order('name');

      if (error) return this.throwCustomError(error.message, status);

      return res.status(200).json({
        status: true,
        message: 'devices listed successfully',
        results: data,
      })
    } catch (error) {
      next(error); 
    }
  }

  add = async (req: Request, res: Response, next: NextFunction) => {
    const { id, name, url, token } = req.body;

    try {
      const { data, error, status } = await this.supabase.from('devices')
        .insert({ id, name, url, token });

      if (error) return this.throwCustomError(error.message, status);

      this.mqttSingleton.subscribeAll();

      return res.status(201).json({
        status: true,
        message: 'device added successfully',
        results: data,
      })
    } catch (error) {
      next(error);
    }
  }

  remove = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      const { data } = await this.supabase.from('devices')
        .select()
        .eq('id', id)
        .limit(1)
        .single();

      if (!data) throw this.throwCustomError('device not found for deletion', 404);

      const { error, status } = await this.supabase.from('devices')
        .delete()
        .eq('id', id);

      if (error) return this.throwCustomError(error.message, status);

      this.mqttSingleton.subscribeAll();

      return res.status(204).json({
        status: true,
        message: 'device removed successfully',
      })
    } catch (error) {
      next(error);
    }
  }
}
