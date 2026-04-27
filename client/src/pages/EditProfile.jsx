import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import profileService from "../services/profileService";
import { notifyError, notifySuccess } from "../utils/notifications";

const EditProfile = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [profileData, setProfileData] = useState({
        bio: '',
        location: '',
        github_url: '',
        linkedin_url: '',
        other_url: ''
    });

    const [loading, setLoading] = useState(true);

    //Load existing profile data
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await profileService.getProfileByUserId(id);
                setProfileData({
                bio: res.bio || '',
                location: res.location || '',
                github_url: res.github_url || '',
                linkedin_url: res.linkedin_url || '',
                other_url: res.other_url || ''
            });
            setLoading(false);

            } catch (err) {
                console.error("Error fetching profile:", err);
                notifyError("Unable to load profile data.");
            }
        };

        fetchProfile();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await profileService.updateProfile(id, {...profileData,
                is_complete: true
        });
            notifySuccess('Profile updated successfully!');
            navigate(`/profile/${id}`);
        } catch (error) {
            console.error('Error updating profile:', error);
            notifyError("Server error updating profile. Please try again.");
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="form-container">

            <h2 className="heading-lg mb-4 text-center">Edit Profile</h2>

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
                    Save Changes
                </button>

            </form>
        </div>
    );
};

export default EditProfile;
