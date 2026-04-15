import { pool } from "../config/database"

const getAllProjects = async (req, res) => {
    try {
        const projects = await pool.query(`SELECT * FROM projects`);
        res.status(200).json(projects.rows);
    }
    catch (err) {
        res.status(409).json({ message: 'Error fetching projects', error: err.message });    
    }
}

const getProjectById = async (req, res) => {
    const projectId = req.params.id;
    try {
        const project = await pool.query(`SELECT * FROM projects WHERE id = $1`, [projectId]);
        if (project.rows.length === 0) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.status(200).json(project.rows[0]);
    }
    catch (err) {
        res.status(409).json({ message: 'Error fetching project', error: err.message });    
    }
}

const createProject = async (req, res) => {
    const id = req.user.id;
    const {title, description, tech_stack, demo_url, collaborators, links, license, md_content} = req.body;
    try {
        const newProject = await pool.query(`
            INSERT INTO projects (profile_id, title, description, tech_stack, demo_url, collaborators, links, license, md_content)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
            RETURNING *`, 
            [id, title, description, tech_stack, demo_url, collaborators, links, license, md_content]
        )
        res.status(201).json(newProject.rows[0]);
    }
    catch (err){
        res.status(409).json({ message: 'Error creating project', error: err.message });
    }
}

const updateProject = async (req, res) => {
    const userId = req.user.id;
    const projectId = req.params.id;
    const {title, description, tech_stack, demo_url, collaborators, links, license, md_content} = req.body;
    try {
        const updatedProject = await pool.query(`    
            UPDATE projects
            SET title = $1, description = $2, tech_stack = $3, demo_url = $4, collaborators = $5, links = $6, license = $7, md_content = $8
            WHERE id = $9 AND profile_id = $10
            RETURNING *`, 
            [title, description, tech_stack, demo_url, collaborators, links, license, md_content, projectId, userId]
        )

        if (updatedProject.rows.length === 0) {
            return res.status(404).json({ message: 'Project not found or unauthorized' });
        }
        res.status(200).json(updatedProject.rows[0]);
    }
    catch (err){
        res.status(409).json({ message: 'Error updating project', error: err.message });
    }
}

const deleteProject = async (req, res) => {
    const userId = req.user.id;
    const projectId = req.params.id;
    try {
        const deletedProject = await pool.query(`
            DELETE FROM projects
            WHERE id = $1 AND profile_id = $2
            RETURNING *`, 
            [projectId, userId]
        )

        if (deletedProject.rows.length === 0) {
            return res.status(404).json({ message: 'Project not found or unauthorized' });
        }
        res.status(200).json({ message: 'Project deleted successfully' });
    }
    catch (err){
        res.status(409).json({ message: 'Error deleting project', error: err.message });
    }
}

export default {
    getAllProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject
}