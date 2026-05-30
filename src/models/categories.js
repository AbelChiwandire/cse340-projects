import db from './db.js';

export async function getAllCategories() {
    const query = `
        SELECT category_id, name
        FROM category
        ORDER BY category_id
    `;
    const result = await db.query(query);
    return result.rows;
}

export async function getCategoryById(categoryId) {
    const query = `
        SELECT category_id, name
        FROM category
        WHERE category_id = $1
    `;

    const result = await db.query(query, [categoryId]);
    return result.rows[0];
}

export async function getCategoriesByProjectId(projectId) {
    const query = `
        SELECT c.category_id, c.name
        FROM category c
        JOIN project_category pc ON pc.category_id = c.category_id
        WHERE pc.project_id = $1
        ORDER BY c.category_id
    `;

    const result = await db.query(query, [projectId]);
    return result.rows;
}

export async function getProjectsByCategoryId(categoryId) {
    const query = `
        SELECT p.project_id, p.title, p.date
        FROM project p
        JOIN project_category pc ON pc.project_id = p.project_id
        WHERE pc.category_id = $1
        ORDER BY p.project_id
    `;

    const result = await db.query(query, [categoryId]);
    return result.rows;
}

export async function assignCategoryToProject(projectId, categoryId) {
    const query = `
        INSERT INTO project_category (project_id, category_id)
        VALUES ($1, $2)
    `;

    await db.query(query, [projectId, categoryId]);
}

export async function updateCategoryAssignments(projectId, categoryIds) {
    const query = `
        DELETE FROM project_category
        WHERE project_id = $1
    `;

    await db.query(query, [projectId]);

    for (const categoryId of categoryIds) {
        await assignCategoryToProject(projectId, categoryId);
    }
}