import { getUpcomingProjects, getProjectDetails } from '../models/projects.js';
import { getCategoriesByProjectId } from '../models/categories.js';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

export const showProjectsPage = async (req, res) => {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    const title = 'Service Projects';

    res.render('projects', { title, projects });
};

export const showProjectDetailsPage = async (req, res) => {
    const projectId = req.params.id;
    const title = 'Project Details';
    const project = await getProjectDetails(projectId);
    const categories = await getCategoriesByProjectId(projectId);

    res.render('project', { title, project, categories });
}