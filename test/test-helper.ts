import {Organization, ApiKey, Contact, PaymentsClient} from "../src";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

export interface NewAccountOutput {
  readonly client: PaymentsClient;
  readonly organization: Organization;
  readonly apiKey: ApiKey;
}

const CONFIG_FILE_NAME = "payments.json";

export interface PaymentsClientConfig {
  readonly baseUrl?: string;
  readonly apiKey: string;
}

export class TestHelper {

  static readConfigFile(): PaymentsClientConfig {
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

    return file !== undefined ? JSON.parse(fs.readFileSync(file, "utf-8")) : {};
  }

  static client(): PaymentsClient {
    if (process.env.PAYMENTS_BASE_URL !== undefined || fs.existsSync(CONFIG_FILE_NAME)) {
      const config = this.readConfigFile();
      return new PaymentsClient(config.baseUrl).apiKey(config.apiKey);
    } else {
      return new PaymentsClient("https://api.payments-stage.netradius.com");
    }
  }

  static organizationId(): string {
    return `paymentsclienttest${Date.now()}`;
  }

  static contact(): Contact {
    return {
      name: "Quality Assurance",
      email: "payments-client-test@payments.netradius.com"
    }
  }

  static async newOrganization(): Promise<NewAccountOutput> {
    const client = this.client();
    const organizationId = this.organizationId();
    const contact = TestHelper.contact();
    const out = await client.createOrganization({
      name: organizationId,
      contact: TestHelper.contact()
    });
    expect(out.organization.contact).toEqual(contact);
    expect(out.organization.created).toBeDefined();
    expect(out.apiKey.secret).toBeDefined();
    expect(out.apiKey.created).toBeDefined();
    expect(out.apiKey.id).toEqual("master");
    expect(out.apiKey.organizationId).toEqual(organizationId);
    client.apiKey(out.apiKey.secret);
    return {
      client,
      ...out
    }
  }
}
