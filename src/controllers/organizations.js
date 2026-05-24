import { getAllOrganizations, getOrganizationDetails } from '../models/organizations.js';

export const showOrganizationsPage = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Our Partner Organizations';

    res.render('organizations', { title, organizations });
};

export const showOrganizationDetailsPage = async (req, res) => {
    const organizationId = req.params.id;
    const title = 'Organization Details';
    const rows = await getOrganizationDetails(organizationId);

    const upcomingProjects = [];
    const pastProjects = [];

    rows.forEach(row => {
        if (!row.project_id) return;

        const project = {
            project_id: row.project_id,
            title: row.project_title,
            date: row.project_date,
        }

        if (row.project_status === 'upcoming') {
            upcomingProjects.push(project);
        } else {
            pastProjects.push(project);
        }
    });

    const organization = {
        organization_id: rows[0].organization_id,
        name: rows[0].name,
        description: rows[0].description,
        contact_email: rows[0].contact_email,
        logo_filename: rows[0].logo_filename
    };

    res.render('organization', { title, organization: organization, upcomingProjects, pastProjects });
}