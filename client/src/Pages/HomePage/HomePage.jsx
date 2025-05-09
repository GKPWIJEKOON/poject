import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import HomeRight from "../../Components/HomeRight/HomeRight";
import PostCard from "../../Components/Post/PostCard/PostCard";
import { suggetions, timeDifference } from "../../Config/Logic";
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
    if (token) dispatch(getUserProfileAction(token));
  }, [token]);

  useEffect(() => {
    if (reqUser) {
      const newIds = reqUser?.following?.map((user) => user.id) || [];
      setUserIds([reqUser?.id, ...newIds]);
      setSuggestedUser(suggetions(reqUser));
    }
  }, [reqUser]);

  useEffect(() => {
    if (!token || userIds.length === 0 || !userIds.includes(reqUser?.id)) return;

    const data = {
      userIds: userIds.join(","),
      jwt: token,
    };

    dispatch(findUserPost(data));
    dispatch(findByUserIdsAction(data));
  }, [userIds, post.createdPost, post.deletedPost, post.updatedPost]);

  const defaultProfile =
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

  return (
    <div className="bg-gray-100 min-h-screen py-12 text-xl">
      <div className=" mx-auto flex flex-col lg:flex-row gap-10 px-8 ">
        {/* Left Sidebar */}
        <div className="hidden lg:block lg:w-[25%] sticky top-6 self-start">
          <div className="bg-white shadow-lg rounded-2xl p-8">
            <img
              src="https://www.e-learning-platform.org/images/e-learning-logo.png"
              alt="E-Learning Logo"
              className="w-40 mx-auto mb-8"
            />
            <h2 className="font-bold text-3xl text-center mb-6">
              Welcome, {reqUser?.username}
            </h2>

            {/* Profile Card */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 shadow">
              <div className="flex flex-col items-center text-center">
                <div
                  className="cursor-pointer"
                  onClick={() => navigate(`/${reqUser?.username}`)}
                >
                  <img
                    src={reqUser?.userImage || defaultProfile}
                    alt="profile"
                    className="w-36 h-36 rounded-full border border-gray-300 hover:scale-105 transition-transform object-cover"
                  />
                </div>
                <h3 className="font-semibold text-2xl mt-4">
                  {reqUser?.fullname}
                </h3>
                <p className="text-lg text-gray-600">{reqUser?.bio || ""}</p>
              </div>

              <div className="mt-6 text-xl space-y-4">
                <div
                  className="flex justify-between text-blue-600 cursor-pointer hover:underline"
                  onClick={() => navigate("/profile-views")}
                >
                  <span>👁️ Profile viewers</span>
                  <span>20</span>
                </div>
                <div
                  className="flex justify-between text-blue-600 cursor-pointer hover:underline"
                  onClick={() => navigate("/post-impressions")}
                >
                  <span>📊 Post impressions</span>
                  <span>1</span>
                </div>
              </div>

              <div className="mt-6 border-t pt-4 text-xl">
                <p className="text-gray-700 font-semibold">Quick Links</p>
                <ul className="mt-4 space-y-3 text-blue-700">
                  <li className="hover:underline cursor-pointer" onClick={() => navigate("/learning_plan")}>
                    📁 Learning Plans
                  </li>
                  <li className="hover:underline cursor-pointer" onClick={() => navigate("/learning-progress")}>
                    👥 E-LearnXpert
                  </li>
                  <li className="hover:underline cursor-pointer" onClick={() => navigate("/newsletters")}>
                    📰 Create post
                  </li>
                  <li className="hover:underline cursor-pointer" onClick={() => navigate("/notifications")}>
                    📅 Notifications
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Main Feed */}
        <div className="w-full lg:w-[50%]">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-blue-800">Welcome to E-LearnXpert</h2>
            <p className="text-2xl text-gray-600 mt-3">
              E-LearnXpert is your trusted partner on the path to knowledge and success.
            </p>
          </div>

          <div className="space-y-10">
            {post.userPost?.length > 0 ? (
              post.userPost.map((item) => (
                <PostCard
                  key={item.id}
                  userProfileImage={item.user.userImage || defaultProfile}
                  username={item.user.username}
                  location={item.location}
                  postImage={item.image}
                  createdAt={timeDifference(item.createdAt)}
                  postId={item.id}
                  post={item}
                />
              ))
            ) : (
              <div className="bg-white p-10 rounded-2xl shadow-md text-center text-gray-600">
                <p className="text-2xl">No posts yet. Follow people or create your first post!</p>
                <img
                  src="https://cdn.dribbble.com/users/446147/screenshots/15548482/media/5748b7cfb3c2e9859c1139c7491e2c42.png"
                  alt="No content"
                  className="w-full h-80 object-cover mt-6 rounded-xl"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="hidden lg:block lg:w-[25%] space-y-10 sticky top-6 h-fit">
          

          {/* Sponsored Ad 1 */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <p className="text-xl text-gray-500 mb-3 font-semibold">Sponsored</p>
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <img
                src="https://adtechbook.clearcode.cc/wp-content/uploads/2022/05/Ad_Networks_logo.jpg"
                alt="Ad Network"
                className="w-full h-56 object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <p className="text-gray-700 text-lg mt-3">
              Discover how ad networks connect advertisers with the right audience.
            </p>
            <a
              href="https://adtechbook.clearcode.cc"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 text-lg font-medium hover:underline mt-2 inline-block"
            >
              Learn more
            </a>
          </div>

          {/* Sponsored Ad 2 */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <p className="text-xl text-gray-500 mb-3 font-semibold">Sponsored</p>
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <img
                src="https://images.squarespace-cdn.com/content/v1/5a0a6e8729f187e10886bdaf/1520919470469-J388219P30THDKDIJD75/ad-exchange.jpg"
                alt="Ad Exchange"
                className="w-full h-56 object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <p className="text-gray-700 text-lg mt-3">
              Learn how ad exchanges optimize real-time bidding for digital ads.
            </p>
            <a
              href="https://clearcode.cc/blog/what-is-an-ad-exchange/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 text-lg font-medium hover:underline mt-2 inline-block"
            >
              Read article
            </a>
          </div>

          {/* Video Card */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <p className="text-xl text-gray-500 mb-3 font-semibold">Watch & Learn</p>
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden border border-gray-200">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/0RTCptpwlDk?rel=0"
                title="YouTube video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <p className="text-gray-700 text-lg mt-3">
              Quick intro to ad tech in just 60 seconds!
            </p>
            <a
              href="https://youtu.be/0RTCptpwlDk"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 text-lg font-medium hover:underline mt-2 inline-block"
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