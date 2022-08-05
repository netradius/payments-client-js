import {HttpClient, HttpResponse, StatusCode} from "./http-client";
import {BadRequestError, ForbiddenError, InternalServerError, NotFoundError} from "./errors";
import * as fs from "fs";
import {ContentType} from "./content-type";
import {
    CreateProviderRequest,
    CreateTenantRequest,
    CreateTenantResponse, CreateTransactionRequest, GetProviderRequest,
    GetTenantRequest, GetTransactionRequest, Provider,
    Tenant, Transaction, UpdateProviderRequest,
    UpdateTenantRequest
} from "./types";
import path = require("path");
import os = require("os");

const DEFAULT_BASE_URL = "https://payments.netradius.com";
const USER_AGENT = "payments-client";
const CONFIG_FILE_NAME = "payments.json";
const UTF8 = "utf-8";

export class PaymentsClientConfig {
    readonly baseUrl?: string;
    readonly apiKey?: string;
}

export class PaymentsClient {

    readonly baseUrl: string;
    protected client: HttpClient;

    protected readConfigFile(): PaymentsClientConfig {
        let file = undefined;
        // Find config file in current and parent directories
        let currentPath = __dirname
        for (let p of path.join(__dirname).normalize().split(path.sep)) {
            currentPath = path.join(currentPath, "..").normalize();
            if (fs.existsSync(path.join(currentPath, CONFIG_FILE_NAME))) {
                file = path.join(currentPath, CONFIG_FILE_NAME);
            }
        }

        // Find config file in home directory
        if (file === undefined && fs.existsSync(path.join(os.homedir(), CONFIG_FILE_NAME))) {
            file = path.join(os.homedir(), CONFIG_FILE_NAME);
        }

        // Find config file in /etc
        if (file == undefined && fs.existsSync(path.join("/etc", CONFIG_FILE_NAME))) {
            file = path.join("/etc", CONFIG_FILE_NAME);
        }

        return file !== undefined ? JSON.parse(fs.readFileSync(file, UTF8)) : {};
    }

    constructor(baseUrl?: string) {
        const configFile = this.readConfigFile();

        if (baseUrl !== undefined) {
            this.client = new HttpClient(baseUrl);
        } else if (process.env.PAYMENTS_BASE_URL !== undefined) {
            this.client = new HttpClient(process.env.PAYMENTS_BASE_URL);
        } else if (configFile.baseUrl !== undefined) {
            this.client = new HttpClient(configFile.baseUrl);
        } else {
            this.client = new HttpClient(DEFAULT_BASE_URL);
        }
        this.baseUrl = this.client.baseUrl;

        if (process.env.PAYMENTS_API_KEY !== undefined) {
            this.client.apiKey(process.env.PAYMENTS_API_KEY);
        } else if (configFile.apiKey !== undefined) {
            this.client.apiKey(configFile.apiKey);
        }
    }

    apiKey(secret: string): PaymentsClient {
        this.client.apiKey(secret);
        return this;
    }

    protected async processFailure(res: HttpResponse) {
        let message = res.statusText();
        try {
            let content = await res.json();
            if ("message" in content) {
                message = content.message;
            }
        } catch (error) {}
        if (res.status() === StatusCode.BAD_REQUEST) {
            throw new BadRequestError(message);
        }
        if (res.status() === StatusCode.NOT_FOUND) {
            throw new NotFoundError(message);
        }
        if (res.status() === StatusCode.FORBIDDEN) {
            throw new ForbiddenError(message);
        }
        if (res.status() === StatusCode.INTERNAL_ERROR) {
            throw new InternalServerError(message);
        }
        throw Error(message);
    }

    protected async sendCommand(command: any, authRequired: boolean, contentType: ContentType, expectedContentType?: ContentType): Promise<any> {
        const res = await this.client.userAgent(USER_AGENT).request("/").authRequired(authRequired).post().json(command, contentType).send();
        if (res.success()) {
            if (expectedContentType !== undefined && expectedContentType !== res.contentType()) {
                throw new Error(`Expected content type ${expectedContentType} and received ${res.contentType()}`);
            }
            return res.status() === StatusCode.NO_CONTENT ? undefined : await res.json();
        }
        await this.processFailure(res);
    }

    protected async get(authRequired: boolean, path: string): Promise<any> {
        const res = await this.client.userAgent(USER_AGENT).request(path).authRequired(authRequired).get().send();
        if (res.success()) {
            return res.status() === StatusCode.NO_CONTENT ? undefined : await res.json();
        }
        await this.processFailure(res);
    }

    protected async post(request: any, authRequired: boolean, path: string): Promise<any> {
        const res = await this.client.userAgent(USER_AGENT).request(path).authRequired(authRequired).post().json(request).send();
        if (res.success()) {
            return res.status() === StatusCode.NO_CONTENT ? undefined : await res.json();
        }
        await this.processFailure(res);
    }

    protected async put(request: any, authRequired: boolean, path: string): Promise<any> {
        const res = await this.client.userAgent(USER_AGENT).request(path).authRequired(authRequired).put().json(request).send();
        if (res.success()) {
            return res.status() === StatusCode.NO_CONTENT ? undefined : await res.json();
        }
        await this.processFailure(res);
    }

    async createTenant(request: CreateTenantRequest): Promise<CreateTenantResponse> {
        return await this.post(request, false, "/tenants");
    }

    async getTenant(request: GetTenantRequest): Promise<Tenant> {
        return await this.get(false, `/tenants/${request.id}`);
    }

    async listTenants(): Promise<Tenant[]> {
        return await this.get(false, "/tenants");
    }

    async updateTenant(request: UpdateTenantRequest): Promise<Tenant> {
        return await this.put(request, false, `/tenants/${request.id}`);
    }

    async createProvider(request: CreateProviderRequest): Promise<Provider> {
        return await this.post(request, true, "/providers");
    }

    async getProvider(request: GetProviderRequest): Promise<Provider> {
        return await this.get(true, `/providers/${request.id}`);
    }

    async listProviders(): Promise<Provider[]> {
        return await this.get(true, "/providers");
    }

    async updateProvider(request: UpdateProviderRequest): Promise<Provider> {
        return await this.put(request, true, `/providers/${request.id}`);
    }

    async createTransaction(request: CreateTransactionRequest): Promise<Transaction> {
        return await this.post(request, true, "/transactions");
    }

    async getTransaction(request: GetTransactionRequest): Promise<Transaction> {
        return await this.get(true, `/transactions/${request.id}`);
    }

    async listTransactions(): Promise<Transaction[]> {
        return await this.get(true, "/transactions");
    }

}
