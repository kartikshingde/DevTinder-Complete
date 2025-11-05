import React, { useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";
import Error from "./Error";

const Feed = () => {
  const feed = useSelector((store) => store.feed); // feed = array of users
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();

  // ✅ Fetch the feed data
  const getFeed = async () => {
    try {
      const res = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      });

      // ✅ Make sure we only store the array of users (not { data: [...] })
      // console.log(res)
      dispatch(addFeed(res.data.data || []));
    } catch (err) {
      console.error("Error fetching feed:", err.message);
      return <Error />;
    }
  };

  // ✅ Fetch feed whenever logged-in user changes
  useEffect(() => {
    getFeed();
  }, [user]);

  // ✅ Filter out current logged-in user from the feed
  const getFilteredFeed = () => {
    if (!feed || !Array.isArray(feed) || !user) return null;

    const currentUserId = user._id || user.message?._id;
    const filteredUsers = feed.filter(
      (feedUser) => feedUser._id !== currentUserId
    );

    return filteredUsers.length > 0 ? filteredUsers[0] : null;
  };

  const userToShow = getFilteredFeed();

  return userToShow ? (
    <div className="flex justify-center my-10">
      <UserCard user={userToShow} />
    </div>
  ) : (
    <div className="flex justify-center my-10">
      <div className="text-center p-8">
        <h2 className="text-2xl font-semibold text-gray-600 mb-4">
          No more users to show
        </h2>
        <p className="text-gray-500">
          Check back later for new connections!
        </p>
      </div>
    </div>
  );
};

export default Feed;
