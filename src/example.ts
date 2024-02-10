import * as winston from "winston";
import { InfluxDB2Transport } from "./InfluxDB2Transport";

const logger = winston.createLogger({
  transports: [
    new InfluxDB2Transport(
      "debug", // min log level to send to influxdb
      "http://localhost:8086", // influxdbv2 url
      "i-should-not-commit-my-token", // influxdbv2 token
      "org1", // influxdbv2 organization
      "bucket1", // influxdbv2 bucket
      "my-measurement", // influxdbv2 measurement
      { flushInterval: 10000 }, // influxdbv2 write options
      "s",
      {
        tag1: "value1",
        tag2: "value2",
      },
    ),
  ],
});

logger.info("Hello world!");

let counter = 0;
setInterval(() => {
  logger.info(`Hello world! no. ${counter++}`);
}, 10000);
