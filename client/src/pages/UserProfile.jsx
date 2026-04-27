import { useState, useEffect } from "react";
import { Link, Outlet, useParams, useLocation } from "react-router-dom";
import useAuthSession from "../hooks/useAuthSession";

const UserProfile = () => {
  const { id } = useParams();
  const location = useLocation();
  const { user: authUser } = useAuthSession();
  const [user, setuser] = useState(null);

  useEffect(() => {
    //fetch user data, projects, and bookmarks here
    const fetchProfileData = async () => {
      try {
        // Fetch profile by user_id
        const profileRes = await fetch(`/api/profiles/user/${id}`);
        const profile = await profileRes.json();

        //Combine Github OAuth + profile data => row
        setuser({ gh: authUser, profile });

      } catch (error) {
        console.error("Error fetching user:" , error);
      }
    };

    if (authUser) fetchProfileData();
  }, [id, authUser]);

  //Highlight active tab
  const isActive = (path) =>
    location.pathname === `/profile/${id}${path ? `/${path}` : ""}`;

  if (!user) return <p>Loading...</p>;

  return (
    <div className="container flex-col gap-8 my-2 p-4 bg-gray-100 rounded-lg">

      {/* Header*/}
      <div className="header flex items-center gap-4">
        <img src={user?.gh?.avatar_url || "https://placehold.co/400"} alt="user" className="w-32 h-32 rounded-full mb-4"
        />

        <div className="flex flex-col items-start gap-2">
          <h1 className="heading-lg">{user?.gh?.username}</h1>
          <p className="body-md">{user?.profile?.location}</p>
          <button>Collaborate</button>
          <Link to={`/profile/user/${id}/edit`} className="my-2">Edit Profile</Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="profile-nav">
        <ul className="flex gap-8 my-2">
          <li>
            <Link
              to={`/profile/user/${id}`}
              className={isActive("") ? "font-bold underline" : ""}
            >
              About
            </Link>
          </li>
          <li>
            <Link
              to={`/profile/user/${id}/projects`}
              className={isActive("projects") ? "font-bold underline" : ""}
            >
              Projects
            </Link>
          </li>
          {/* <li>
            <Link
              to={`/profile/user/${id}/bookmarks`}
              className={isActive("bookmarks") ? "font-bold underline" : ""}
            >
              Bookmarks
            </Link>
          </li> */}
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
