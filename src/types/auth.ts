export interface ApiKey {
    readonly id: string;
    readonly object: string;
    readonly created: number;
    readonly organizationId: string;
    readonly secret: string;
}
