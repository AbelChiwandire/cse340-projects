import db from './db.js';

export async function getAllCategories() {
    const query = `
        SELECT 
            c.category_id,
            c.name,
            ARRAY_AGG(p.title) AS projects
        FROM category c
        JOIN project_category pc ON c.category_id = pc.category_id
        JOIN project p ON pc.project_id = p.project_id
        GROUP BY c.category_id, c.name
        ORDER BY c.category_id
    `;
    const result = await db.query(query);
    return result.rows;
}