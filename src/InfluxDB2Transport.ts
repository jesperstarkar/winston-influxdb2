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
  private readonly globalTags?: Record<string, string>;

  /**
   * Constructor
   * @param level - minimum log level to send to InfluxDB
   * @param url - InfluxDB2 url
   * @param token - InfluxDB2 token
   * @param org - InfluxDB2 organization
   * @param bucket - InfluxDB2 bucket
   * @param measurement - InfluxDB2 measurement (it will be created if not exists)
   * @param writeOptions - [optional] InfluxDB2 write options
   * @param precision - [optional] InfluxDB2 write precision
   * @param globalTags - [optional] global tags to add to every log message
   */
  constructor(
    level: string,
    url: string,
    token: string,
    org: string,
    bucket: string,
    measurement: string,
    writeOptions?: Partial<WriteOptions>,
    precision?: WritePrecisionType,
    globalTags?: Record<string, string>,
  ) {
    super();

    this.level = level;
    this.measurement = measurement;
    this.globalTags = globalTags;

    this.writeApi = new InfluxDB({ url, token }).getWriteApi(
      org,
      bucket,
      precision,
      writeOptions,
    );

    if (level === "debug") {
      this.log(
        { message: "InfluxDB2Transport initialized.", level: "debug" },
        () => {},
      );
      this.writeApi.flush();
    }
  }

  log(info: any, callback: () => void): any {
    setImmediate(() => {
      this.emit("logged", info);
    });

    const point = new Point(this.measurement).stringField(
      "message",
      info.message,
    );

    // Add global globalTags
    if (this.globalTags) {
      Object.keys(this.globalTags).forEach((key) => {
        point.tag(key, this.globalTags ? this.globalTags[key] : "");
      });
    }

    // Add message globalTags
    Object.keys(info).forEach((key) => {
      if (!["message"].includes(key)) {
        point.tag(key, info[key]);
      }
    });

    this.writeApi.writePoint(point);

    callback();
  }
}
