import {HttpClient, HttpResponse, StatusCode} from "./http-client";
import {
    BadRequestError,
    ConflictError,
    ForbiddenError,
    InternalServerError,
    MethodNotAllowedError,
    NotFoundError,
    NotImplementedError,
    UnauthorizedError
} from "./errors";
import * as fs from "fs";
import {ContentType} from "./content-type";
import {
    AttachPaymentMethodToWalletRequest,
    AuthorizeNetGatewayProvider,
    BankPaymentMethod,
    BankPaymentSummary,
    CardPaymentMethod,
    CardPaymentSummary,
    CreateAuthorizeNetGatewayProviderRequest,
    CreateBankPaymentMethodRequest,
    CreateBankPaymentRequest,
    CreateCardPaymentRequest,
    CreateCardPaymentMethodRequest,
    CreateOrganizationRequest,
    CreateOrganizationResponse,
    CreatePaymentMethodPaymentRequest,
    CreateWalletRequest,
    DeletePaymentMethodRequest,
    DetachPaymentMethodFromWalletRequest,
    GetOrganizationRequest,
    GetPaymentMethodRequest,
    GetPaymentRequest,
    GetProviderRequest,
    GetWalletRequest,
    ListPaymentMethodsForWalletRequest,
    ListPaymentMethodsForWalletResponse,
    ListOrganizationsRequest,
    ListOrganizationsResponse,
    ListPaymentMethodsRequest,
    ListPaymentMethodsResponse,
    ListPaymentsRequest,
    ListPaymentsResponse,
    ListProvidersRequest,
    ListProvidersResponse,
    ListWalletsRequest,
    ListWalletsResponse,
    Organization,
    PaymentMethodResponse,
    PaymentSummaryResponse,
    ProviderResponse,
    UpdateAuthorizeNetGatewayProviderRequest,
    UpdateOrganizationRequest,
    Wallet
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

        switch (res.status()) {
            case StatusCode.BAD_REQUEST:
                throw new BadRequestError(message);
            case StatusCode.UNAUTHORIZED:
                throw new UnauthorizedError(message);
            case StatusCode.FORBIDDEN:
                throw new ForbiddenError(message);
            case StatusCode.NOT_FOUND:
                throw new NotFoundError(message);
            case StatusCode.METHOD_NOT_ALLOWED:
                throw new MethodNotAllowedError(message);
            case StatusCode.CONFLICT:
                throw new ConflictError(message);
            case StatusCode.INTERNAL_ERROR:
                throw new InternalServerError(message);
            case StatusCode.NOT_IMPLEMENTED:
                throw new NotImplementedError(message);
            default:
                throw Error(message);
        }
    }

    protected async get(authRequired: boolean, path: string): Promise<any> {
        const res = await this.client.userAgent(USER_AGENT).request(path).authRequired(authRequired).get().send();
        if (res.success()) {
            return res.status() === StatusCode.NO_CONTENT ? undefined : await res.json();
        }
        await this.processFailure(res);
    }

    protected async post(request: any, authRequired: boolean, path: string, contentType?: ContentType, expectedContentType?: ContentType): Promise<any> {
        const res = await this.client.userAgent(USER_AGENT).request(path).authRequired(authRequired).post().json(request, contentType).send();
        if (res.success()) {
            if (expectedContentType !== undefined && expectedContentType !== res.contentType()) {
                throw new Error(`Expected content type ${expectedContentType} and received ${res.contentType()}`);
            }
            return res.status() === StatusCode.NO_CONTENT ? undefined : await res.json();
        }
        await this.processFailure(res);
    }

    protected async put(request: any, authRequired: boolean, path: string, contentType?: string, expectedContentType?: ContentType): Promise<any> {
        const res = await this.client.userAgent(USER_AGENT).request(path).authRequired(authRequired).put().json(request, contentType).send();
        if (res.success()) {
            if (expectedContentType !== undefined && expectedContentType !== res.contentType()) {
                throw new Error(`Expected content type ${expectedContentType} and received ${res.contentType()}`);
            }
            return res.status() === StatusCode.NO_CONTENT ? undefined : await res.json();
        }
        await this.processFailure(res);
    }

    protected async delete(authRequired: boolean, path: string): Promise<void> {
        const res = await this.client.userAgent(USER_AGENT).request(path).authRequired(authRequired).delete().send();
        if (res.success()) {
            return res.status() === StatusCode.NO_CONTENT ? undefined : await res.json();
        }
        await this.processFailure(res);
    }

    protected toSearchParams(params: object): string {
        const searchParams = new URLSearchParams();
        Object.keys(params).forEach(key => searchParams.append(key, params[key]));
        return searchParams.toString();
    }

    async createOrganization(request: CreateOrganizationRequest): Promise<CreateOrganizationResponse> {
        return await this.post(request, false, "/organizations");
    }

    async listOrganizations(request: ListOrganizationsRequest): Promise<ListOrganizationsResponse> {
        const searchParams = this.toSearchParams(request);
        return await this.get(false, `/organizations?${searchParams}`);
    }

    async getOrganization(request: GetOrganizationRequest): Promise<Organization> {
        return await this.get(false, `/organizations/${request.id}`);
    }

    async updateOrganization(request: UpdateOrganizationRequest): Promise<void> {
        return await this.put(request, false, `/organizations/${request.id}`);
    }

    async createAuthorizeNetGatewayProvider(request: CreateAuthorizeNetGatewayProviderRequest): Promise<void> {
        return await this.post(request, true, "/providers", ContentType.CREATE_PROVIDER_GATEWAY_AUTHORIZE_NET_V1, ContentType.CREATE_PROVIDER_GATEWAY_AUTHORIZE_NET_RESPONSE_V1);
    }

    async updateAuthorizeNetGatewayProvider(request: UpdateAuthorizeNetGatewayProviderRequest): Promise<AuthorizeNetGatewayProvider> {
        return await this.put(request, true, `/providers/${request.id}`, ContentType.UPDATE_PROVIDER_GATEWAY_AUTHORIZE_NET_V1, ContentType.UPDATE_PROVIDER_GATEWAY_AUTHORIZE_NET_RESPONSE_V1);
    }

    async listProviders(request: ListProvidersRequest): Promise<ListProvidersResponse> {
        return await this.get(true, `/providers?${this.toSearchParams(request)}`);
    }

    async getProvider(request: GetProviderRequest): Promise<ProviderResponse> {
        return await this.get(true, `/providers/${request.id}`);
    }

    async createCardPayment(request: CreateCardPaymentRequest): Promise<CardPaymentSummary> {
        return await this.post(request, true, "/payments", ContentType.CREATE_PAYMENT_CARD_V1, ContentType.CREATE_PAYMENT_CARD_RESPONSE_V1);
    }

    async createBankPayment(request: CreateBankPaymentRequest): Promise<BankPaymentSummary> {
        return await this.post(request, true, "/payments", ContentType.CREATE_PAYMENT_BANK_V1, ContentType.CREATE_PAYMENT_BANK_RESPONSE_V1);
    }

    async createPaymentMethodPayment(request: CreatePaymentMethodPaymentRequest): Promise<PaymentSummaryResponse> {
        return await this.post(request, true, "/payments", ContentType.CREATE_PAYMENT_PAYMENT_METHOD_V1, ContentType.CREATE_PAYMENT_PAYMENT_METHOD_RESPONSE_V1);
    }

    async listPayments(request: ListPaymentsRequest): Promise<ListPaymentsResponse> {
        return await this.get(true, `/payments?${this.toSearchParams(request)}`);
    }

    async getPayment(request: GetPaymentRequest): Promise<PaymentMethodResponse> {
        return await this.get(true, `/payments/${request.id}`);
    }

    async createCardPaymentMethod(request: CreateCardPaymentMethodRequest): Promise<CardPaymentMethod> {
        return await this.post(request, true, "/payment-methods", ContentType.CREATE_PAYMENT_METHOD_CARD_V1, ContentType.CREATE_PAYMENT_METHOD_CARD_RESPONSE_V1);
    }

    async createBankPaymentMethod(request: CreateBankPaymentMethodRequest): Promise<BankPaymentMethod> {
        return await this.post(request, true, "/payment-methods", ContentType.CREATE_PAYMENT_METHOD_BANK_V1, ContentType.CREATE_PAYMENT_METHOD_BANK_RESPONSE_V1);
    }

    async listPaymentMethods(request: ListPaymentMethodsRequest): Promise<ListPaymentMethodsResponse> {
        return await this.get(true, `/payment-methods?${this.toSearchParams(request)}`);
    }

    async getPaymentMethod(request: GetPaymentMethodRequest): Promise<PaymentMethodResponse> {
        return await this.get(true, `/payment-methods/${request.id}`);
    }

    async deletePaymentMethod(request: DeletePaymentMethodRequest): Promise<void> {
        return await this.delete(true, `/payment-methods/${request.id}`);
    }

    async createWallet(request: CreateWalletRequest): Promise<Wallet> {
        return await this.post(request, true, `/wallets`);
    }

    async listWallets(request: ListWalletsRequest): Promise<ListWalletsResponse> {
        return await this.get(true, `/wallets?${this.toSearchParams(request)}`);
    }

    async getWallet(request: GetWalletRequest): Promise<Wallet> {
        return await this.get(true, `/wallets/${request.id}`);
    }

    async listPaymentMethodsForWallet(request: ListPaymentMethodsForWalletRequest): Promise<ListPaymentMethodsForWalletResponse> {
        return await this.get(true, `/wallets/${request.walletId}/payment-methods`);
    }

    async attachPaymentMethodToWallet(request: AttachPaymentMethodToWalletRequest): Promise<void> {
        return await this.post(undefined,true, `/wallets/${request.walletId}/payment-methods/${request.paymentMethodId}`);
    }

    async detachPaymentMethodFromWallet(request: DetachPaymentMethodFromWalletRequest): Promise<void> {
        return await this.delete(true, `/wallets/${request.walletId}/payment-methods/${request.paymentMethodId}`);
    }
}
