// let data = [];
// let commits = [];
// let selectedCommits = [];
// // add new
// let commitProgress = 100;
// let timeScale;
// let commitMaxTime;
// let xScale;
// let yScale;
// let rScale;
// // add new 2.0
// let filteredCommits = [];
// async function loadData() {
//     data = await d3.csv('loc.csv', (row) => ({
//       ...row,
//       line: Number(row.line), // or just +row.line
//       depth: Number(row.depth),
//       length: Number(row.length),
//       date: new Date(row.date + 'T00:00' + row.timezone),
//       datetime: new Date(row.datetime),
//     }));

//     // processCommits();
//     // let commits = d3.groups(data, (d) => d.commit);

//     displayStats();
// }

// function processCommits() {
//     commits = d3
//       .groups(data, (d) => d.commit)
//       .map(([commit, lines]) => {
//         let first = lines[0];
//         let { author, date, time, timezone, datetime } = first;
//         let ret = {
//           id: commit,
//           url: 'https://github.com/pelicheng/portfolio/commit/' + commit,
//           author,
//           date,
//           time,
//           timezone,
//           datetime,
//           hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
//           totalLines: lines.length,
//         };
  
//         Object.defineProperty(ret, 'lines', {
//           value: lines,
//           configurable: true,
//           writable: true,
//           enumerable: false,
//           // What other options do we need to set?
//           // Hint: look up configurable, writable, and enumerable
//         });
  
//         return ret;
//       });
//     // add new
//     timeScale = d3.scaleTime()
//         .domain([d3.min(commits, d => d.datetime), d3.max(commits, d => d.datetime)])
//         .range([0, 100]);

//     commitMaxTime = timeScale.invert(commitProgress);

//     console.log('timeScale domain:', timeScale.domain());
//     console.log('timeScale range:', timeScale.range());
//     console.log('commitMaxTime:', commitMaxTime);
    
// }

// function displayStats() {
//     // Process commits first
//     processCommits();
    
//     // Create the dl element
//     const dl = d3.select('#stats').append('dl').attr('class', 'stats');
  
//     // Add total LOC
//     dl.append('dt').html('Total <abbr title="Lines of code">LOC</abbr>');
//     dl.append('dd').text(data.length);
  
//     // Add total commits
//     dl.append('dt').text('Commits');
//     dl.append('dd').text(commits.length);
  
//     // Add more stats as needed...
//     const maxDepth = d3.max(data, (d) => d.depth);
//     dl.append('dt').text('Max Depth');
//     dl.append('dd').text(maxDepth);

//     const numFiles = d3.group(data, (d) => d.file).size;
//     dl.append('dt').text('Files');
//     dl.append('dd').text(numFiles);

//     const fileLengths = d3.rollups(
//         data,
//         (v) => d3.max(v, (v) => v.line),
//         (d) => d.file
//     );
//     const averageFileLength = d3.mean(fileLengths, (d) => d[1]); 
//     dl.append('dt').text('Average File Length (lines)');
//     dl.append('dd').text(averageFileLength.toFixed(2));

//     const workByPeriod = d3.rollups(
//         data,
//         (v) => v.length,
//         (d) => {
//             const dateStr = new Date(d.datetime).toLocaleString('en', { dayPeriod: 'short' });
//             const period = dateStr.split(' ')[1];
//             return period.charAt(0).toUpperCase() + period.slice(1);
//         }
//     );
//     const maxPeriod = d3.greatest(workByPeriod, (d) => d[1])?.[0];
//     dl.append('dt').text('Most Work is Done');
//     dl.append('dd').text(maxPeriod);
// }

// document.addEventListener('DOMContentLoaded', async () => {
//   await loadData();
//   createScatterplot();

//   // add new
//   const slider = document.getElementById('commit-slider');
//     const selectedTime = document.getElementById('selected-time');

//     selectedTime.textContent = commitMaxTime.toLocaleString('en', {
//         dateStyle: 'long',
//         timeStyle: 'short',
//     });

//     slider.addEventListener('input', (event) => {
//         commitProgress = event.target.value;
//         commitMaxTime = timeScale.invert(commitProgress);

//         selectedTime.textContent = commitMaxTime.toLocaleString('en', {
//             dateStyle: 'long',
//             timeStyle: 'short',
//         });

//         updateScatterplot();
//     });
// });

// function updateScatterplot() {
//     filteredCommits = commits.filter(d => d.datetime <= commitMaxTime);

//     // Update the scatterplot with filtered commits
//     const dots = d3.select('.dots');
//     dots.selectAll('circle')
//         .data(filteredCommits)
//         .join('circle')
//         .attr('cx', (d) => xScale(d.datetime))
//         .attr('cy', (d) => yScale(d.hourFrac))
//         .attr('r', (d) => rScale(d.totalLines))
//         .attr('fill', 'steelblue')
//         .style('fill-opacity', 0.7)
//         .on('mouseenter', function (event, commit) {
//             updateTooltipContent(commit);
//             updateTooltipVisibility(true);
//             updateTooltipPosition(event);

//             d3.select(event.currentTarget).classed('selected', isCommitSelected(commit));
//         })
//         .on('mouseleave', () => {
//             updateTooltipContent({});
//             updateTooltipVisibility(false);

//             d3.select(event.currentTarget).classed('selected', false);
//         });
// }

// const width = 1400;
// const height = 600;

// function createScatterplot() {
//     const svg = d3
//     .select('#chart')
//     .append('svg')
//     .attr('viewBox', `0 0 ${width} ${height}`)
//     .style('overflow', 'visible');

//     const margin = { top: 10, right: 10, bottom: 30, left: 20 };

//     const usableArea = {
//         top: margin.top,
//         right: width - margin.right,
//         bottom: height - margin.bottom,
//         left: margin.left,
//         width: width - margin.left - margin.right,
//         height: height - margin.top - margin.bottom,
//     };
    

//     xScale = d3
//     .scaleTime()
//     .domain(d3.extent(commits, (d) => d.datetime))
//     .range([0, width])
//     .nice();

//     yScale = d3.scaleLinear().domain([0, 24]).range([height, 0]);

//     const xAxis = d3.axisBottom(xScale);
//     // const yAxis = d3.axisLeft(yScale);
//     const yAxis = d3
//     .axisLeft(yScale)
//     .tickFormat((d) => String(d % 24).padStart(2, '0') + ':00');

//     // Update scales with new ranges
//     xScale.range([usableArea.left, usableArea.right]);
//     yScale.range([usableArea.bottom, usableArea.top]);

//     // Add gridlines BEFORE the axes
//     const gridlines = svg
//     .append('g')
//     .attr('class', 'gridlines')
//     .attr('transform', `translate(${usableArea.left}, 0)`);

//     // Create gridlines as an axis with no labels and full-width ticks
//     gridlines.call(d3.axisLeft(yScale).tickFormat('').tickSize(-usableArea.width));

//     const timeColorScale = d3
//     .scaleLinear()
//     .domain([0, 6, 12, 18, 24])
//     .range(['#1e3a5f', '#6a4f9c', '#ffb84c', '#6a4f9c', '#1e3a5f']);

//     gridlines.selectAll('line')
//     .attr('stroke', (d) => timeColorScale(d));

//     // Add X axis
//     svg
//     .append('g')
//     .attr('transform', `translate(0, ${usableArea.bottom})`)
//     .call(xAxis);

//     // Add Y axis
//     svg
//     .append('g')
//     .attr('transform', `translate(${usableArea.left}, 0)`)
//     .call(yAxis);

//     const [minLines, maxLines] = d3.extent(commits, (d) => d.totalLines);
//     rScale = d3.scaleSqrt().domain([minLines, maxLines]).range([5, 15]); // adjust these values based on your experimentation
//     const sortedCommits = d3.sort(commits, (d) => -d.totalLines);

//     const dots = svg.append('g').attr('class', 'dots');

//     dots
//     .selectAll('circle')
//     // .data(commits)
//     .data(sortedCommits)
//     .join('circle')
//     .attr('cx', (d) => xScale(d.datetime))
//     .attr('cy', (d) => yScale(d.hourFrac))
//     // .attr('r', 5)
//     .attr('r', (d) => rScale(d.totalLines))
//     .attr('fill', 'steelblue')
//     .style('fill-opacity', 0.7)
//     .on('mouseenter', function(event, commit) {
//         updateTooltipContent(commit);
//         updateTooltipVisibility(true);
//         updateTooltipPosition(event);

//         d3.select(event.currentTarget).classed('selected', isCommitSelected(commit));
//     })
//     .on('mouseleave', () => {
//         updateTooltipContent({}); // Clear tooltip content
//         updateTooltipVisibility(false);

//         d3.select(event.currentTarget).classed('selected', false);
//     });

//     function brushSelector() {
//         const svg = document.querySelector('svg');
//         // d3.select(svg).call(d3.brush());
//         d3.select(svg).call(d3.brush().on('start brush end', brushed));
//         // Raise dots and everything after overlay
//         d3.select(svg).selectAll('.dots, .overlay ~ *').raise();
//     }

//     let brushSelection = null;

//     // function brushed(event) {
//     // brushSelection = event.selection;
//     // updateSelection();
//     // updateSelectionCount();
//     // updateLanguageBreakdown();
//     // }

//     function brushed(event) {
//         let brushSelection = event.selection;
//         selectedCommits = !brushSelection
//           ? []
//           : commits.filter((commit) => {
//               let min = { x: brushSelection[0][0], y: brushSelection[0][1] };
//               let max = { x: brushSelection[1][0], y: brushSelection[1][1] };
//               let x = xScale(commit.datetime);
//               let y = yScale(commit.hourFrac);
      
//               return x >= min.x && x <= max.x && y >= min.y && y <= max.y;
//             });

//         updateSelection();
//         updateSelectionCount();
//         updateLanguageBreakdown();
//     }
      

//     // function isCommitSelected(commit) {
//     // if (!brushSelection) {
//     //     return false;
//     // }
//     // // return true if commit is within brushSelection
//     // // and false if not
//     // const min = { x: brushSelection[0][0], y: brushSelection[0][1] };
//     // const max = { x: brushSelection[1][0], y: brushSelection[1][1] };
//     // const x = xScale(commit.datetime); // Use xScale for commit datetime
//     // const y = yScale(commit.hourFrac); // Use yScale for hourFrac
//     // return x >= min.x && x <= max.x && y >= min.y && y <= max.y;
//     // }

//     function isCommitSelected(commit) {
//         return selectedCommits.includes(commit);
//     }

//     function updateSelection() {
//     // Update visual state of dots based on selection
//     d3.selectAll('circle').classed('selected', (d) => isCommitSelected(d));
//     }

//     function updateSelectionCount() {
//         // const selectedCommits = brushSelection
//         //   ? commits.filter(isCommitSelected)
//         //   : [];
      
//         const countElement = document.getElementById('selection-count');
//         countElement.textContent = `${
//           selectedCommits.length || 'No'
//         } commits selected`;
      
//         return selectedCommits;
//     }

//     function updateLanguageBreakdown() {
//         // const selectedCommits = brushSelection
//         //   ? commits.filter(isCommitSelected)
//         //   : [];

//         const container = document.getElementById('language-breakdown');
      
//         if (selectedCommits.length === 0) {
//           container.innerHTML = '';
//           return;
//         }
//         const requiredCommits = selectedCommits.length ? selectedCommits : commits;
//         const lines = requiredCommits.flatMap((d) => d.lines);
      
//         // Use d3.rollup to count lines per language
//         const breakdown = d3.rollup(
//           lines,
//           (v) => v.length,
//           (d) => d.type
//         );
      
//         // Update DOM with breakdown
//         container.innerHTML = '';
      
//         for (const [language, count] of breakdown) {
//           const proportion = count / lines.length;
//           const formatted = d3.format('.1~%')(proportion);
      
//           container.innerHTML += `
//                   <dt>${language}</dt>
//                   <dd>${count} lines (${formatted})</dd>
//               `;
//         }
      
//         return breakdown;
//     }

//     brushSelector();
//     updateScatterplot();
// }

// function updateTooltipContent(commit) {
//     const link = document.getElementById('commit-link');
//     const date = document.getElementById('commit-date');
//     const time = document.getElementById('commit-time');
//     const author = document.getElementById('commit-author');
//     const lines = document.getElementById('commit-lines');
  
//     if (Object.keys(commit).length === 0) return;
  
//     link.href = commit.url;
//     link.textContent = commit.id;
//     date.textContent = commit.datetime?.toLocaleString('en', {
//       dateStyle: 'full',
//     });
//     time.textContent = commit.datetime?.toLocaleString('en', { hour: '2-digit', minute: '2-digit' });
//     author.textContent = commit.author;
//     lines.textContent = commit.totalLines;
// }

// function updateTooltipVisibility(isVisible) {
//     const tooltip = document.getElementById('commit-tooltip');
//     tooltip.hidden = !isVisible;
// }

// function updateTooltipPosition(event) {
//     const tooltip = document.getElementById('commit-tooltip');
//     tooltip.style.left = `${event.clientX}px`;
//     tooltip.style.top = `${event.clientY}px`;
// }

let data = [];
let commits = [];
let selectedCommits = [];
let brushSelection = null;

const width = 1400;
const height = 600;

let commitProgress = 100;
let timeScale;
let commitMaxTime;
let xScale;
let yScale;
let rScale;

let filteredCommits = [];

// let fileTypeColors = d3.scaleOrdinal(d3.schemeSet2);
let fileTypeColors = d3.scaleOrdinal(d3.schemeTableau10);

// add new
let NUM_ITEMS;// = 100; // Ideally, let this value be the length of your commit history
let ITEM_HEIGHT = 100; // Feel free to change
let VISIBLE_COUNT = 10; // Feel free to change as well
let totalHeight; //= (NUM_ITEMS - 1) * ITEM_HEIGHT;
const scrollContainer = d3.select('#scroll-container');
const spacer = d3.select('#spacer');
// spacer.style('height', `${totalHeight}px`);
const itemsContainer = d3.select('#items-container');
scrollContainer.on('scroll', () => {
  const scrollTop = scrollContainer.property('scrollTop');
  let startIndex = Math.floor(scrollTop / ITEM_HEIGHT);
  startIndex = Math.max(0, Math.min(startIndex, commits.length - VISIBLE_COUNT));
  renderItems(startIndex);
});

// let NUM_ITEMS_FILES; // Will be set to the number of files
// let ITEM_HEIGHT_FILES = 100; // Height of each file item in pixels
// let VISIBLE_COUNT_FILES = 10; // Number of visible file items at a time
// let totalHeightFiles; // Total height of the scroll container for files
// const filesScrollContainer = d3.select('#files-scroll-container');
// const filesSpacer = d3.select('#files-spacer');
// const filesItemsContainer = d3.select('#files-items-container');


async function loadData() {
    data = await d3.csv('loc.csv', (row) => ({
        ...row,
        line: Number(row.line),
        depth: Number(row.depth),
        length: Number(row.length),
        date: new Date(row.date + 'T00:00' + row.timezone),
        datetime: new Date(row.datetime),
    }));

    displayStats();
}

function processCommits() {
    commits = d3
        .groups(data, (d) => d.commit)
        .map(([commit, lines]) => {
            let first = lines[0];
            let { author, date, time, timezone, datetime } = first;
            let ret = {
                id: commit,
                url: 'https://github.com/pelicheng/portfolio/commit/' + commit,
                author,
                date,
                time,
                timezone,
                datetime,
                hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
                totalLines: lines.length,
            };

            Object.defineProperty(ret, 'lines', {
                value: lines,
                configurable: true,
                writable: true,
                enumerable: false,
            });

            return ret;
        });

    commits.sort((a, b) => a.datetime - b.datetime);

    NUM_ITEMS = commits.length;
    totalHeight = (NUM_ITEMS - 1) * ITEM_HEIGHT;
    spacer.style('height', `${totalHeight}px`);

    timeScale = d3.scaleTime()
        .domain([d3.min(commits, d => d.datetime), d3.max(commits, d => d.datetime)])
        .range([0, 100]);

    commitMaxTime = timeScale.invert(commitProgress);
}

function displayStats() {
    // Process commits first
    processCommits();

    // Create the dl element
    const dl = d3.select('#stats').append('dl').attr('class', 'stats');

    // Add total LOC
    dl.append('dt').html('Total <abbr title="Lines of code">LOC</abbr>');
    dl.append('dd').text(data.length);

    // Add total commits
    dl.append('dt').text('Commits');
    dl.append('dd').text(commits.length);

    // Add more stats as needed...
    const maxDepth = d3.max(data, (d) => d.depth);
    dl.append('dt').text('Max Depth');
    dl.append('dd').text(maxDepth);

    const numFiles = d3.group(data, (d) => d.file).size;
    dl.append('dt').text('Files');
    dl.append('dd').text(numFiles);

    const fileLengths = d3.rollups(
        data,
        (v) => d3.max(v, (v) => v.line),
        (d) => d.file
    );
    const averageFileLength = d3.mean(fileLengths, (d) => d[1]);
    dl.append('dt').text('Average File Length (lines)');
    dl.append('dd').text(averageFileLength.toFixed(2));

    const workByPeriod = d3.rollups(
        data,
        (v) => v.length,
        (d) => {
            const dateStr = new Date(d.datetime).toLocaleString('en', { dayPeriod: 'short' });
            const period = dateStr.split(' ')[1];
            return period.charAt(0).toUpperCase() + period.slice(1);
        }
    );
    const maxPeriod = d3.greatest(workByPeriod, (d) => d[1])?.[0];
    dl.append('dt').text('Most Work is Done');
    dl.append('dd').text(maxPeriod);
}

function updateScatterplot(filteredCommits) {
    d3.select('svg').remove();

    const svg = d3.select('#chart')
        .append('svg')
        .attr('viewBox', `0 0 ${width} ${height}`)
        .style('overflow', 'visible');

    const margin = { top: 10, right: 10, bottom: 30, left: 20 };
    const usableArea = {
        top: margin.top,
        right: width - margin.right,
        bottom: height - margin.bottom,
        left: margin.left,
        width: width - margin.left - margin.right,
        height: height - margin.top - margin.bottom,
    };

    xScale = d3.scaleTime()
        .domain(d3.extent(filteredCommits, (d) => d.datetime))
        .range([usableArea.left, usableArea.right])
        .nice();

    yScale = d3.scaleLinear()
        .domain([0, 24])
        .range([usableArea.bottom, usableArea.top]);

    const [minLines, maxLines] = d3.extent(filteredCommits, (d) => d.totalLines);
    rScale = d3.scaleSqrt()
        .domain([minLines, maxLines])
        .range([5, 15]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale)
        .tickFormat((d) => String(d % 24).padStart(2, '0') + ':00');

    svg.append('g')
        .attr('transform', `translate(0, ${usableArea.bottom})`)
        .call(xAxis);

    svg.append('g')
        .attr('transform', `translate(${usableArea.left}, 0)`)
        .call(yAxis);

    const gridlines = svg.append('g')
        .attr('class', 'gridlines')
        .attr('transform', `translate(${usableArea.left}, 0)`);

    gridlines.call(d3.axisLeft(yScale).tickFormat('').tickSize(-usableArea.width));

    const timeColorScale = d3
        .scaleLinear()
        .domain([0, 6, 12, 18, 24])
        .range(['#1e3a5f', '#6a4f9c', '#ffb84c', '#6a4f9c', '#1e3a5f']);

    gridlines.selectAll('line')
        .attr('stroke', (d) => timeColorScale(d));

    const sortedCommits = d3.sort(filteredCommits, (d) => -d.totalLines);

    const dots = svg.append('g').attr('class', 'dots');

    dots.selectAll('circle')
        .data(sortedCommits)
        .join('circle')
        .attr('cx', (d) => xScale(d.datetime))
        .attr('cy', (d) => yScale(d.hourFrac))
        .attr('r', (d) => rScale(d.totalLines))
        .attr('fill', 'steelblue')
        .style('fill-opacity', 0.7)
        .on('mouseenter', function (event, commit) {
            updateTooltipContent(commit);
            updateTooltipVisibility(true);
            updateTooltipPosition(event);

            d3.select(event.currentTarget).classed('selected', isCommitSelected(commit));
        })
        .on('mouseleave', () => {
            updateTooltipContent({});
            updateTooltipVisibility(false);

            d3.select(event.currentTarget).classed('selected', false);
        });

    // Enable brushing functionality
    brushSelector();
}

function brushSelector() {
    const svg = document.querySelector('svg');
    d3.select(svg).call(d3.brush().on('start brush end', brushed));
    d3.select(svg).selectAll('.dots, .overlay ~ *').raise();
}

function brushed(event) {
    brushSelection = event.selection;
    console.log('Brush Selection:', brushSelection);
    selectedCommits = !brushSelection
        ? []
        : filteredCommits.filter((commit) => {
            let min = { x: brushSelection[0][0], y: brushSelection[0][1] };
            let max = { x: brushSelection[1][0], y: brushSelection[1][1] };
            let x = xScale(commit.datetime);
            let y = yScale(commit.hourFrac);

            console.log('Commit:', commit.id, 'x:', x, 'y:', y);
            console.log('Min:', min, 'Max:', max);

            return x >= min.x && x <= max.x && y >= min.y && y <= max.y;
        });

    console.log('Selected Commits:', selectedCommits);

    updateSelection();
    updateSelectionCount();
    updateLanguageBreakdown();
}

function isCommitSelected(commit) {
    return selectedCommits.includes(commit);
}

function updateSelection() {
    d3.selectAll('circle').classed('selected', (d) => isCommitSelected(d));
}

function updateSelectionCount() {
    const countElement = document.getElementById('selection-count');
    countElement.textContent = `${
        selectedCommits.length || 'No'
    } commits selected`;

    return selectedCommits;
}  

function updateLanguageBreakdown() {
    const container = document.getElementById('language-breakdown');
    
    if (selectedCommits.length === 0) {
        container.innerHTML = '';
        return;
    }

    const requiredCommits = selectedCommits.length ? selectedCommits : commits;
    const lines = requiredCommits.flatMap((d) => d.lines);

    const breakdown = d3.rollup(
        lines,
        (v) => v.length,
        (d) => d.type
    );

    container.innerHTML = '';

    for (const [language, count] of breakdown) {
        const proportion = count / lines.length;
        const formatted = d3.format('.1~%')(proportion);

        container.innerHTML += `
            <dt>${language}</dt>
            <dd>${count} lines (${formatted})</dd>
        `;
    }

    return breakdown;
}

function updateTooltipContent(commit) {
    const link = document.getElementById('commit-link');
    const date = document.getElementById('commit-date');
    const time = document.getElementById('commit-time');
    const author = document.getElementById('commit-author');
    const lines = document.getElementById('commit-lines');

    if (Object.keys(commit).length === 0) return;

    link.href = commit.url;
    link.textContent = commit.id;
    date.textContent = commit.datetime?.toLocaleString('en', {
        dateStyle: 'full',
    });
    time.textContent = commit.datetime?.toLocaleString('en', { hour: '2-digit', minute: '2-digit' });
    author.textContent = commit.author;
    lines.textContent = commit.totalLines;
}

function updateTooltipVisibility(isVisible) {
    const tooltip = document.getElementById('commit-tooltip');
    tooltip.hidden = !isVisible;
}

function updateTooltipPosition(event) {
    const tooltip = document.getElementById('commit-tooltip');
    tooltip.style.left = `${event.clientX}px`;
    tooltip.style.top = `${event.clientY}px`;
}

function filterCommitsByTime() {
    filteredCommits = commits.filter(d => d.datetime <= commitMaxTime);

    // add new
    let lines = filteredCommits.flatMap((d) => d.lines);
    let files = [];
    files = d3
        .groups(lines, (d) => d.file)
        .map(([name, lines]) => {
            return { name, lines };
        });

    files = d3.sort(files, (d) => -d.lines.length);

    displayFiles(files)
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadData();

    filterCommitsByTime();
    updateScatterplot(filteredCommits);

    const slider = document.getElementById('commit-slider');
    const selectedTime = document.getElementById('selected-time');

    selectedTime.textContent = commitMaxTime.toLocaleString('en', {
        dateStyle: 'long',
        timeStyle: 'short',
    });

    slider.addEventListener('input', (event) => {
        commitProgress = event.target.value;
        commitMaxTime = timeScale.invert(commitProgress);

        selectedTime.textContent = commitMaxTime.toLocaleString('en', {
            dateStyle: 'long',
            timeStyle: 'short',
        });

        filterCommitsByTime(); 
        updateScatterplot(filteredCommits); 
    });

    // initializeFileSizesScrolly();
});

function displayFiles(files) {
    // Step 1: Clear the existing file list
    d3.select('.files').selectAll('div').remove();

    // Step 2: Bind the data to div elements and append them
    let filesContainer = d3.select('.files')
        .selectAll('div')
        .data(files)
        .enter()
        .append('div');

    // Step 3: Append the <dt> and <dd> elements
    filesContainer.append('dt')
        .html(d => `<code>${d.name}</code><small>${d.lines.length} lines</small>`);
        // .text(d => d.name); // Display the file name

    filesContainer.append('dd')
        .attr('class', 'unit-vis')
        .selectAll('div')
        .data(d => d.lines)
        .enter()
        .append('div')
        .attr('class', 'line')
        .style('background', d => fileTypeColors(d.type));
        // .text(d => `${d.lines.length} lines`);
}

// function renderItems(startIndex) {
//     // Clear things off
//     itemsContainer.selectAll('div').remove();
//     const endIndex = Math.min(startIndex + VISIBLE_COUNT, commits.length);
//     let newCommitSlice = commits.slice(startIndex, endIndex);
    
//     updateScatterplot(newCommitSlice);
//     displayCommitFiles(newCommitSlice);

//     itemsContainer.selectAll('div')
//     .data(newCommitSlice)
//     .enter()
//     .append('div')
//     .attr('class', 'item')
//     .html((d, index) => `
//       <p>
//         On ${d.datetime.toLocaleString("en", { dateStyle: "full", timeStyle: "short" })}, I made
//         <a href="${d.url}" target="_blank">
//           ${index > 0 ? 'another glorious commit' : 'my first commit, and it was glorious'}
//         </a>. I edited ${d.totalLines} lines across ${d3.rollups(d.lines, D => D.length, d => d.file).length} files.
//       </p>
//     `)
//     .style('position', 'absolute')
//     .style('top', (_, idx) => `${idx * ITEM_HEIGHT}px`);
    
// }

// function renderItems(startIndex) {
//     // Clear previous items
//     itemsContainer.selectAll('div').remove();
  
//     // Calculate the end index for the visible slice of commits
//     const endIndex = Math.min(startIndex + VISIBLE_COUNT, commits.length);
//     let newCommitSlice = commits.slice(startIndex, endIndex);
  
//     // Update the scatterplot with the new slice of commits
//     updateScatterplot(newCommitSlice);
  
//     // Update the file display with the new slice of commits
//     displayCommitFiles(newCommitSlice);
  
//     // Bind the new slice of commits to the items container
//     itemsContainer.selectAll('div')
//       .data(newCommitSlice)
//       .enter()
//       .append('div')
//       .attr('class', 'item')
//       .html((d, index) => `
//         <p>
//           On ${d.datetime.toLocaleString("en", { dateStyle: "full", timeStyle: "short" })}, I made
//           <a href="${d.url}" target="_blank">
//             ${index > 0 ? 'another glorious commit' : 'my first commit, and it was glorious'}
//           </a>. I edited ${d.totalLines} lines across ${d3.rollups(d.lines, D => D.length, d => d.file).length} files.
//         </p>
//       `)
//       .style('position', 'absolute')
//       .style('top', (_, idx) => `${(startIndex + idx) * ITEM_HEIGHT}px`); // Fix: Use startIndex + idx
// }

function renderItems(startIndex) {
    // Clear previous items
    itemsContainer.selectAll('div').remove();
  
    // Calculate the end index for the visible slice of commits
    const endIndex = Math.min(startIndex + VISIBLE_COUNT, commits.length);
    let newCommitSlice = commits.slice(startIndex, endIndex);
  
    // Update filteredCommits with the new slice
    filteredCommits = newCommitSlice;
  
    // Update the scatterplot with the new slice of commits
    updateScatterplot(filteredCommits);
  
    // Update the file display with the new slice of commits
    displayCommitFiles(filteredCommits);
  
    // Bind the new slice of commits to the items container
    itemsContainer.selectAll('div')
      .data(newCommitSlice)
      .enter()
      .append('div')
      .attr('class', 'item')
      .html((d, index) => `
        <p>
          On ${d.datetime.toLocaleString("en", { dateStyle: "full", timeStyle: "short" })}, I made
          <a href="${d.url}" target="_blank">
            ${index > 0 ? 'another glorious commit' : 'my first commit, and it was glorious'}
          </a>. I edited ${d.totalLines} lines across ${d3.rollups(d.lines, D => D.length, d => d.file).length} files.
        </p>
      `)
      .style('position', 'absolute')
      .style('top', (_, idx) => `${(startIndex + idx) * ITEM_HEIGHT}px`); // Fix: Use startIndex + idx
}

// function displayCommitFiles(filteredCommits) {
//     const lines = filteredCommits.flatMap((d) => d.lines);
//     // let fileTypeColors = d3.scaleOrdinal(d3.schemeTableau10);
//     let files = d3.groups(lines, (d) => d.file).map(([name, lines]) => {
//       return { name, lines };
//     });
//     files = d3.sort(files, (d) => -d.lines.length);
//     d3.select('.files').selectAll('div').remove();
//     let filesContainer = d3.select('.files').selectAll('div').data(files).enter().append('div');
//     filesContainer.append('dt').html(d => `<code>${d.name}</code><small>${d.lines.length} lines</small>`);
//     filesContainer.append('dd')
//                   .selectAll('div')
//                   .data(d => d.lines)
//                   .enter()
//                   .append('div')
//                   .attr('class', 'line')
//                   .style('background', d => fileTypeColors(d.type));
// }

