import {ApiKey} from "./auth";

export interface CreateOrganizationRequest {
  readonly name: string;
  readonly contact: Contact;
}

export interface CreateOrganizationResponse {
  readonly organization: Organization;
  readonly apiKey: ApiKey;
}

export interface GetOrganizationRequest {
  readonly id: string;
}

export interface UpdateOrganizationRequest {
  readonly id: string;
  readonly contact: Contact;
}

export interface ListOrganizationsRequest {
  readonly startingAfter?: string;
  readonly limit?: number;
  readonly idBeginsWith?: string;
}

export interface ListOrganizationsResponse {
  readonly organizations: Organization[];
}

export interface Organization {
  readonly id: string;
  readonly object: string;
  readonly created: number;
  readonly name: string;
  readonly contact: Contact;
}

export interface Contact {
  readonly name: string;
  readonly email: string;
}

