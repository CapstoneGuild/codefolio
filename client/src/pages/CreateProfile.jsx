import { useState } from "react";
import { useNavigate } from "react-router";
import profileService from "../services/profileService";
import { notifyError, notifySuccess } from "../utils/notifications";

const CreateProfile = () => {
    const navigate = useNavigate();

    const [profileData, setProfileData] = useState({
        bio: '',
        location: '',
        github_url: '',
        linkedin_url: '',
        other_url: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newProfile = {
            ...profileData,
            is_complete: true
        };

        try {
            const response = await profileService.createProfile(newProfile);

            notifySuccess('Profile created successfully!');

            navigate('/projects');

            //reset after successful submission
            setProfileData({
                bio: '',
                location: '',
                github_url: '',
                linkedin_url: '',
                other_url: ''
            });

        } catch (error) {
            console.error('Error creating profile:', error);
            notifyError("Server error adding profile. Please try again.");
        }
    };

    return (
        <div className="form-container">

            <h2 className="heading-lg mb-4 text-center">Create Your Profile</h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                <div className="form-field">
                    <label className="form-label">Profile Bio:</label>
                    <textarea
                        name="bio"
                        value={profileData.bio}
                        onChange={handleChange}
                        className="form-input"
                        rows={4}
                    />
                </div>

                <div className="form-field">
                    <label className="form-label">Location:</label>
                    <input
                        type="text"
                        name="location"
                        value={profileData.location}
                        onChange={handleChange}
                        className="form-input"
                    />
                </div>

                <div className="form-field">
                    <label className="form-label">GitHub URL:</label>
                    <input
                        type="text"
                        name="github_url"
                        value={profileData.github_url}
                        onChange={handleChange}
                        className="form-input"
                    />
                </div>

                <div className="form-field">
                    <label className="form-label">LinkedIn URL:</label>
                    <input
                        type="text"
                        name="linkedin_url"
                        value={profileData.linkedin_url}
                        onChange={handleChange}
                        className="form-input"
                    />
                </div>

                <div className="form-field">
                    <label className="form-label">Other Link:</label>
                    <input
                        type="text"
                        name="other_url"
                        value={profileData.other_url}
                        onChange={handleChange}
                        className="form-input"
                    />
                </div>

                <button
                    type="submit"
                >
                    Create Profile
                </button>

            </form>
        </div>
    );
};

export default CreateProfile;
