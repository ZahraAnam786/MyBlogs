import React, { useCallback } from "react";
import { Button, Select, Input, RTE } from "../../Components/index";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import dbService from "../../appwriteService/dbService";
import { useForm } from "react-hook-form";
import { ID } from "appwrite";

const PostForm = ({ post }) => {
  const { register, handleSubmit, watch, setValue, getValues, control } =
    useForm({
      defaultValues: {
        Title: post?.Title || "",
        slug: post?.$id || "",
        Content: post?.Content || "",
        FeatureImage: post?.FeatureImage || "",
        Status: post?.Status || "active",
        UserID: post?.UserID || "",
      },
    });

  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  const postSubmit = async (data) => {
    if (post) {
      let file = post.FeatureImage;
    //  console.log(typeof post.FeatureImage);   
      if (data.FeatureImage !== post.FeatureImage) {
         file = data.FeatureImage[0]
          ? dbService.fileUpload(data.FeatureImage[0])
          : null;

        // if new file upload then delete previous image
        if (file) dbService.fileDelete(post.FeatureImage);
      }
      const updatePost = await dbService.updatePost(post.$id, {
        ...data,
        FeatureImage: file ? file.$id : undefined,
      });

      if (updatePost) {
        navigate(`/post/${updatePost.$id}`);
      }
    } else {
      const file = data.FeatureImage[0]
        ? await dbService.fileUpload(data.FeatureImage[0])
        : null;
      data.FeatureImage = file.$id;

      const savePost = await dbService.createPost({
        ...data,
        UserID: userData.$id,
      });

      if (savePost) {
        navigate(`/post/${savePost.$id}`);
      }
    }
  };

  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string")
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s]+/g, "-")
        .replace(/\s/g, "-");

    return "";
    //  const slug = value.toLowerCase().replace(/ /g, '-');
    //  setValue('slug', slug);
    //  return slug;
  }, []);

  React.useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "Title") {
        setValue("slug", slugTransform(value.Title, { shouldValidate: true }));
      }
    });

    //  interview question when call method in useEffect so how we can optimize so use unsubscribe
    return () => {
      subscription.unsubscribe();
    };
  }, [watch, slugTransform, setValue]);

  return (
    <form onSubmit={handleSubmit(postSubmit)} className="flex flex-wrap">
      <div className="w-2/3 px-2">
        <Input
          label="Title :"
          className="mb-4"
          placeholder="Title"
          {...register("Title", { required: true })}
        />

        <Input
          label="Slug :"
          className="mb-4"
          placeholder="Slug"
          {...register("slug", { required: true })}
          onInput={(e) => {
            setValue("slug", slugTransform(e.currentTarget.value), {
              shouldValidate: true,
            });
          }}
        />

        <RTE
          name="Content"
          label="Content"
          control={control}
          defaultValue={getValues("Content") || ""}
        />
      </div>
      <div className="w-1/3 px-2">
        <Input
          label="Featured Image :"
          type="file"
          className="mb-4"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          {...register("FeatureImage", { required: !post })}
        />

        {post && (
          <div className="w-full md-4">
            <img
              src={dbService.getFilePreview(post.FeatureImage)}
              alt={post.Title}
              className="rounded-lg"
            />
          </div>
        )}

        <Select
          label="Status"
          className="mb-4"
          option={["active", "inactive"]}
          {...register("Status", { required: true })}
        />

        <Button
          type="submit"
          bgColor={post ? "bg-green-500" : undefined}
          className="w-full"
        >
          {post ? "Update" : "Submit"}
        </Button>
      </div>
    </form>
  );
};

export default PostForm;
