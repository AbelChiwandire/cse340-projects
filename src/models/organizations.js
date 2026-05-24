import db from './db.js'

const getAllOrganizations = async() => {
    const query = `
        SELECT organization_id, name, description, contact_email, logo_filename
      FROM public.organization;
    `;

    const result = await db.query(query);

    return result.rows;
}

const getOrganizationDetails = async (organizationId) => {
    const query = `
        SELECT o.organization_id, o.name, o.description, o.contact_email, o.logo_filename, p.project_id, p.title AS project_title, p.date AS project_date, CASE WHEN p.date >= CURRENT_DATE THEN 'upcoming' ELSE 'past' END AS project_status
        FROM organization o
        LEFT JOIN project p ON o.organization_id = p.organization_id
        WHERE o.organization_id = $1
        ORDER BY p.date ASC;
    `;
  const result = await db.query(query, [organizationId]);

  return result.rows;
}

export { getAllOrganizations, getOrganizationDetails }