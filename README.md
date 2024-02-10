# InfluxDBv2 transport for Winston

This module allows you to log [Winston](https://github.com/winstonjs/winston) messages to [InfluxDBv2](https://docs.influxdata.com/influxdb/v2/).

## Installation

```bash
npm install winston-influxdb2
```

## Usage

```js
winston.createLogger({
    ... // other options
    transports: [
        new InfluxDB2Transport(
            'info',                     // min log level to send to influxdb
            'http://localhost:8086',    // influxdbv2 url
            'my-org',                   // influxdbv2 organization
            'my-bucket',                // influxdbv2 bucket
            'my-token',                 // influxdbv2 token
            'my-measurement',           // influxdbv2 measurement
        )
    ],
});
```
