import React, { useEffect, useState } from "react";
import { TbCircleDashed } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { followUserAction, unFollowUserAction } from "../../Redux/User/Action";

const UserDetailCard = ({ user, isRequser, isFollowing }) => {
  const token = localStorage.getItem("token");
  const { post } = useSelector((store) => store);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isFollow, setIsFollow] = useState(false);

  const goToAccountEdit = () => navigate("/account/edit");

  const data = { jwt: token, userId: user?.id };

  const handleFollowUser = () => {
    dispatch(followUserAction(data));
    setIsFollow(true);
  };

  const handleUnFollowUser = () => {
    dispatch(unFollowUserAction(data));
    setIsFollow(false);
  };

  useEffect(() => {
    setIsFollow(isFollowing);
  }, [isFollowing]);

  return (
    <div className="py-8 px-4 bg-white shadow-md rounded-xl">
      <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-6 sm:space-y-0 sm:space-x-8">
        {/* Profile Image */}
        <img
          className="h-24 w-24 sm:h-32 sm:w-32 rounded-full object-cover border-2 border-sky-200 shadow-sm"
          src={
            user?.image ||
            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
          }
          alt="Profile"
        />

        {/* Details */}
        <div className="flex-1 space-y-4">
          {/* Top row */}
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-xl font-semibold">{user?.username}</p>

            {isRequser ? (
              <button
                onClick={goToAccountEdit}
                className="bg-sky-100 text-sky-600 hover:bg-sky-200 px-4 py-1 text-sm rounded transition"
              >
                Edit Profile
              </button>
            ) : (
              <button
                onClick={isFollow ? handleUnFollowUser : handleFollowUser}
                className={`${
                  isFollow
                    ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    : "bg-sky-100 text-sky-600 hover:bg-sky-200"
                } px-4 py-1 text-sm rounded transition`}
              >
                {isFollow ? "Unfollow" : "Follow"}
              </button>
            )}

            <button className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-1 text-sm rounded transition">
              {isRequser ? "Add Tools" : "Message"}
            </button>

            <TbCircleDashed className="text-xl text-gray-500" />
          </div>

          {/* Stats */}
          <div className="flex space-x-8 text-sm text-gray-600">
            <div>
              <span className="font-semibold text-black mr-1">
                {post?.reqUserPost?.length || 0}
              </span>
              Posts
            </div>
            <div>
              <span className="font-semibold text-black mr-1">
                {user?.follower?.length || 0}
              </span>
              Followers
            </div>
            <div>
              <span className="font-semibold text-black mr-1">
                {user?.following?.length || 0}
              </span>
              Following
            </div>
          </div>

          {/* Name and Bio */}
          <div>
            <p className="font-semibold text-black">{user?.name}</p>
            <p className="text-sm text-gray-700">{user?.bio}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailCard;
