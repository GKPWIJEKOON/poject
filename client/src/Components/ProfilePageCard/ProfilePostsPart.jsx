import React, { useEffect, useState } from "react";
import { RiVideoLine } from "react-icons/ri";
import { BiBookmark } from "react-icons/bi";
import { AiOutlineTable, AiOutlineUser } from "react-icons/ai";
import ReqUserPostCard from "./ReqUserPostCard";
import { useDispatch, useSelector } from "react-redux";
import { reqUserPostAction } from "../../Redux/Post/Action";

const ProfilePostsPart = ({ user }) => {
  const [activeTab, setActiveTab] = useState("Post");
  const { post } = useSelector((store) => store);
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();

  const tabs = [
    { tab: "Post", icon: <AiOutlineTable className="text-lg" /> },
    { tab: "Reels", icon: <RiVideoLine className="text-lg" /> },
    { tab: "Saved", icon: <BiBookmark className="text-lg" /> },
    { tab: "Tagged", icon: <AiOutlineUser className="text-lg" /> },
  ];

  useEffect(() => {
    if (user?.id && token) {
      dispatch(reqUserPostAction({ jwt: token, userId: user.id }));
    }
  }, [user, post.createdPost]);

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      {/* Tab Bar */}
      <div className="flex justify-center space-x-10 border-t border-b py-2">
        {tabs.map((item) => (
          <button
            key={item.tab}
            onClick={() => setActiveTab(item.tab)}
            className={`flex items-center space-x-2 text-sm font-medium px-4 py-2 rounded-t-md transition-all duration-200
              ${activeTab === item.tab
                ? "text-blue-600 border-b-2 border-blue-500 bg-blue-50"
                : "text-gray-500 hover:text-blue-500 hover:bg-gray-100"
              }`}
          >
            <span>{item.icon}</span>
            <span>{item.tab}</span>
          </button>
        ))}
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
        {activeTab === "Post" && post.reqUserPost?.length > 0 ? (
          post.reqUserPost.map((item, index) => (
            <ReqUserPostCard key={index} post={item} />
          ))
        ) : activeTab === "Saved" && user?.savedPost?.length > 0 ? (
          user.savedPost.map((item, index) => (
            <ReqUserPostCard key={index} post={item} />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 mt-10">
            No {activeTab.toLowerCase()} to display.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePostsPart;
