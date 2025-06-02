import {createEffect, createEvent, createStore, sample} from "effector";
import {AxiosError} from "axios";
import {apiClient, baseUrl} from "../lib";

export interface AuditEvent {
    id: number;
    name: string;
    eventType: AuditEventType;
    issuedAt: Date;
    value: string;
}
export enum AuditEventType {
    INFO = 'INFO',
    SECURITY = 'SECURITY',
    GENERAL = 'GENERAL'
}

export const $auditEvents = createStore<AuditEvent[]>([]);
export const loadAuditEvents = createEvent();

const loadAuditEventsFx = createEffect<void, AuditEvent[], AxiosError>({
    async handler() {
        return await apiClient.get(`${baseUrl}/auditEvents`).then(({ data }) => data);
    }
});

sample({
    clock: loadAuditEvents,
    target: loadAuditEventsFx
});

sample({
    clock: loadAuditEventsFx.doneData,
    target: $auditEvents
});
