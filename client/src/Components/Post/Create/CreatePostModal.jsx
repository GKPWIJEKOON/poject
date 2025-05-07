import {
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/modal";
import React, { useState } from "react";
import { FaPhotoVideo } from "react-icons/fa";
import { GoLocation } from "react-icons/go";
import { GrEmoji } from "react-icons/gr";
import { Button } from "@chakra-ui/button";
import { useDispatch, useSelector } from "react-redux";
import { createPost } from "../../../Redux/Post/Action";
import { uploadToCloudinary } from "../../../Config/UploadToCloudinary";
import SpinnerCard from "../../Spinner/Spinner";

const CreatePostModal = ({ isOpen, onClose }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const { user } = useSelector((store) => store);

  const [postData, setPostData] = useState({
    mediaUrls: [],
    caption: "",
    location: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPostData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    handleFiles(droppedFiles);
    setIsDragOver(false);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleOnChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    handleFiles(selectedFiles);
  };

  const handleFiles = async (files) => {
    const validFiles = files.filter((file) =>
      file.type.startsWith("image/") || file.type.startsWith("video/")
    );

    if (validFiles.length === 0) {
      alert("Please select image or video files.");
      return;
    }

    setUploadStatus("uploading");
    try {
      const uploadPromises = validFiles.map((file) =>
        uploadToCloudinary(file)
      );
      const urls = await Promise.all(uploadPromises);

      setPostData((prev) => ({
        ...prev,
        mediaUrls: [...prev.mediaUrls, ...urls.filter((url) => url)],
      }));
      setUploadStatus("uploaded");
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadStatus("error");
      alert("Failed to upload files. Please try again.");
    }
  };

  const handleSubmit = () => {
    if (!token || postData.mediaUrls.length === 0) return;

    const data = {
      jwt: token,
      data: postData,
    };

    dispatch(createPost(data));
    handleClose();
  };

  const handleClose = () => {
    onClose();
    setPostData({ mediaUrls: [], caption: "", location: "" });
    setUploadStatus("");
    setIsDragOver(false);
    setCurrentMediaIndex(0);
  };

  const isVideo = (url) => url.match(/\.(mp4|webm|ogg)$/i);

  return (
    <Modal size="4xl" isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent className="bg-blue-50 rounded-xl shadow-xl">
        <div className="flex justify-between py-2 px-6 items-center">
          <p className="font-semibold text-lg">Create New Post</p>
          <Button
            onClick={handleSubmit}
            colorScheme="blue"
            size="sm"
            variant="solid"
            isDisabled={postData.mediaUrls.length === 0}
          >
            Share
          </Button>
        </div>

        <hr className="border-gray-200" />

        <ModalBody>
          <div className="flex h-[70vh]">
            {/* Left: Upload / Preview Area */}
            <div className="w-1/2 flex justify-center items-center relative">
              {uploadStatus === "" && (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`w-full h-full border-2 border-dashed rounded-xl flex flex-col justify-center items-center cursor-pointer transition-colors ${
                    isDragOver ? "border-blue-400 bg-blue-100" : "border-gray-300"
                  }`}
                >
                  <FaPhotoVideo className="text-4xl text-blue-600 mb-2" />
                  <p className="text-sm">Drag photos or videos here</p>
                  <label
                    htmlFor="file-upload"
                    className="mt-3 px-4 py-2 bg-blue-500 text-white rounded cursor-pointer text-sm hover:bg-blue-600"
                  >
                    Select from computer
                  </label>
                  <input
                    type="file"
                    id="file-upload"
                    accept="image/*, video/*"
                    multiple
                    onChange={handleOnChange}
                    className="hidden"
                  />
                </div>
              )}

              {uploadStatus === "uploading" && <SpinnerCard />}

              {uploadStatus === "uploaded" && (
                <div className="w-full h-full relative">
                  {postData.mediaUrls.map((url, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 flex items-center justify-center ${
                        index === currentMediaIndex ? "block" : "hidden"
                      }`}
                    >
                      {isVideo(url) ? (
                        <video
                          src={url}
                          controls
                          className="max-h-full max-w-full object-contain rounded-xl"
                        />
                      ) : (
                        <img
                          src={url}
                          alt={`media-${index}`}
                          className="max-h-full max-w-full object-contain rounded-xl"
                        />
                      )}
                    </div>
                  ))}

                  {postData.mediaUrls.length > 1 && (
                    <div className="absolute bottom-2 w-full flex justify-center space-x-2">
                      {postData.mediaUrls.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentMediaIndex(index)}
                          className={`w-2 h-2 rounded-full ${
                            index === currentMediaIndex
                              ? "bg-blue-600"
                              : "bg-gray-400"
                          }`}
                          aria-label={`Media ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="w-[1px] bg-gray-300 mx-4" />

            {/* Right: Post Details */}
            <div className="w-1/2">
              <div className="flex items-center mb-4">
                <img
                  className="w-8 h-8 rounded-full"
                  src={
                    user?.reqUser?.image ||
                    "https://cdn.pixabay.com/photo/2023/02/28/03/42/ibex-7819817_640.jpg"
                  }
                  alt="user"
                />
                <p className="ml-3 font-semibold text-gray-700">
                  {user?.reqUser?.username}
                </p>
              </div>

              <textarea
                name="caption"
                placeholder="Write a caption..."
                rows="5"
                value={postData.caption}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none bg-white"
              />

              <div className="flex justify-between items-center my-2 text-gray-500 text-sm">
                <GrEmoji />
                <span>{postData.caption.length}/2,200</span>
              </div>

              <hr className="my-2" />

              <div className="flex items-center">
                <input
                  type="text"
                  name="location"
                  placeholder="Add Location"
                  value={postData.location}
                  onChange={handleInputChange}
                  className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
                />
                <GoLocation className="ml-3 text-xl text-blue-600" />
              </div>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CreatePostModal;
