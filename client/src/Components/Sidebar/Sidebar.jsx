import { useDisclosure } from "@chakra-ui/hooks";
import React, { useRef, useState } from "react";
import { IoReorderThreeOutline } from "react-icons/io5";
import { useNavigate } from "react-router";
import { mainu } from "./SidebarConfig";
import "./Sidebar.css";
import SearchComponent from "../SearchComponent/SearchComponent";
import { useSelector } from "react-redux";
import CreatePostModal from "../Post/Create/CreatePostModal";
import CreateReelModal from "../Create/CreateReel";
import Notification from "../Notification/Notification";

const Sidebar = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Home");
  const excludedBoxRef = useRef(null);
  const [isSearchBoxVisible, setIsSearchBoxVisible] = useState(false);
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
      case "Create Story":
        navigate("/create-story");
        break;
      case "Learning Plan":
        navigate("/learning_plan");
        break;
      case "Learning Progress":
        navigate("/learning-progress");
        break;
      case "About Us":
        navigate("/about");
        break;
      case "Search":
        setIsSearchBoxVisible(true);
        return;
      default:
        break;
    }

    setIsSearchBoxVisible(false);
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

  return (
    <div className="sticky top-0 h-screen pb-10 flex bg-blue-900 text-white font-bold text-lg">
      <div
        className={`${
          activeTab === "Search" ? "px-3" : "px-10"
        } flex flex-col justify-between h-full w-full`}
      >
        <div className="pt-10">
          {!isSearchBoxVisible && (
            <img
              className="w-40"
              src="https://www.e-learning-platform.org/images/e-learning-logo.png"
              alt="Logo"
            />
          )}
          <div className="mt-10 space-y-3">
            {mainu.map((item) => (
              <div
                key={item.title}
                onClick={() => handleTabClick(item.title)}
                className={`flex items-center gap-3 cursor-pointer rounded-xl p-3 transition duration-200 ${
                  activeTab === item.title
                    ? "bg-blue-700 shadow-md"
                    : "hover:bg-blue-800"
                }`}
              >
                <div className="text-2xl">{activeTab === item.title ? item.activeIcon : item.icon}</div>
                {!isSearchBoxVisible && <p>{item.title}</p>}
              </div>
            ))}
          </div>
        </div>

        <div className="relative mb-10">
          <div
            onClick={handleClick}
            className="flex items-center cursor-pointer hover:bg-blue-800 p-3 rounded-xl"
          >
            <IoReorderThreeOutline className="text-2xl" />
            {!isSearchBoxVisible && <p className="ml-5">More</p>}
          </div>

          {showDropdown && (
            <div className="absolute bottom-16 left-0 w-40 bg-white text-black shadow-lg rounded-lg">
              <p
                onClick={handleLogout}
                className="w-full py-2 text-base px-4 border-b hover:bg-gray-100 cursor-pointer"
              >
                Log out
              </p>
            </div>
          )}
        </div>
      </div>

      {isSearchBoxVisible && (
        <div className="w-full">
          <SearchComponent setIsSearchVisible={setIsSearchBoxVisible} />
        </div>
      )}

      <CreatePostModal onClose={onClose} isOpen={isOpen} onOpen={onOpen} />
      <CreateReelModal
        onClose={handleCloseCreateReelModal}
        isOpen={isCreateReelModalOpen}
        onOpen={handleOpenCreateReelModal}
      />
    </div>
  );
};

export default Sidebar;
