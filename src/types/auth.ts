export interface CreateApiKeyRequest {
    readonly id: string;
    readonly tenantId: string;
}

export interface ApiKey {
    readonly id: string;
    readonly object: string;
    readonly created: number;
    readonly tenantId: string;
    readonly secret: string;
}
