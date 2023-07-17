import * as mqtt from "mqtt";

export class MqttService {
  mqttClient: mqtt.MqttClient;
  constructor(host: string) {
    this.mqttClient = mqtt.connect(host);

    this.mqttClient.on('error', (error) => {
      console.log(error);
      this.mqttClient.end();
    })

    this.mqttClient.on('connect', () => {
      console.log('mqtt client connected');
    })
  }

  addSubscriber(topic: string) {
    this.mqttClient.subscribe(topic)
  }

  setOnMessage(callback: Function) {
    this.mqttClient.on('message', (topic, message) => {
      callback(topic, message);
    })
  }

  sendMessage(topic: string, message: string) {
    this.mqttClient.publish(topic, message);
  }
}
