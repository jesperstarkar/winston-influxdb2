import {WriteOptions, WritePrecisionType} from "@influxdata/influxdb-client";

export interface InfluxDBTransportConfig {
    level: string,
    url: string;
    org: string;
    bucket: string;
    token: string;
    measurement: string;
    precision?: WritePrecisionType;
    writeOptions?: Partial<WriteOptions>;
    tags?: Record<string, string>;
}