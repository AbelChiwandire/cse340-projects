import { getAllOrganizations, getOrganizationDetails, createOrganization, updateOrganization } from '../models/organizations.js';
import { getProjectsByOrganizationId } from '../models/projects.js';
import { body, validationResult } from 'express-validator';

// Define validation and sanitization rules for organization form
// Define validation rules for organization form
export const organizationValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Organization name is required')
        .isLength({ min: 3, max: 150 })
        .withMessage('Organization name must be between 3 and 150 characters'),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('Organization description is required')
        .isLength({ max: 500 })
        .withMessage('Organization description cannot exceed 500 characters'),
    body('contactEmail')
        .normalizeEmail()
        .notEmpty()
        .withMessage('Contact email is required')
        .isEmail()
        .withMessage('Please provide a valid email address')
];

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
    // Check for validation errors
    const results = validationResult(req);
    if (!results.isEmpty()) {
        // Validation failed - loop through errors
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // Redirect back to the new organization form
        return res.redirect('/new-organization');
    }
    
    const { name, description, contactEmail } = req.body;
    const logoFilename = 'placeholder-logo.png'; // Use the placeholder logo for all new organizations
    const organizationId = await createOrganization(name, description, contactEmail, logoFilename);

    // Set a success flash message
    req.flash('success', 'Organization added successfully!');
    res.redirect(`/organizations/${organizationId}`);
};

export const showEditOrganizationForm = async (req, res) => {
    const organizationId = req.params.id;
    const title = 'Edit Organization';
    const organization = await getOrganizationDetails(organizationId);
    console.log(organization);

    res.render('edit-organization', { title, organization });
}

export const processEditOrganizationForm = async (req, res) => {
    // Check for validation errors
    const results = validationResult(req);
    if (!results.isEmpty()) {
        // Validation failed - loop through errors
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // Redirect back to the edit organization form
        return res.redirect('/edit-organization/' + req.params.id);
    }
    
    const organizationId = req.params.id;
    const { name, description, contactEmail, logoFilename } = req.body;

    await updateOrganization(organizationId, name, description, contactEmail, logoFilename);

    req.flash('success', 'Organization updated successfully!');

    res.redirect(`/organizations/${organizationId}`);
};