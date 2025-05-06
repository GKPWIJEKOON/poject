import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import HomeRight from "../../Components/HomeRight/HomeRight";
import PostCard from "../../Components/Post/PostCard/PostCard";
import StoryCircle from "../../Components/Story/StoryCircle/StoryCircle";

import { hasStory, suggetions, timeDifference } from "../../Config/Logic";
import { findUserPost } from "../../Redux/Post/Action";
import { findByUserIdsAction, getUserProfileAction } from "../../Redux/User/Action";

const HomePage = () => {
  const dispatch = useDispatch();
  const [userIds, setUserIds] = useState([]);
  const token = localStorage.getItem("token");
  const reqUser = useSelector((store) => store.user.reqUser);
  const { user, post } = useSelector((store) => store);
  const [suggestedUser, setSuggestedUser] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getUserProfileAction(token));
  }, [token]);

  useEffect(() => {
    if (reqUser) {
      const newIds = reqUser?.following?.map((user) => user.id);
      setUserIds([reqUser?.id, ...newIds]);
      setSuggestedUser(suggetions(reqUser));
    }
  }, [reqUser]);

  useEffect(() => {
    const data = {
      userIds: [userIds].join(","),
      jwt: token,
    };

    if (userIds.length > 0) {
      dispatch(findUserPost(data));
      dispatch(findByUserIdsAction(data));
    }
  }, [userIds, post.createdPost, post.deletedPost, post.updatedPost]);

  const storyUsers = hasStory(user.userByIds);

  return (
    <div className="bg-gray-100 min-h-screen py-6">
      <div className="container mx-auto flex flex-col lg:flex-row gap-6 px-4 lg:px-0">
        {/* Left Sidebar */}
        <div className="hidden lg:block lg:w-[25%] sticky top-6 self-start">
          <div className="bg-white shadow-md rounded-lg p-4">
            <img
              src="https://www.e-learning-platform.org/images/e-learning-logo.png"
              alt="E-Learning Logo"
              className="w-32 mx-auto mb-4"
            />
            <h2 className="font-semibold text-lg text-center mb-2">
              Welcome, {reqUser?.username}
            </h2>

            {/* LinkedIn-style Card */}
            <div className="bg-gray-50 rounded-lg p-4 mt-4 border border-gray-200 shadow-sm">
              <div className="flex flex-col items-center text-center">
                <div
                  className="cursor-pointer"
                  onClick={() => navigate(`/${reqUser?.username}`)}
                >
                  <img
                    src={
                      reqUser?.userImage ||
                      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                    }
                    alt="profile"
                    className="w-20 h-20 rounded-full border border-gray-300 hover:scale-105 transition-transform"
                  />
                </div>
                <h3 className="font-semibold mt-2">{reqUser?.fullname}</h3>
                <p className="text-sm text-gray-500">{reqUser?.bio || ""}</p>
                <p className="text-xs text-gray-400 mt-1"></p>
              </div>
              <div className="mt-4 text-sm space-y-2">
                <div className="flex justify-between text-blue-600 cursor-pointer hover:underline" onClick={() => navigate("/profile-views")}>
                  <span>Profile viewers</span>
                  <span>20</span>
                </div>
                <div className="flex justify-between text-blue-600 cursor-pointer hover:underline" onClick={() => navigate("/post-impressions")}>
                  <span>Post impressions</span>
                  <span>1</span>
                </div>
              </div>
              <div className="mt-4 border-t pt-2 text-sm">
                <p className="text-gray-600">Quick links</p>
                <ul className="mt-2 space-y-1 text-blue-600">
                  <li className="hover:underline cursor-pointer" onClick={() => navigate("/learning_plan")}>📁 Learning Plans</li>
                  <li className="hover:underline cursor-pointer" onClick={() => navigate("/learning-progress")}>👥 Learning Pro</li>
                  <li className="hover:underline cursor-pointer" onClick={() => navigate("/newsletters")}>📰 Create post</li>
                  <li className="hover:underline cursor-pointer" onClick={() => navigate("/notifications")}>📅 Notificatins</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Main Feed */}
        <div className="w-full lg:w-[50%]">
          {/* Stories */}
          {storyUsers.length > 0 && (
            <div className="flex overflow-x-auto space-x-4 mb-6 bg-white p-4 rounded-lg shadow-sm">
              {storyUsers.map((item, index) => (
                <StoryCircle
                  key={index}
                  image={
                    item?.image ||
                    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                  }
                  username={item?.username}
                  userId={item?.id}
                />
              ))}
            </div>
          )}

          {/* Posts */}
          <div className="space-y-6">
            {post.userPost?.length > 0 &&
              post?.userPost?.map((item) => (
                <PostCard
                  key={item.id}
                  userProfileImage={
                    item.user.userImage
                      ? item.user.userImage
                      : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                  }
                  username={item?.user?.username}
                  location={item?.location}
                  postImage={item?.image}
                  createdAt={timeDifference(item?.createdAt)}
                  postId={item?.id}
                  post={item}
                />
              ))}
          </div>
        </div>

        {/* Right Sidebar (Suggestions + Ads) */}
        <div className="hidden lg:block lg:w-[25%] space-y-6 sticky top-6 h-fit">
          <HomeRight suggestedUser={suggestedUser} />

          {/* Ads and Videos */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-sm text-gray-500 mb-2 font-semibold">Sponsored</p>
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <img
                src="https://adtechbook.clearcode.cc/wp-content/uploads/2022/05/Ad_Networks_logo.jpg"
                alt="Ad Network"
                className="w-full h-40 object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <p className="text-gray-700 text-sm mt-2">
              Discover how ad networks connect advertisers with the right audience.
            </p>
            <a
              href="https://adtechbook.clearcode.cc"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 text-sm font-medium hover:underline mt-1 inline-block"
            >
              Learn more
            </a>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-sm text-gray-500 mb-2 font-semibold">Sponsored</p>
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <img
                src="https://images.squarespace-cdn.com/content/v1/5a0a6e8729f187e10886bdaf/1520919470469-J388219P30THDKDIJD75/ad-exchange.jpg"
                alt="Ad Exchange"
                className="w-full h-40 object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <p className="text-gray-700 text-sm mt-2">
              Learn how ad exchanges optimize real-time bidding for digital ads.
            </p>
            <a
              href="https://clearcode.cc/blog/what-is-an-ad-exchange/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 text-sm font-medium hover:underline mt-1 inline-block"
            >
              Read article
            </a>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-sm text-gray-500 mb-2 font-semibold">Watch & Learn</p>
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden border border-gray-200">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/0RTCptpwlDk?rel=0"
                title="YouTube video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <p className="text-gray-700 text-sm mt-2">
              Quick intro to ad tech in just 60 seconds!
            </p>
            <a
              href="https://youtu.be/0RTCptpwlDk"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 text-sm font-medium hover:underline mt-1 inline-block"
            >
              Watch on YouTube
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;