/*Utility function to build markdown template from 'CreateProject' form input and helper functions to format the markdown content.*/

export function buildmarkdown(project) {
    const demoSection = project.demo_url
    ? `## Demonstration
- [Live Demo](${project.demo_url})`
    : `## Demonstration
N/A`;

    return `# ${project.title || "Untitled Project"}

**${project.description || "No description provided."}**

## Tech Stack
${formatTechStack(project.tech_stack) || "N/A"}

${demoSection}

## Collaborators
${formatCollaborators(project.collaborators) || "N/A"}

## Links
${formatLinks(project.links) || "N/A"}

## License
${project.license || "N/A"}
`
}

// formats links from comma-separated list to md bullets
function formatLinks(linkString) {
    if (!linkString) return "";

    const links = linkString
        .split(",")
        .map(link => link.trim())
        .filter(Boolean);

    return links
    .map((link, index) => {
        if (link.includes("github")) return `- [GitHub](${link})`;

        if (link.includes("vercel") || link.includes("netlify") || link.includes(".com")) {
            return `- [Live Demo](${link})`;
        }

        return `- [Link](${link})`;
    })
    .join("\n");
}

// formats collaborators from comma-separated list to md bullets
function formatCollaborators(collaboratorsString) {
    if (!collaboratorsString) return "";

    return collaboratorsString
        .split(",")
        .map(user => user.trim())
        .filter(user => user.length > 0)
        .map(user => `- ${user}`)
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
