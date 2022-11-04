/**
 * Integration tests for payments-client organizations.
 *
 * @group integration/organizations
 */
import {TestHelper} from "./test-helper";

jest.setTimeout(10000);

test("Organizations Happy Path", async () => {
  const newOrganization = await TestHelper.newOrganization();
  const client = newOrganization.client;
  const organization = newOrganization.organization;
  try {
    let getOrganization = await client.getOrganization({id: organization.id});
    expect(getOrganization).toEqual(organization);

    let listOrganizations = await client.listOrganizations();
    expect(listOrganizations.organizations).toContainEqual(getOrganization);

    listOrganizations = await client.listOrganizations({idBeginsWith: organization.id});
    expect(listOrganizations.organizations).toContainEqual(getOrganization);

    await client.updateOrganization({
      id: organization.id,
      contact: {
        name: "Quality Assurance Updated"
      }
    });
    getOrganization = await client.getOrganization({id: organization.id});
    expect(getOrganization.contact.name).toEqual("Quality Assurance Updated");

    await client.updateOrganization({
      id: organization.id,
      contact: {
        name: "Quality Assurance",
        email: "qa@ncryptyr.com"
      }
    });
    getOrganization = await client.getOrganization({id: organization.id});
    expect(getOrganization.contact.name).toEqual("Quality Assurance");
    expect(getOrganization.contact.email).toEqual("qa@ncryptyr.com");

    await client.updateOrganization({
      id: organization.id,
      contact: organization.contact
    });
    getOrganization = await client.getOrganization({id: organization.id});
    expect(getOrganization).toEqual(organization);
  } finally {
    // todo: delete organization
    //await client.deleteOrganization({id: organization.id});
  }
});
