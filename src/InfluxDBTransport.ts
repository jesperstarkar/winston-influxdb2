import Transport from 'winston-transport';
import {
  InfluxDB,
  Point,
  WriteApi,
} from '@influxdata/influxdb-client';
import { Config } from "./types";
import * as os from 'os';

export class InfluxDBTransport extends Transport {
  private readonly writeApi: WriteApi;
  private readonly appName: string;
  private readonly version: string;
  private readonly hostname: string;
  private readonly measurement: string;

  constructor({url, token, org, bucket, precision, writeOptions, level, appName, measurement, version, hostname, }: Config) {
    super();

    this.level = level;
    this.appName = appName || process.env.npm_package_name || 'unknown';
    this.version = version || process.env.npm_package_version || 'v0.0.0';
    this.hostname = hostname || os.hostname();
    this.measurement = measurement || `${this.appName}_logs`;

    try {
      this.writeApi = new InfluxDB({ url, token }).getWriteApi(
        org,
        bucket,
        precision,
        writeOptions
      );
    } catch (e) {
      console.error('Error in InfluxDBTransport constructor:');
      console.error(e)
      throw e;
    }
  }

  log(info: any, callback: () => void): any {
    setImmediate(() => {
      this.emit('logged', info);
    });

    const point = new Point(this.measurement)
      .tag('appname', this.appName)
      .tag('version', this.version)
      .tag('hostname', this.hostname)
      .tag('severity', info[Symbol.for('level')])
      .stringField('message', info.message)
      .intField(
        'timestamp',
          new Date(Date.parse(info.timestamp)).getTime() * 1000000
      )
      .intField('procid', process.pid);

    Object.keys(info).forEach((key) => {
        if (key !== 'message' && key !== 'timestamp' && key !== 'level') {
            point.tag(key, info[key]);
        }
    });

    this.writeApi.writePoint(point);

    callback();
  }
}
