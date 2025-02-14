console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// let navLinks = $$("nav a");

// let currentLink = navLinks.find(
//     (a) => a.host === location.host && a.pathname === location.pathname
//   );

//   currentLink?.classList.add('current');

let pages = [
    { url: 'index.html', title: 'Home' },
    { url: 'projects/index.html', title: 'Projects' },
    { url: 'contact/index.html', title: 'Contact'},
    { url: 'meta/index.html', title: 'Meta'},
    { url: 'https://github.com/pelicheng', title: 'GitHub'},
    { url: 'resume/resume.html', title: 'Resume'}
];

const ARE_WE_HOME = document.documentElement.classList.contains('home');

let isGitHub = !window.location.hostname.includes('127.0.0.1') && !window.location.hostname.includes('localhost');

let repoBase = isGitHub ? '/portfolio' : '';

let nav = document.createElement('nav');
document.body.prepend(nav);

for (let p of pages) {
    let url = p.url;
    let title = p.title;
    // TODO create link and add it to nav

    // url = !ARE_WE_HOME && !url.startsWith('http') ? '../' + url : url;
    if (!url.startsWith('http')) {
        url = repoBase + '/' + url;
    }

    // Create link and add it to nav
    // nav.insertAdjacentHTML('beforeend', `<a href="${url}">${title}</a>`);
    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;
    
    if (a.host === location.host && a.pathname === location.pathname) {
        a.classList.add('current');
    }
    
    if (a.host !== location.host) {
        a.target = "_blank";
    }

    nav.append(a); 
}

document.body.insertAdjacentHTML(
    'afterbegin',
    `
      <label class="color-scheme">
          Theme:
          <select>
              <option value = "light dark">Automatic</option>
              <option value = "light">Light</option>
              <option value = "dark">Dark</option>
          </select>
      </label>`
);

let select = document.querySelector('select');

function setColorScheme(colorScheme) {
    document.documentElement.style.setProperty('color-scheme', colorScheme);
}

select.addEventListener('input', function (event) {
    console.log('color scheme changed to', event.target.value);
    localStorage.colorScheme = event.target.value;
    setColorScheme(event.target.value);
});

if ('colorScheme' in localStorage) {
    let savedScheme = localStorage.colorScheme;
    setColorScheme(savedScheme);
    select.value = savedScheme;
}

let form = document.querySelector('form');

form?.addEventListener('submit', function(event) {
    event.preventDefault();

    let data = new FormData(form);
    let url = form.action + '?';

    for (let [name, value] of data) {
        console.log(name, value);
        value = encodeURIComponent(value);
        url += `${name}=${value}&`;
        
    }
    
    url = url.slice(0, -1);
    location.href = url;
});

export async function fetchJSON(url) {
    try {
        // Fetch the JSON file from the given URL
        const response = await fetch(url);

        console.log(response);

        if (!response.ok) {
            throw new Error(`Failed to fetch projects: ${response.statusText}`);
        }

        const data = await response.json();

        console.log(data);

        return data;

    } catch (error) {
        console.error('Error fetching or parsing JSON data:', error);
    }
}

// fetchJSON('../lib/projects.json');

export function renderProjects(project, containerElement, headingLevel = 'h2') {
    // Your code will go here
    containerElement.innerHTML = '';

    project.forEach(project => {
        const article = document.createElement('article');

        article.innerHTML = `
        <h3>${project.title}</h3>
        <p class = "project-year">${project.year}</p>
        <img src="${project.image}" alt="${project.title}">
        <p>${project.description}</p>
        `;

        containerElement.appendChild(article);
    });
}

export async function fetchGitHubData(username) {
    // return statement here
    return fetchJSON(`https://api.github.com/users/${username}`);
  }
