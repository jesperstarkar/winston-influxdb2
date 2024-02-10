import Transport from 'winston-transport';
import {
  InfluxDB,
  Point,
  WriteApi,
} from '@influxdata/influxdb-client';
import { InfluxDBTransportConfig } from "./types";

export class InfluxDBTransport extends Transport {
  private readonly writeApi: WriteApi;
  private readonly measurement: string;
  private readonly tags: Record<string, string>;

  constructor({url, token, org, bucket, precision, writeOptions, tags }: InfluxDBTransportConfig) {
    super();
    this.measurement = tags?.measurement || 'logs';
    this.tags = tags || {};

    try {
      this.writeApi = new InfluxDB({ url, token }).getWriteApi(
        org,
        bucket,
        precision,
        writeOptions
      );
    } catch (e) {
      console.error('Error in InfluxDBTransport constructor.');
      throw e;
    }
  }

  log(info: any, callback: () => void): any {
    setImmediate(() => {
      this.emit('logged', info);
    });

    const point = new Point(this.measurement)
      .stringField('message', info.message)
      .intField(
        'timestamp',
          new Date(Date.parse(info.timestamp)).getTime() * 1000000
      )

    // Add init tags to the point
    Object.keys(this.tags).forEach((key) => {
        point.tag(key, info[key]);
    });

    // Add log message tags to the point
    Object.keys(info).forEach((key) => {
        if (!['message', 'timestamp'].includes(key)) {
            point.tag(key, info[key]);
        }
    });

    this.writeApi.writePoint(point);

    callback();
  }
}
