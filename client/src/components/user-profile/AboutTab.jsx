import { useOutletContext } from "react-router-dom";

const AboutTab = () => {
    const { user } = useOutletContext();
    const profile = user?.profile || user || {};

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="flex-col gap-4 border border-gray-300 rounded-xl p-4 mb-4">
                <h3 className="heading-md">Bio</h3>
                <p className="body-md mb-4">
                    {profile.bio || "No bio provided yet."}
                </p>
            </div>
            <div className="flex-col gap-4 border border-gray-300 rounded-xl p-4 mb-4">
                <h3 className="heading-md">GitHub</h3>
                <p className="body-md mb-4">
                    {profile.github_url && (
                        <a href={profile.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline">
                            GitHub Profile
                        </a>
                    )}
                </p>
            </div>
            <div className="flex-col gap-4 border border-gray-300 rounded-xl p-4 mb-4">
                <h3 className="heading-md">LinkedIn</h3>
                <p className="body-md mb-4">
                    {profile.linkedin_url && (
                        <a href={profile.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline">
                            LinkedIn Profile
                        </a>
                    )}
                </p>
            </div>
            {/* <div className="flex flex-col gap-4 border border-gray-300 rounded-xl p-4 mb-4">
                <h3 className="heading-md">Tech Stack</h3>
                <p className="body-md mb-4">Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, voluptate.</p>
            </div>
            <div className="flex flex-col gap-4 border border-gray-300 rounded-xl p-4 mb-4">
                <h3 className="heading-md">Collaboration Status</h3>
                <p className="body-md mb-4">Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, voluptate.</p>
            </div>
            <div className="flex-col gap-4 border border-gray-300 rounded-xl p-4 mb-4">
                <h3 className="heading-md">What I Want To Build Next</h3>
                <p className="body-md mb-4">Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, voluptate.</p>
            </div>
            <div className="flex-col gap-4 border border-gray-300 rounded-xl p-4 mb-4">
                <h3 className="heading-md">Interests</h3>
                <p className="body-md mb-4">Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, voluptate.</p>
            </div> */}
            <div className="flex-col gap-4 border border-gray-300 rounded-xl p-4 mb-4">
                <h3 className="heading-md">Other Link</h3>
                <p className="body-md mb-4">
                    {profile.other_url && (
                        <a href={profile.other_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline">
                            Other Link
                        </a>
                    )}
                </p>
            </div>
        </div>
    );
};

export default AboutTab;
