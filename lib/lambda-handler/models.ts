export interface Todo {
    userId: number;
    id: number;
    title: string;
    completed: boolean;
}

export interface SpeedtestTrackerPayload {
    pk: string;
    result: any;
}