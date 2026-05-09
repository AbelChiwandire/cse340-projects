// Hamburger Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navigation = document.querySelector('.navigation');
const navLinks = document.querySelectorAll('.nav-links li a');

// Toggle menu when hamburger is clicked
hamburger.addEventListener('click', () => {
	hamburger.classList.toggle('show');
	navigation.classList.toggle('show');
});

const highlightCurrentPageNav = () => {
	const currentPath = window.location.pathname.replace(/\/$/, '') || '/';

	navLinks.forEach(link => {
		const linkPath = new URL(link.href).pathname.replace(/\/$/, '') || '/';
		link.classList.toggle('selected', currentPath === linkPath);
	});
};

highlightCurrentPageNav();

// Close menu when a navigation link is clicked
navLinks.forEach(link => {
	link.addEventListener('click', () => {
		hamburger.classList.remove('show');
		navigation.classList.remove('show');
	});
});