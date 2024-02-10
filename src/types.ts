import {WriteOptions, WritePrecisionType} from "@influxdata/influxdb-client";

export interface InfluxDB2TransportConfig {
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