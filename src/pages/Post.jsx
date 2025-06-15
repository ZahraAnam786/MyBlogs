import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import dbService from "../appwriteService/dbService";
import { Button, Container } from "../Components";
import parse from "html-react-parser";

const Post = () => {
  const [post, setPost] = useState(null);
  const navigate = useNavigate();
  const { slug } = useParams();

  const userData = useSelector((state) => state.auth.userData);

  const isAuthor = post && userData ? post.UserID == userData.$id : false;

  useEffect(() => {
    if (slug) {
      dbService.getPostByID(slug).then((post) => {
        if (post) setPost(post);
        else navigate("/");
      });
    }
  }, [slug, navigate]);

  const deletePost = () => {
    dbService.deletePost(post.$id).then((status) => {
      if (status) {
        dbService.fileDelete(post.FeatureImage);
        navigate("/");
      }
    });
  };

  return post ? (
    <div className="py-8">
      <Container>
        <div className="w-full flex justify-center mb-4 relative border rounded-xl p-2">
          <img
            src={dbService.getFilePreview(post.FeatureImage)}
            alts={post.Title}
          />

          {isAuthor && (
            <div className="absolute right-6 top-6">
              <Link to={`/edit-post/${post.$id}`}>  
                <Button bgColor="bg-green-500" className="mr-3">
                  Edit
                </Button>
              </Link>
              <Button bgColor="bg-red-500" onClick={deletePost}>
                Delete
              </Button>
            </div>
          )}
        </div>
        <div className="w-full mb-6">
          <h1 className="text-2xl font-bold">{post.Title}</h1>
        </div>
        <div className="browser-css">{parse(post.Content)}</div>
      </Container>
    </div>
  ) : null;
};

export default Post;
