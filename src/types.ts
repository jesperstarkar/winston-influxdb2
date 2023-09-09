import {WriteOptions, WritePrecisionType} from "@influxdata/influxdb-client";

export interface Config {
    url: string;
    org: string;
    bucket: string;
    token: string;
    precision?: WritePrecisionType;
    writeOptions?: Partial<WriteOptions>;
    level?: string;
    appName?: string;
    version?: string;
    hostname?: string;
    measurement?: string;
}