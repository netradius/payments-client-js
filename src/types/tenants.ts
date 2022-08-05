import { ApiKey } from "./auth";

export interface CreateTenantRequest {
    readonly name: string;
    readonly contact: ContactDetails;
}

export interface CreateTenantResponse {
    readonly tenant: Tenant;
    readonly apiKey: ApiKey;
}

export interface GetTenantRequest {
    readonly id: string;
}

export interface UpdateTenantRequest {
    readonly id: string;
    readonly contact: ContactDetails;
}

export interface Tenant {
    readonly id: string;
    readonly object: string;
    readonly created: number;
    readonly name: string;
    readonly contact: ContactDetails;
}

export type ContactDetails = {
    readonly name: string;
    readonly email: string;
};
