import axios from "axios";
import React from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";

const UserCard = ({ user }) => {
  const { _id, firstName, lastName, profileUrl, age, gender, about, skills } =
    user;
  const dispatch = useDispatch();

  const handleSendRequest = async (status, userId) => {
    try {
      const res = await axios.post(
        BASE_URL + "/request/send/" + status + "/" + userId,
        {},
        { withCredentials: true }
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
    <div className="w-full max-w-sm bg-gray-900 text-white rounded-xl shadow-lg overflow-hidden flex flex-col min-h-[500px]">
  <div className="w-full h-64 bg-gray-800 flex items-center justify-center">
    <img
      src={profileUrl || "/default-avatar.svg"}
      alt={firstName + " " + lastName}
      className="w-full h-full object-contain rounded-t-xl"
      onError={(e) => {
        if (e.target.src !== window.location.origin + "/default-avatar.svg") {
          e.target.src = "/default-avatar.svg";
        }
      }}
    />
  </div>

  <div className="flex flex-col flex-grow p-5 overflow-auto">
    <h2 className="text-xl font-semibold">{firstName} {lastName}</h2>
    {age && gender && (
      <p className="text-sm text-gray-400 mt-1">{age} yrs • {gender}</p>
    )}
    <p className="text-sm text-gray-300 mt-3 line-clamp-3">{about}</p>

    {normalizedSkills.length > 0 && (
      <div className="flex flex-wrap gap-2 mt-4">
        {normalizedSkills.map((skill, idx) => (
          <span key={idx} className="px-3 py-1 rounded-full text-xs font-medium bg-gray-800 text-gray-200">{skill}</span>
        ))}
      </div>
    )}

    <div className="flex gap-3 mt-6 justify-center">
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
