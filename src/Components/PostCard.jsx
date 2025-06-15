import React from "react";
import DBService from "../appwriteService/dbService";
import { Link } from "react-router-dom";

const PostCard = ({ $id, Title, FeatureImage }) => {
  return (
    <Link to={`/post/${$id}`}>
      <div className="w-full bg-gray-100 rounded-xl p-4">
        <div className="w-full justify-center mb-4">
          <img
            src={DBService.getFilePreview(FeatureImage)}
            alt={Title}
            className="rounded-xl"
          />
        </div>
        <h2 className="text-xl font-bold">{Title}</h2>
      </div>
    </Link>
  );
};

export default PostCard;
