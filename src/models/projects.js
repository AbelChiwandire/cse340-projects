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

export const createProject = async (title, description, location, date, organizationId) => {
    const query = `
      INSERT INTO project (title, description, location, date, organization_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING project_id;
    `;

    const queryParams = [title, description, location, date, organizationId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create project');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new project with ID:', result.rows[0].project_id);
    }

    return result.rows[0].project_id;
}

export const updateProject = async (projectId, title, description, date, location, organizationId) => {
  const query = `
    UPDATE project
    SET title = $2, description = $3, date = $4, location = $5, organization_id = $6
    WHERE project_id = $1
    RETURNING project_id;
  `;

  const queryParams = [projectId, title, description, date, location, organizationId];
  const result = await db.query(query, queryParams);

  if (result.rows.length === 0) {
    throw new Error('Project not found');
  }

  if (process.env.ENABLE_SQL_LOGGING === 'true') {
    console.log('Updated project with ID:', projectId);
  }

  return result.rows[0].project_id;
};

export const addVolunteerToProject = async (project_id, user_id) => {
    const query = `
        INSERT INTO project_volunteers (project_id, user_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING
        RETURNING project_id;
    `;
    const queryParams = [project_id, user_id];

    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        // already exists
        return { status: 'already_volunteered' };
    }

    return { status: 'volunteered' };
};

export const removeVolunteerFromProject = async (project_id, user_id) => {
    const query = `
        DELETE FROM project_volunteers
        WHERE project_id = $1 AND user_id = $2
        RETURNING project_id;
    `;
    const queryParams = [project_id, user_id];

    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        return { status: 'not_volunteered' };
    }

    return { status: 'unvolunteered' };
};

export const getUserVolunteeredProjects = async (user_id) => {
    const query = `
        SELECT p.project_id, p.title, p.description, p.location, p.date
        FROM project p
        JOIN project_volunteers pv ON p.project_id = pv.project_id
        WHERE pv.user_id = $1
    `;

    const result = await db.query(query, [user_id]);

    if (result.rows.length === 0) {
        throw new Error('No volunteered projects found for user');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Retrieved volunteered projects for user ID:', user_id);
    }

    return result.rows;
}

export const isUserVolunteer = async (project_id, user_id) => {
    const query = `
        SELECT 1
        FROM project_volunteers
        WHERE project_id = $1 AND user_id = $2
        LIMIT 1;
    `;
    const queryParams = [project_id, user_id];

    try {
        const result = await db.query(query, queryParams);

        return result.rows.length > 0;

    } catch (error) {
        console.error('Error checking volunteer status:', error.message);
        throw new Error('Database error while checking volunteer status');
    }
};