import { NextFunction, Request, Response } from "express";
import { MqttSingleton } from "../services/MqttSingleton";
import { Controller } from "./Controller";
import axios from "axios";

export class ActionController extends Controller {
  private mqttSingleton: MqttSingleton;
  constructor() {
    super();
    this.mqttSingleton = MqttSingleton.getInstance();
  }

  openValve = async (req: Request, res: Response ,next: NextFunction) => {
    const { id, flow } = req.params;

    try {
      const { data } = await this.supabase.from('devices')
        .select()
        .eq('id', id)
        .limit(1)
        .single();

      if (!data) throw new Error('not found');

      if (process.env.MODE === 'thinger') {
        await this.sendByThinger(data.url ?? '', data.token ?? '', flow);

        return res.status(200).json({
          status: true,
          message: 'open valve command sent successfully by thinger',
          results: data.id,
        })
      }

      this.sendByMqtt(id, flow);

      return res.status(200).json({
        status: true,
        message: 'open valve command sent successfully by mqtt',
        results: data.id,
      })
      
    } catch (error) {
      next(error);
    }
  }

  private sendByMqtt = (id: string, flow: string) => {
    this.mqttSingleton.mqttClient.sendMessage(`${id}/valve/${flow}`, '');
  }

  private sendByThinger = async (url: string, token: string, flow: string) => {
    if (url === '' || token === '') {
      throw new Error('not providing url or token for thinger');
    }

    await axios.post(`${url}/valve`, flow, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
  }
}
