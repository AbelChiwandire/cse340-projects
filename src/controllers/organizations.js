import { getAllOrganizations, getOrganizationDetails, createOrganization } from '../models/organizations.js';
import { getProjectsByOrganizationId } from '../models/projects.js';

export const showOrganizationsPage = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Our Partner Organizations';

    res.render('organizations', { title, organizations });
};

export const showOrganizationDetailsPage = async (req, res) => {
    const organizationId = req.params.id;
    const title = 'Organization Details';
    const organization = await getOrganizationDetails(organizationId);
    const projects = await getProjectsByOrganizationId(organizationId);

    res.render('organization', { title, organization, projects});
}

export const showNewOrganizationForm = async (req, res) => {
    const title = 'Add New Organization';

    res.render('new-organization', { title });
};

export const processNewOrganizationForm = async (req, res) => {
    const { name, description, contactEmail } = req.body;
    const logoFilename = 'placeholder-logo.png'; // Use the placeholder logo for all new organizations

    const organizationId = await createOrganization(name, description, contactEmail, logoFilename);
    res.redirect(`/organizations/${organizationId}`);
};