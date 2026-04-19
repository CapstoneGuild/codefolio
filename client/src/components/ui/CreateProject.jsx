import { useState, useEffect } from 'react';
import {createProject } from '../../services/projectService.jsx';
import { notifyError, notifySuccess } from '../../utils/notifications.js';

const CreateProject = () => {
    const [project, setproject] = useState({
        title: '',
        description: '',
        tech_stack: '',
        demo_url: '',
        collaborators: '',
        links: '',
        license: '',
        image_url: ''
    });

    //handle form inputs
    const handleChange = (e) => {
        const { name, value } =e.target;
        setproject((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    //handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        //send prject data to backend
        const newProject = {
            ...project,
            title: project.title,
            description: project.description,
            tech_stack: project.tech_stack,
            demo_url: project.demo_url,
            collaborators: project.collaborators,
            links: project.links,
            license: project.license,
            image_url: project.image_url
        };

        try {
            const response = await createProject(newProject);

            if (!response || !response.ok) {
                const errorData = await response.json();
                notifyError(errorData.error || 'Uh-oh, something went wrong.');
                return;
            }
            notifySuccess('Project added successfully!');

            //Reset form after successful submission
            setproject({
                title: '',
                description: '',
                tech_stack: '',
                demo_url: '',
                collaborators: '',
                links: '',
                license: '',
                image_url: ''
            });

        } catch (error) {
            console.error('Error adding project:', error);
            alert("Server error while adding project. Please try again.");
        }
    };


    return (
        <div className="create-project-container">
            <div className="create-project">
                <div className='create-form-header'>
                    <center>
                        <h2>Enter New Project Details</h2>
                    </center><br /><br />
                </div>
                <form class-name="create-project-form" onSubmit={handleSubmit}>
                    <label>Project Title:</label>
                    <input
                        type='text'
                        id='title'
                        name='title'
                        value={project.title}
                        onChange={handleChange}
                        required
                    />
                    <label>Project Description:</label>
                    <input
                        type='text'
                        id='description'
                        name='description'
                        value={project.description}
                        onChange={handleChange}
                        required
                    />
                    <label>Project Tech Stack: Enter each technology separated by a comma</label>
                    <input
                        type='text'
                        id='tech_stack'
                        name='tech_stack'
                        value={project.tech_stack}
                        onChange={handleChange}
                        required
                    />
                    <label>GIF or Video Demonstration URL:</label>
                    <input
                        type='text'
                        id='demo_url'
                        name='demo_url'
                        value={project.demo_url}
                        onChange={handleChange}
                    />
                    <label>Collaborators:</label>
                    <input
                        type='text'
                        id='collaborators'
                        name='collaborators'
                        value={project.collaborators}
                        onChange={handleChange}
                    />
                    <label>Relevant Links: Enter each link separated by a comma</label>
                    <input
                        type='text'
                        id='links'
                        name='links'
                        value={project.links}
                        onChange={handleChange}
                    />
                    <label>Project License</label>
                    <input
                        type='text'
                        id='license'
                        name='license'
                        value={project.license}
                        onChange={handleChange}
                    />
                    <label>Project Image URL:</label>
                    <input
                        type='text'
                        id='image_url'
                        name='image_url'
                        value={project.image_url}
                        onChange={handleChange}
                    />
                </form>
            </div>
        </div>
    );
};

export default CreateProject;
