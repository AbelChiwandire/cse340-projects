import { getAllCategories, getCategoryById, getProjectsByCategoryId } from '../models/categories.js';

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