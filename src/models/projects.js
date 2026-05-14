import db from './db.js';

export async function getAllProjects() {
    const query = `
        SELECT p.project_id, o.name, p.title, p.description, p.location, p.date
        FROM project p
            JOIN organization o 
            ON p.organization_id = o.organization_id
    `;
    const result = await db.query(query);
    return result.rows;
}