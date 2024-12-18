export interface SpeedtestTrackerPayload {
    pk: string;
    result: SpeedtestResult;
}

export interface SpeedtestResult {
    download: BandwidthResult;
    upload: BandwidthResult;
    interface: NetworkInterface;
    isp: string;
    packetLoss: number;
    ping: PingResult;
    result: ResultDetails;
    server: ServerDetails
    timestamp: string;
    type: string;
}

export interface SpeedtestResultConverted extends SpeedtestResult {
    downloadMbps: number;
    uploadMbps: number;
    pingMs: number;
}

interface BandwidthResult {
    bandwidth: number;
    bytes: number;
    elapsed: number;
    latency: Latency;
}

interface Latency {
    high: number;
    iqm: number;
    jitter: number;
    low: number;
}

interface NetworkInterface {
    externalIp: string;
    internalIp: string;
    isVpn: boolean;
    macAddr: string;
    name: string;
}

interface PingResult {
    high: number;
    jitter: number;
    latency: number;
    low: number;
}

interface ResultDetails {
    id: string;
    persisted: boolean;
    url: string;
}

interface ServerDetails {
    country: string;
    host: string;
    id: number;
    ip: string;
    location: string;
    name: string;
    port: number;
}
