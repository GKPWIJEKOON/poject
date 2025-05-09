import { useDisclosure } from "@chakra-ui/hooks";
import React, { useState } from "react";
import { IoReorderThreeOutline } from "react-icons/io5";
import { useNavigate } from "react-router";
import { mainu } from "./SidebarConfig";
import "./Sidebar.css";
import { useSelector } from "react-redux";
import CreatePostModal from "../Post/Create/CreatePostModal";
import CreateReelModal from "../Create/CreateReel";
import SearchComponent from "../SearchComponent/SearchComponent";

const Sidebar = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Home");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useSelector((store) => store);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isCreateReelModalOpen, setIsCreateReelModalOpen] = useState(false);
  const [isSearchBoxVisible, setIsSearchBoxVisible] = useState(false);

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
      case "Search":
        setIsSearchBoxVisible(true);
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

  // Include "Search" now
  const filteredMenu = mainu.filter(
    (item) => !["About Us", "Create Story"].includes(item.title)
  );

  return (
    <>
      {/* Bottom Nav */}
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

        {/* More Dropdown */}
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

      {/* Slide-in Search Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white text-black shadow-lg z-50 transform transition-transform duration-300 ${
          isSearchBoxVisible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Search</h2>
          <button
            onClick={() => {
              setIsSearchBoxVisible(false);
              setActiveTab("Home");
            }}
            className="text-gray-600 hover:text-black"
          >
            ✕
          </button>
        </div>
        <div className="p-4 overflow-y-auto h-full">
          <SearchComponent setIsSearchVisible={setIsSearchBoxVisible} />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
