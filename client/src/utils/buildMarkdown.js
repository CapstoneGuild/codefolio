/*Utility function to build markdown template from 'CreateProject' form input and helper functions to format the markdown content.*/

export function buildmarkdown(project) {
    return `
${project.image_url ? `<p align="center"><img src="${project.image_url}" alt="Project Image" width="600" style="max-width: 100%; height: auto;" /></p>`: ""}

# ${project.title}

**${project.description}**


## Demonstration
${project.demo_url}


## Tech Stack
${formatTechStack(project.tech_stack)}


## Collaborators
${project.collaborators}


## Links
${formatLinks(project.links)}


## License
${project.license}

    `;
};

// formats links from comma-separated list to md bullets
function formatLinks(linkString) {
    if (!linkString) return "";

    return linkString
        .split(",")
        .map(link => link.trim())
        .filter(link => link.length > 0)
        .map(link => `- ${link}`)
        .join("\n");
};

// formats tech stack from comma-separated list to md badges
function formatTechStack(stackString) {
    if (!stackString) return "";

    return stackString
        .split(",")
        .map(s => s.trim().toUpperCase())
        .filter(s => s.length > 0)
        .map(s => `![${s}](https://img.shields.io/badge/${encodeURIComponent(s)}-teal?style=for-the-badge)`)
        .join(" ");
};
