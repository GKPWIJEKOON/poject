import { useDisclosure } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
  AiFillHeart,
  AiOutlineHeart
} from "react-icons/ai";
import {
  BsBookmark,
  BsBookmarkFill,
  BsDot,
  BsEmojiSmile,
  BsThreeDots
} from "react-icons/bs";
import { FaRegComment } from "react-icons/fa";
import { RiSendPlaneLine } from "react-icons/ri";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  isPostLikedByUser,
  isReqUserPost,
  isSavedPost,
  timeDifference
} from "../../../Config/Logic";
import { createComment } from "../../../Redux/Comment/Action";
import {
  deletePostAction,
  likePostAction,
  savePostAction,
  unLikePostAction,
  unSavePostAction
} from "../../../Redux/Post/Action";
import { createNotificationAction } from "../../../Redux/Notification/Action";
import CommentModal from "../../Comment/CommentModal";
import EditPostModal from "../Create/EditPostModal";
import "./PostCard.css";

const PostCard = ({
  userProfileImage,
  username,
  location,
  post,
  createdAt,
}) => {
  const [commentContent, setCommentContent] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { user } = useSelector((store) => store);
  const [isSaved, setIsSaved] = useState(false);
  const [isPostLiked, setIsPostLiked] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [openEditPostModal, setOpenEditPostModal] = useState(false);
  const [numberOfLikes, setNumberOfLike] = useState(0);

  const data = { jwt: token, postId: post.id };

  const handleCommentInputChange = (e) => {
    setCommentContent(e.target.value);
  };

  const handleAddComment = () => {
    dispatch(createComment({
      jwt: token,
      postId: post.id,
      data: { content: commentContent },
    }));
    setCommentContent("");

    if (post.user.id !== user.reqUser.id) {
      dispatch(createNotificationAction({
        message: `${user.reqUser.username} commented: ${commentContent}`,
        type: "COMMENT",
        postId: post.id
      }, token));
    }
  };

  const handleOnEnterPress = (e) => {
    if (e.key === "Enter") handleAddComment();
  };

  const handleLikePost = () => {
    dispatch(likePostAction(data));
    setIsPostLiked(true);
    setNumberOfLike(numberOfLikes + 1);

    if (post.user.id !== user.reqUser.id) {
      dispatch(createNotificationAction({
        message: `${user.reqUser.username} liked your post`,
        type: "LIKE",
        postId: post.id
      }, token));
    }
  };

  const handleUnLikePost = () => {
    dispatch(unLikePostAction(data));
    setIsPostLiked(false);
    setNumberOfLike(numberOfLikes - 1);
  };

  const handleSavePost = () => {
    dispatch(savePostAction(data));
    setIsSaved(true);
  };

  const handleUnSavePost = () => {
    dispatch(unSavePostAction(data));
    setIsSaved(false);
  };

  const handleNavigate = (username) => {
    navigate(`/${username}`);
  };

  const handleNextMedia = () => {
    setCurrentMediaIndex(prev =>
      prev === post.mediaUrls.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrevMedia = () => {
    setCurrentMediaIndex(prev =>
      prev === 0 ? post.mediaUrls.length - 1 : prev - 1
    );
  };

  const isVideo = (url) => {
    return url.match(/\.(mp4|webm|ogg)$/i);
  };

  useEffect(() => {
    setIsSaved(isSavedPost(user.reqUser, post.id));
    setIsPostLiked(isPostLikedByUser(post, user.reqUser?.id));
    setNumberOfLike(post?.likedByUsers?.length);
  }, [user.reqUser, post]);

  const handleClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleWindowClick = (event) => {
    if (!event.target.matches(".dots")) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleWindowClick);
    return () => {
      window.removeEventListener("click", handleWindowClick);
    };
  }, []);

  const handleDeletePost = (postId) => {
    dispatch(deletePostAction({ jwt: token, postId }));
  };

  const isOwnPost = isReqUserPost(post, user.reqUser);

  const handleOpenCommentModal = () => {
    navigate(`/p/${post.id}`);
    onOpen();
  };

  const handleCloseEditPostModal = () => {
    setOpenEditPostModal(false);
  };

  const handleOpenEditPostModal = () => {
    setOpenEditPostModal(true);
  };

  return (
    <div className="w-full max-w-4xl mx-auto border rounded-2xl mb-8 bg-white shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3">
        <div className="flex items-center gap-3">
          <img
            className="w-12 h-12 rounded-full object-cover"
            src={post.user.userImage || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
            alt="User"
          />
          <div>
            <p className="text-sm font-semibold cursor-pointer" onClick={() => handleNavigate(username)}>
              {post?.user?.username}
              <span className="text-gray-400 flex items-center text-xs ml-2">
                <BsDot /> {timeDifference(post?.createdAt)}
              </span>
            </p>
            <p className="text-xs text-gray-500">{location}</p>
          </div>
        </div>

        {isOwnPost && (
          <div className="relative">
            <BsThreeDots onClick={handleClick} className="dots cursor-pointer text-lg" />
            {showDropdown && (
              <div className="absolute right-0 top-6 bg-white border shadow-xl z-10 w-32 rounded-md text-sm">
                <p onClick={handleOpenEditPostModal} className="hover:bg-gray-100 px-4 py-2 cursor-pointer">Edit</p>
                <hr />
                <p onClick={() => handleDeletePost(post.id)} className="hover:bg-gray-100 px-4 py-2 cursor-pointer text-red-600">Delete</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Media */}
      <div className="relative w-full h-[600px] bg-black">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentMediaIndex * 100}%)` }}
        >
          {post.mediaUrls?.map((url, index) => (
            <div key={index} className="w-full flex-shrink-0 h-[600px]">
              {isVideo(url) ? (
                <video src={url} controls className="w-full h-full object-cover" />
              ) : (
                <img src={url} alt={`media-${index}`} className="w-full h-full object-cover" />
              )}
            </div>
          ))}
        </div>

        {post.mediaUrls?.length > 1 && (
          <>
            <ChevronLeftIcon
              onClick={handlePrevMedia}
              className="absolute top-1/2 left-2 transform -translate-y-1/2 text-white text-3xl cursor-pointer bg-black bg-opacity-40 rounded-full p-1"
            />
            <ChevronRightIcon
              onClick={handleNextMedia}
              className="absolute top-1/2 right-2 transform -translate-y-1/2 text-white text-3xl cursor-pointer bg-black bg-opacity-40 rounded-full p-1"
            />
          </>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center px-4 py-3">
        <div className="flex gap-4 items-center">
          {isPostLiked ? (
            <AiFillHeart
              onClick={handleUnLikePost}
              className="text-3xl text-red-500 cursor-pointer"
            />
          ) : (
            <AiOutlineHeart
              onClick={handleLikePost}
              className="text-3xl cursor-pointer"
            />
          )}
          <FaRegComment
            onClick={handleOpenCommentModal}
            className="text-[26px] cursor-pointer"
          />
        </div>
        <div>
          {isSaved ? (
            <BsBookmarkFill
              onClick={handleUnSavePost}
              className="text-2xl cursor-pointer"
            />
          ) : (
            <BsBookmark
              onClick={handleSavePost}
              className="text-2xl cursor-pointer"
            />
          )}
        </div>
      </div>

      {/* Post Info */}
      <div className="px-4 pb-3 text-sm">
        {numberOfLikes > 0 && <p className="font-medium">{numberOfLikes} likes</p>}
        <p className="py-1">
          <span className="font-semibold">{post?.user?.username}</span> {post.caption}
        </p>
        {post?.comments?.length > 0 && (
          <p
            onClick={handleOpenCommentModal}
            className="text-gray-500 cursor-pointer"
          >
            View all {post.comments.length} comments
          </p>
        )}
      </div>

      {/* Comment Input */}
      <div className="border-t px-4 py-3">
        <div className="flex items-center gap-2">
          <BsEmojiSmile className="text-xl" />
          <input
            onKeyPress={handleOnEnterPress}
            onChange={handleCommentInputChange}
            value={commentContent}
            className="flex-1 outline-none text-sm"
            type="text"
            placeholder="Add a comment..."
          />
        </div>
      </div>

      {/* Modals */}
      <EditPostModal
        onClose={handleCloseEditPostModal}
        isOpen={openEditPostModal}
        post={post}
      />
      <CommentModal
        handleLikePost={handleLikePost}
        handleSavePost={handleSavePost}
        handleUnSavePost={handleUnSavePost}
        handleUnLikePost={handleUnLikePost}
        isPostLiked={isPostLiked}
        isSaved={isSaved}
        postData={post}
        isOpen={isOpen}
        onClose={onClose}
      />
    </div>
  );
};

export default PostCard;
