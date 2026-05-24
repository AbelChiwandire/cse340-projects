import db from './db.js';

export async function getAllProjects() {
    const query = `
        SELECT p.project_id, p.title, p.description, p.location, p.date, o.organization_id, o.name AS organization_name
        FROM project p
            JOIN organization o 
            ON p.organization_id = o.organization_id
    `;
    const result = await db.query(query);
    return result.rows;
}

export async function getProjectsByOrganizationId (organizationId) {
      const query = `
        SELECT
          project_id,
          organization_id,
          title,
          description,
          location,
          date
        FROM project
        WHERE organization_id = $1
        ORDER BY date;
      `;
      
      const queryParams = [organizationId];
      const result = await db.query(query, queryParams);

      return result.rows;
};

export async function getUpcomingProjects(number_of_projects) {
    const today = new Date().toISOString().split('T')[0];

    const query = `
        SELECT p.project_id, p.title, p.description, p.location, p.date, o.organization_id, o.name AS organization_name
        FROM project p
            JOIN organization o 
            ON p.organization_id = o.organization_id
        WHERE p.date >= $1
        ORDER BY p.date ASC
        LIMIT $2
    `;
    const result = await db.query(query, [today, number_of_projects]);
    return result.rows;
}

export async function getProjectDetails(id) {
    const query = `
        SELECT p.project_id, p.title, p.description, p.location, p.date, o.organization_id, o.name AS organization_name
        FROM project p
            JOIN organization o 
            ON p.organization_id = o.organization_id
        WHERE p.project_id = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
}