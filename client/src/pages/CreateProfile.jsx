import { useState } from "react";
import { useNavigate } from "react-router";
import profileServive from "../services/profileService";
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

        const newProfile = profileData;

        try {
            const response = await profileService.createProfile(newProfile);

            if (!response || !response.ok) {
                const errorData = await response.json();
                notifyError(errorData.error || 'Uh-oh, something went wrong.');
                return;
            }
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
            alert("Server error adding profile. Please try again.");
        }
    };

    return (
        <div className="container flex-col gap-8 my-2 p-4 bg-gray-100 rounded-lg">
            <div className="header flex items-center gap-4">
                <h2 className="heading-lg">Create Your Profile</h2>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <label>Profile Bio:</label>
                <input
                    type="text"
                    name="bio"
                    value={profileData.bio}
                    onChange={handleChange}
                />

                <label>Location:</label>
                <input
                    type="text"
                    name="location"
                    value={profileData.location}
                    onChange={handleChange}
                />

                <label>GitHub URL:</label>
                <input
                    type="text"
                    name="github_url"
                    value={profileData.github_url}
                    onChange={handleChange}
                />

                <label>LinkedIn URL:</label>
                <input
                    type="text"
                    name="linkedin_url"
                    value={profileData.linkedin_url}
                    onChange={handleChange}
                />

                <label>Other Link:</label>
                <input
                    type="text"
                    name="other_url"
                    value={profileData.other_url}
                    onChange={handleChange}
                />

                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                    Create Profile
                </button>
            </form>
        </div>
    );
};

export default CreateProfile;
