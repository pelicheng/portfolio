import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');

renderProjects(projects, projectsContainer, 'h2');

const projectsTitle = document.querySelector('.projects-title');
if (projectsTitle) {
    // Update the text content of the title with the number of projects
    projectsTitle.textContent = `${projects.length} Projects`;
}

let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
let colors = d3.scaleOrdinal(d3.schemeSet3);
let selectedIndex = -1;

function recalculate(projectsGiven) {
    let newRolledData = d3.rollups(
        projectsGiven,
        (v) => v.length,
        (d) => d.year,
    );
    let newData = newRolledData.map(([year, count]) => {
        return { value: count, label: year };
    });
    return newData;
}

function embedArcClick(arcsGiven, projectsGiven, dataGiven) {
    arcsGiven.forEach((arc, idx) => {
        let path = d3.select('svg')
          .append('path')
          .attr('d', arc)
          .attr('fill', colors(idx));

        path.on('click', () => {
            selectedIndex = selectedIndex === idx ? -1 : idx;
            renderPieChart(projectsGiven);
        });

        if(selectedIndex === idx) {
            path.classed('selected', true);
        }else{
            path.classed('selected', false);
        }
    });

    let newLegend = d3.select('.legend');
    newLegend.selectAll('li').remove();
    dataGiven.forEach((d, idx) => {
        let leg = newLegend.append('li')
            .attr('style', `--color:${colors(idx)}`)
            .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);

        leg.on('click', () => {
            selectedIndex = selectedIndex === idx ? -1 : idx;
            renderPieChart(projectsGiven);
        });

        if (selectedIndex === idx) {
            leg.classed('selected', true);
        } else {
            leg.classed('selected', false);
        }
    });

    if (selectedIndex !== -1) {
        // retrieve the selected year
        let selectedYear = dataGiven[selectedIndex].label;
        // filter projects based on the year
        let filteredProjects = projectsGiven.filter(project => project.year === selectedYear);
        // render filtered projects
        renderProjects(filteredProjects, projectsContainer, 'h2');
    }else{
        renderProjects(projectsGiven, projectsContainer, 'h2');
    }
}

// Refactor all plotting into one function
function renderPieChart(projectsGiven) {
    // re-calculate rolled data
    // let newRolledData = d3.rollups(
    //   projectsGiven,
    //   (v) => v.length,
    //   (d) => d.year,
    // );
    // re-calculate data
    let newData = recalculate(projectsGiven);
    // newRolledData.map(([year, count]) => {
    //   return { value: count, label: year };
    // });

    // re-calculate slice generator, arc data, arc, etc.
    let newSliceGenerator = d3.pie().value((d) => d.value);
    let newArcData = newSliceGenerator(newData);
    let newArcs = newArcData.map((d) => arcGenerator(d));
    
    // clear up paths and legends
    let newSVG = d3.select('svg'); 
    newSVG.selectAll('path').remove();

    let newLegend = d3.select('.legend');
    newLegend.selectAll('li').remove();

    embedArcClick(newArcs, projectsGiven, newData);

    // update paths and legends, refer to steps 1.4 and 2.2
    // newArcs.forEach((arc, idx) => {
    //     let path = d3.select('svg')
    //       .append('path')
    //       .attr('d', arc)
    //       .attr('fill', colors(idx));

    //     path.on('click', () => {
    //         selectedIndex = selectedIndex === idx ? -1 : idx;
    //         renderPieChart(projectsGiven);
    //     });

    //     if(selectedIndex === idx) {
    //         path.classed('selected', true);
    //     }else{
    //         path.classed('selected', false);
    //     }
    // });

    // // let legend = d3.select('.legend');
    // newData.forEach((d, idx) => {
    //     let leg = newLegend.append('li')
    //         .attr('style', `--color:${colors(idx)}`)
    //         .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);

    //     leg.on('click', () => {
    //         selectedIndex = selectedIndex === idx ? -1 : idx;
    //         renderPieChart(projectsGiven);
    //     });

    //     if (selectedIndex === idx) {
    //         leg.classed('selected', true);
    //     } else {
    //         leg.classed('selected', false);
    //     }
    // });

    // if (selectedIndex !== -1) {
    //     // retrieve the selected year
    //     let selectedYear = newData[selectedIndex].label;
    //     // filter projects based on the year
    //     let filteredProjects = projectsGiven.filter(project => project.year === selectedYear);
    //     // render filtered projects
    //     renderProjects(filteredProjects, projectsContainer, 'h2');
    // }else{
    //     renderProjects(projectsGiven, projectsContainer, 'h2');
    // }
}
  
// Call this function on page load
renderPieChart(projects);
  
let query = '';
let searchInput = document.querySelector('.searchBar');

function setQuery(query) {
    return projects.filter((project) => {
      let values = Object.values(project).join(' ').toLowerCase();
      return values.includes(query.toLowerCase());
    });
}

searchInput.addEventListener('input', (event) => {
    query = event.target.value;
    
    let filteredProjects = setQuery(event.target.value);
    
    // re-render legends and pie chart when event triggers
    renderProjects(filteredProjects, projectsContainer, 'h2');
    renderPieChart(filteredProjects);
});

// let rolledData = d3.rollups(
//     projects,
//     (v) => v.length,
//     (d) => d.year,
// );

// let data = rolledData.map(([year, count]) => {
//     return { value: count, label: year };
// });

// let arc = arcGenerator({
//     startAngle: 0,
//     endAngle: 2 * Math.PI,
// });

// d3.select('svg').append('path').attr('d', arc).attr('fill', 'red');

// let data = [1, 2];
// let total = 0;

// for (let d of data) {
//   total += d;
// }

// let angle = 0;
// let arcData = [];

// for (let d of data) {
//   let endAngle = angle - (d / total) * 2 * Math.PI;
//   arcData.push({ startAngle: angle, endAngle });
//   angle = endAngle;
// }
// let data = [1, 2];
// let data = [1, 2, 3, 4, 5, 5];
// let data = [
//     { value: 1, label: 'apples' },
//     { value: 2, label: 'oranges' },
//     { value: 3, label: 'mangos' },
//     { value: 4, label: 'pears' },
//     { value: 5, label: 'limes' },
//     { value: 5, label: 'cherries' },
//   ];
// let sliceGenerator = d3.pie();
// let sliceGenerator = d3.pie().value((d) => d.value);
// let arcData = sliceGenerator(data);
// let arcs = arcData.map((d) => arcGenerator(d));

// let colors = ['gold', 'purple'];

// arcs.forEach((arc, idx) => {
//     d3.select('svg')
//       .append('path')
//       .attr('d', arc)
//       .attr('fill', colors(idx));
// });

// let legend = d3.select('.legend');
// data.forEach((d, idx) => {
//     legend.append('li')
//           .attr('style', `--color:${colors(idx)}`) // set the style attribute while passing in parameters
//           .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`); // set the inner html of <li>
// });

// let query = '';
// let searchInput = document.querySelector('.searchBar');

// searchInput.addEventListener('change', (event) => {
//   // update query value
//   query = event.target.value;
//   // TODO: filter the projects
//   let filteredProjects = projects.filter((project) => {
//     let values = Object.values(project).join('\n').toLowerCase();
//     return values.includes(query.toLowerCase());
//   });
//   // TODO: render updated projects!
//   renderProjects(filteredProjects, projectsContainer, 'h2');

//   renderPieChart(filteredProjects);
// });

