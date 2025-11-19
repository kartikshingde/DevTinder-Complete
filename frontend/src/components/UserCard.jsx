import axios from "axios";
import React from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";
import axiosInstance from "../utils/axiosConfig";

const UserCard = ({ user }) => {
  const { _id, firstName, lastName, profileUrl, age, gender, about, skills } =
    user;
  const dispatch = useDispatch();

  const handleSendRequest = async (status, userId) => {
    try {
      const res = await axiosInstance.post(
        BASE_URL + "/request/send/" + status + "/" + userId,
        {}
      );
      dispatch(removeUserFromFeed(userId));
    } catch (err) {
      console.error(err.message);
    }
  };

  // Normalize skills: always make it an array
  const normalizedSkills = Array.isArray(skills)
    ? skills
    : typeof skills === "string"
    ? skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  return (
    // --- FIX: Removed min-h-[500px] to allow card to be flexible. ---
    // Added 'h-full' to ensure it plays well in a grid layout.
    <div className="w-full max-w-sm bg-gray-900 text-white rounded-xl shadow-lg overflow-hidden flex flex-col h-full">
      {/* --- FIX: Reduced image height on mobile (h-48) and kept h-64 for small screens and up --- */}
      <div className="w-full h-48 sm:h-64 bg-gray-800 flex items-center justify-center">
        <img
          src={profileUrl || "/default-avatar.svg"}
          alt={firstName + " " + lastName}
          className="w-full h-full object-contain rounded-t-xl"
          onError={(e) => {
            if (
              e.target.src !==
              window.location.origin + "/default-avatar.svg"
            ) {
              e.target.src = "/default-avatar.svg";
            }
          }}
        />
      </div>

      {/* --- FIX: Reduced padding on mobile (p-4) and margins (mt-x) --- */}
      <div className="flex flex-col flex-grow p-4 sm:p-5 overflow-auto">
        <h2 className="text-lg sm:text-xl font-semibold">
          {firstName} {lastName}
        </h2>

        {age && gender && (
          <p className="text-sm text-gray-400 mt-1">
            {age} yrs • {gender}
          </p>
        )}

        {/* --- FIX: Reduced line-clamp on mobile to 2, and margin-top --- */}
        <p className="text-sm text-gray-300 mt-2 sm:mt-3 line-clamp-2 sm:line-clamp-3">
          {about}
        </p>

        {normalizedSkills.length > 0 && (
          // --- FIX: Reduced margin-top ---
          <div className="flex flex-wrap gap-2 mt-3 sm:mt-4">
            {normalizedSkills.map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full text-xs font-medium bg-gray-800 text-gray-200"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* --- FIX: Significantly reduced margin-top (mt-4) to bring buttons into view --- */}
        {/* Added 'mt-auto' to push buttons to the bottom if content is short */}
        <div className="flex gap-3 mt-4 sm:mt-6 justify-center pt-2">
          <button
            className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition text-sm font-medium"
            onClick={() => handleSendRequest("ignored", _id)}
          >
            Ignore
          </button>
          <button
            className="flex-1 py-2 rounded-lg bg-green-600 hover:bg-green-700 transition text-sm font-medium"
            onClick={() => handleSendRequest("interested", _id)}
          >
            Interested
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
