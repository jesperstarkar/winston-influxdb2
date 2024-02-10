import Transport from "winston-transport";
import {
  InfluxDB,
  Point,
  WriteApi,
  WriteOptions,
  WritePrecisionType,
} from "@influxdata/influxdb-client";

export class InfluxDB2Transport extends Transport {
  private readonly writeApi: WriteApi;
  private readonly measurement: string;
  private readonly tags: Object;

  constructor(
    level: string,
    url: string,
    token: string,
    org: string,
    bucket: string,
    measurement: string,
    precision: WritePrecisionType,
    writeOptions?: WriteOptions,
    tags?: Object,
  ) {
    super();
    this.level = level;
    this.measurement = measurement;
    this.tags = tags || {};

    try {
      this.writeApi = new InfluxDB({ url, token }).getWriteApi(
        org,
        bucket,
        precision,
        writeOptions,
      );
    } catch (e) {
      console.error("Error in InfluxDB2Transport constructor.");
      throw e;
    }
  }

  log(info: any, callback: () => void): any {
    setImmediate(() => {
      this.emit("logged", info);
    });

    const point = new Point(this.measurement)
      .intField(
        "timestamp",
        new Date(Date.parse(info.timestamp)).getTime() * 1000000,
      )
      .stringField("message", info.message);

    // Add init tags to the point
    Object.keys(this.tags).forEach((key) => {
      point.tag(key, info[key]);
    });

    // Add log message tags to the point
    Object.keys(info).forEach((key) => {
      if (!["message", "timestamp"].includes(key)) {
        point.tag(key, info[key]);
      }
    });

    this.writeApi.writePoint(point);

    callback();
  }
}
