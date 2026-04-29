import { useState, useEffect } from "react";
import { Link, Outlet, useParams, useLocation } from "react-router-dom";
import useAuthSession from "../hooks/useAuthSession";
import profileService from "../services/profileService";

const UserProfile = ({ isPublic = false }) => {
  const { id } = useParams();
  const location = useLocation();
  const { user: authUser } = useAuthSession();
  const [user, setuser] = useState(null);
  const isOwnProfile = String(authUser?.id) === String(id);
  const baseRoute = isPublic ? `/profile/${id}` : `/profile/user/${id}`;

  useEffect(() => {
    //fetch user data, projects, and bookmarks here
    const fetchProfileData = async () => {
      try {
        const profileData = await profileService.getProfileByUserId(id);

        //profileData now contains user info (username, avatar_url) + profile data
        setuser(profileData);

      } catch (error) {
        console.error("Error fetching user:" , error);
      }
    };

    if (id) fetchProfileData();
  }, [id]);

  //Highlight active tab
  const isActive = (path) =>
    location.pathname === `${baseRoute}${path ? `/${path}` : ""}`;

  if (!user) return <p>Loading...</p>;

  return (
    <div className="container flex-col gap-8 my-2 p-4 bg-gray-100 rounded-lg">

      {/* Header*/}
      <div className="header flex items-center gap-4">
        <img src={user?.avatar_url || "https://placehold.co/400"} alt="user" className="w-32 h-32 rounded-full mb-4"
        />

        <div className="flex flex-col items-start gap-2">
          <h1 className="heading-lg">{user?.username}</h1>
          <p className="body-md">{user?.location}</p>
          <button>Collaborate</button>
          {!isPublic && isOwnProfile && <Link to={`/profile/user/${id}/edit`} className="my-2">Edit Profile</Link>}
        </div>
      </div>

      {/* Tabs */}
      <div className="profile-nav">
        <ul className="flex gap-8 my-2">
          <li>
            <Link
              to={baseRoute}
              className={isActive("") ? "font-bold underline" : ""}
            >
              About
            </Link>
          </li>
          <li>
            <Link
              to={`${baseRoute}/projects`}
              className={isActive("projects") ? "font-bold underline" : ""}
            >
              Projects
            </Link>
          </li>
          {!isPublic && isOwnProfile && (
            <li>
              <Link
                to={`${baseRoute}/bookmarks`}
                className={isActive("bookmarks") ? "font-bold underline" : ""}
              >
                Bookmarks
              </Link>
            </li>
          )}
        </ul>
      </div>

      {/* Dynamic Content */}
      <div className="profile-content m-4">
        <Outlet context={{ user }} />
      </div>
    </div>
  );
};

export default UserProfile;
