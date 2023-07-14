import { NextFunction, Request, Response } from "express";
import { Controller } from "./Controller";

export class DeviceController extends Controller {
  constructor() {
    super()
  }

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { data, error } = await this.supabase.from('devices')
        .select()
        .order('name');

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
      const { data, error } = await this.supabase.from('devices')
        .insert({ id, name, url, token });

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
      const { error } = await this.supabase.from('devices')
        .delete()
        .eq('id', id);

      return res.status(204).json({
        status: true,
        message: 'device removed successfully',
      })
    } catch (error) {
      next(error);
    }
  }
}
