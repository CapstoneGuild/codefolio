import { useState, useEffect } from "react";
import { Link, Outlet, useParams, useLocation } from "react-router-dom";

const UserProfile = () => {
  const { id } = useParams();
  const location = useLocation();
  const [user, setuser] = useState(null);

  useEffect(() => {
    //fetch user data, projects, and bookmarks here
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/user/${id}`);
        const data = await response.json();
        setuser(data);

      } catch (error) {
        console.error("Error fetching user:" , error);
      }
    };

    fetchUser();
  }, [id]);

  //Highlight active tab
  const isActive = (path) =>
    location.pathname === `/profile/${id}${path ? `/${path}` : ""}`;

  return (
    <div className="container flex-col gap-8 my-2 p-4 bg-gray-100 rounded-lg">

      {/* Header*/}
      <div className="header flex items-center gap-4">
        <img src="https://placehold.co/400" alt="user" className="w-32 h-32 rounded-full mb-4"
        />

        <div className="flex-col items-center gap-2">
          <h1 className="heading-lg">User Name</h1>
          <p className="body-md">User Role</p>
          <button>Collaborate</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="profile-nav">
        <ul className="flex gap-8 my-2">
          <li>
            <Link
              to={`/profile/${id}`}
              className={isActive("") ? "font-bold underline" : ""}
            >
              About
            </Link>
          </li>
          <li>
            <Link
              to={`/profile/${id}/projects`}
              className={isActive("projects") ? "font-bold underline" : ""}
            >
              Projects
            </Link>
          </li>
          <li>
            <Link
              to={`/profile/${id}/bookmarks`}
              className={isActive("bookmarks") ? "font-bold underline" : ""}
            >
              Bookmarks
            </Link>
          </li>
        </ul>
      </div>

      {/* Dynamic Content */}
      <div className="profile-content m-4">
        <Outlet />
      </div>
    </div>
  );
};

export default UserProfile;
