export const showHomePage = async (req, res) => {
    const title = 'Welcome | CSE340 Service Network';

    res.render('home', { title });
};