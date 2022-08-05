
export interface ApiKey {
    readonly id: string;
    readonly object: string;
    readonly created: number;
    readonly tenantId: string;
    readonly secret: string;
}
