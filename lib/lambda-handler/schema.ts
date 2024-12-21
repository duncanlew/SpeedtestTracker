import Ajv, {JSONSchemaType} from "ajv"
import {
    BandwidthResult,
    Latency,
    NetworkInterface,
    PingResult, ResultDetails, ServerDetails,
    SpeedtestResultDto,
    SpeedtestTrackerPayload
} from "./models";
const ajv = new Ajv()



const latencySchema: JSONSchemaType<Latency> = {
    type: "object",
    properties: {
        high: { type: "number" },
        iqm: { type: "number" },
        jitter: { type: "number" },
        low: { type: "number" },
    },
    required: ["high", "iqm", "jitter", "low"],
}

const bandwidthResultSchema: JSONSchemaType<BandwidthResult> = {
    type: "object",
    properties: {
        bandwidth: {type: "number"},
        bytes: {type: "number"},
        elapsed: {type: "number"},
        latency: latencySchema,
    },
    required: ["bandwidth", "bytes", "elapsed", "latency"]
}

const networkInterfaceSchema: JSONSchemaType<NetworkInterface> = {
    type: "object",
    properties: {
        externalIp: {type: 'string'},
        internalIp: {type: 'string'},
        isVpn: {type: "boolean"},
        macAddr: {type: 'string'},
        name: {type: 'string'},
    },
    required: ["externalIp", "internalIp", "isVpn", "macAddr", "name"],
}

const pingResultSchema: JSONSchemaType<PingResult> = {
    type: "object",
    properties: {
        high: {type: 'number'},
        jitter: {type: 'number'},
        latency: {type: 'number'},
        low: {type: 'number'},
    },
    required: ["high", "jitter", "latency", "low"],
}

const resultDetailsSchema: JSONSchemaType<ResultDetails> = {
    type: "object",
    properties: {
        id: { type: "string" },
        persisted: { type: "boolean" },
        url: { type: "string" },
    },
    required: ["id", "persisted", "url"],
};

const serverDetailsSchema: JSONSchemaType<ServerDetails> = {
    type: "object",
    properties: {
        country: { type: "string" },
        host: { type: "string" },
        id: { type: "number" },
        ip: { type: "string" },
        location: { type: "string" },
        name: { type: "string" },
        port: { type: "number" },
    },
    required: ["country", "host", "id", "ip", "location", "name", "port"],
};

const speedtestResultDtoSchema: JSONSchemaType<SpeedtestResultDto> = {
    type: "object",
    properties: {
        download: bandwidthResultSchema,
        upload: bandwidthResultSchema,
        interface: networkInterfaceSchema,
        isp: {type: "string"},
        packetLoss: {type: "number"},
        ping: pingResultSchema,
        result: resultDetailsSchema,
        server: serverDetailsSchema,
        timestamp: {type: "string"},
        type: {type: "string"}
    },
    required: [
        "download",
        "upload",
        "interface",
        "isp",
        "packetLoss",
        "ping",
        "result",
        "server",
        "timestamp",
        "type",
    ],
}

const speedtestTrackerPayloadSchema: JSONSchemaType<SpeedtestTrackerPayload> = {
    type: "object",
    properties: {
        pk: {type: 'string'},
        result: speedtestResultDtoSchema
    },
    required: ["pk", "result"],
}



