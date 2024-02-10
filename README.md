# InfluxDBv2 transport for Winston

This module allows you to log [Winston](https://github.com/winstonjs/winston) messages to [InfluxDBv2](https://docs.influxdata.com/influxdb/v2/).

## Installation

```bash
npm install winston-influxdb2
```

## Basic usage

```ts
winston.createLogger({
  // {...}
  transports: [
    new InfluxDB2Transport(
      "info",                     // min log level to send to influxdb
      "http://localhost:8086",    // influxdbv2 url
      "my-token",                 // influxdbv2 token
      "my-org",                   // influxdbv2 organization
      "my-bucket",                // influxdbv2 bucket
      "my-measurement",           // influxdbv2 measurement
    ),
  ],
});
```

## Advanced usage

Additional options can be passed to the transport:

- `writeOptions` - InfluxDB write options. Default write options can be found [here](https://github.com/influxdata/influxdb-client-js/blob/master/packages/core/src/options.ts#L141)
- `precision` - (`ns` | `u` | `ms` | `s` | `m` | `h`) InfluxDB write precision. Default is `ns`.
- `tags` - Tags to be set on all messages. i.e. `{ host: 'my-host', app: 'my-app', env: 'production' }`.

```ts
winston.createLogger({
  // {...}
  transports: [
    new InfluxDB2Transport(
      "info",                     // min log level to send to influxdb
      "http://localhost:8086",    // influxdbv2 url
      "my-token",                 // influxdbv2 token
      "my-org",                   // influxdbv2 organization
      "my-bucket",                // influxdbv2 bucket
      "my-measurement",           // influxdbv2 measurement
      {
                                  // write options
        batchSize: 1000,
        flushInterval: 10000,
        retryInterval: 1000,
        maxRetries: 5,
      },
      "ms",                       // influxdbv2 timestamp precision 
      {
                                  // global tags to be set on all messages
        host: "my-host",
        app: "my-app",
        env: "production",
      },
    ),
  ],
});
```

## Debug

If log level is set to `debug`, the message "InfluxDB2Transport initialized" will be sent to InfluxDBv2 on startup. This is useful for debugging the transport issues. Otherwise, transport errors will be logged only on the first flush interval (default 60s).
