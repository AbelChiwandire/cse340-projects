import { getAllCategories, getCategoryById, getProjectsByCategoryId, getCategoriesByProjectId, updateCategoryAssignments, createCategory, updateCategory } from '../models/categories.js';
import { getProjectDetails } from '../models/projects.js';
import { body, validationResult } from 'express-validator';

export const categoryValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Category Name is required')
        .isLength({ min: 3, max: 100 }).withMessage('Category message should be between 3 and 100 characters.')
];

export const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Service Categories';

    res.render('categories', { title, categories });
};

export const showCategoryPage = async (req, res) => {
    const categoryId = req.params.id;
    const title = 'Category Details';

    const category = await getCategoryById(categoryId);
    const projects = await getProjectsByCategoryId(categoryId);

    res.render('category', { title, category, projects } );

}

export const showAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;
    const projectDetails = await getProjectDetails(projectId);

    const categories = await getAllCategories();
    const assignedCategories = await getCategoriesByProjectId(projectId);

    const title = 'Assign Categories To Projects';

    console.log("categories", categories);
    console.log("Assigned categories", assignedCategories);    

    res.render('assign-categories', { title, projectId, projectDetails, categories, assignedCategories });
}

export const processAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;
    const selectedCategoryIds = req.body.categoryIds || [];
    
    // Ensure selectedCategoryIds is an array
    const categoryIdsArray = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [selectedCategoryIds];
    await updateCategoryAssignments(projectId, categoryIdsArray);
    req.flash('success', 'Categories updated successfully.');
    res.redirect(`/projects/${projectId}`);
};

export const showNewCategoryForm = async (req, res) => {
    const title = 'Add New Category';

    res.render('new-category', { title });
}

export const processNewCategoryForm = async (req, res) => {
    // Check for validation errors
    const results = validationResult(req);
    if (!results.isEmpty()) {
        // Validation failed - loop through errors
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // Redirect back to the new organization form
        return res.redirect('/new-category');
    }

    const { name } = req.body;
    const categoryId = await createCategory(name);

    req.flash('success', 'Category added successfully!');
    res.redirect(`/categories/${categoryId}`);
}

export const showEditCategoryForm = async (req, res) => {
    const categoryId = req.params.id;
    const categoryDetails = await getCategoryById(categoryId);
    const title = 'Edit Category';

    res.render('edit-category', { title, categoryId, categoryDetails });
}

export const processEditCategoryForm = async (req, res) => {
    // Check for validation errors
    const results = validationResult(req);
    if (!results.isEmpty()) {
        // Validation failed - loop through errors
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // Redirect back to the new organization form
        return res.redirect('/edit-category/' + req.params.id);
    }
    const categoryId = req.params.id;
    const { name } = req.body;
    await updateCategory(categoryId, name);

    req.flash('success', 'Category updated successfully!');
    res.redirect(`/categories/${categoryId}`);
}