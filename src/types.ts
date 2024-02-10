import {WriteOptions, WritePrecisionType} from "@influxdata/influxdb-client";

export interface InfluxDBTransportConfig {
    url: string;
    org: string;
    bucket: string;
    token: string;
    precision?: WritePrecisionType;
    writeOptions?: Partial<WriteOptions>;
    measurement?: string;
    tags?: Record<string, string>;
}