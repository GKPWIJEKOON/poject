import { useDisclosure } from "@chakra-ui/hooks";
import React, { useState } from "react";
import { IoReorderThreeOutline } from "react-icons/io5";
import { useNavigate } from "react-router";
import { mainu } from "./SidebarConfig";
import "./Sidebar.css";
import { useSelector } from "react-redux";
import CreatePostModal from "../Post/Create/CreatePostModal";
import CreateReelModal from "../Create/CreateReel";

const Sidebar = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Home");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useSelector((store) => store);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isCreateReelModalOpen, setIsCreateReelModalOpen] = useState(false);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    switch (tab) {
      case "Profile":
        navigate(`/${user.reqUser?.username}`);
        break;
      case "Home":
        navigate("/");
        break;
      case "Create Post":
        onOpen();
        break;
      case "Reels":
        navigate("/reels");
        break;
      case "Create Reels":
        handleOpenCreateReelModal();
        break;
      case "Notifications":
        navigate("/notifications");
        break;
      case "Learning Plan":
        navigate("/learning_plan");
        break;
      case "Learning Progress":
        navigate("/learning-progress");
        break;
      default:
        break;
    }
  };

  const handleClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleCloseCreateReelModal = () => {
    setIsCreateReelModalOpen(false);
  };

  const handleOpenCreateReelModal = () => {
    setIsCreateReelModalOpen(true);
  };

  // Filter out removed tabs
  const filteredMenu = mainu.filter(
    (item) => !["About Us", "Create Story", "Search"].includes(item.title)
  );

  return (
    <>
      <div className="fixed bottom-0 left-0 w-full bg-[#0A0F2C] text-white z-40 border-t border-gray-700 flex justify-between px-6 py-3">
        {filteredMenu.map((item) => (
          <div
            key={item.title}
            onClick={() => handleTabClick(item.title)}
            className={`flex flex-col items-center text-base cursor-pointer px-3 ${
              activeTab === item.title ? "text-blue-400" : "hover:text-blue-300"
            }`}
          >
            <div className="text-2xl">
              {activeTab === item.title ? item.activeIcon : item.icon}
            </div>
            <span className="text-sm mt-1">{item.title}</span>
          </div>
        ))}

        <div
          className="relative flex flex-col items-center text-base cursor-pointer px-3"
          onClick={handleClick}
        >
          <IoReorderThreeOutline className="text-2xl" />
          <span className="text-sm mt-1">More</span>

          {showDropdown && (
            <div className="absolute bottom-10 w-36 bg-white text-black rounded shadow-md">
              <p
                onClick={handleLogout}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm border-b"
              >
                Log out
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Create Post Modal */}
      <CreatePostModal onClose={onClose} isOpen={isOpen} onOpen={onOpen} />

      {/* Create Reel Modal */}
      <CreateReelModal
        onClose={handleCloseCreateReelModal}
        isOpen={isCreateReelModalOpen}
        onOpen={handleOpenCreateReelModal}
      />
    </>
  );
};

export default Sidebar;
