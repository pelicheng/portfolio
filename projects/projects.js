import { fetchJSON, renderProjects } from '../global.js';

const projects = await fetchJSON('../lib/projects.json');
// const projects = await fetchJSON('/lib/projects.json')
const projectsContainer = document.querySelector('.projects');

renderProjects(projects, projectsContainer, 'h2');

const projectsTitle = document.querySelector('.projects-title');
if (projectsTitle) {
    // Update the text content of the title with the number of projects
    projectsTitle.textContent = `${projects.length} Projects`;
}
