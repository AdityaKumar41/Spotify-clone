import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@nextui-org/button";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { toast } from "react-hot-toast";
import {
  IconUpload,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTwitter,
  IconMusic,
  IconJumpRope,
} from "@tabler/icons-react";
import { useCreateArtist, useGetArtist } from "../hooks/useArtist";
import { NotFound } from "./NotFound";
import { graphqlClient } from "../api/app";
import { GetSignedURL } from "../graphql/query/user";
import { image } from "@nextui-org/theme";
import axios from "axios";
import { useMe } from "../hooks/useUser";

export default function Artist() {
  const { mutate } = useCreateArtist();
  const { data: user } = useMe();

  console.log(user);

  // const { data: artist } = useGetArtist(11);
  const [imagePreview, setImagePreview] = useState(null);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  if (!user) {
    return <NotFound />;
  }

  if (user?.artistId) {
    return <div>Hi {user.username}, you already have an artist account.</div>;
  }

  // Handle image preview
  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      if (!data.profilePicture?.[0]) {
        toast.error("Profile picture is required");
        return;
      }

      // Add loading toast
      const loadingToast = toast.loading('Creating artist profile...');

      // Log the file details
      console.log("Profile Picture File:", {
        name: data.profilePicture[0].name,
        type: data.profilePicture[0].type,
        size: data.profilePicture[0].size
      });

      // 1. Get Signed URL for image upload
      const { getSignedURL } = await graphqlClient.request(GetSignedURL, {
        fileName: `artist/${Date.now()}-${data.profilePicture[0].name}`, // Add timestamp to prevent duplicates
        fileType: data.profilePicture[0].type,
        type: "profile",
      });

      // 2. Upload image to S3 with error handling
      try {
        await axios.put(getSignedURL, data.profilePicture[0], {
          headers: {
            "Content-Type": data.profilePicture[0].type,
          },
          // Add timeout and other axios configs
          timeout: 30000, // 30 seconds timeout
        });
      } catch (uploadError) {
        console.error("S3 Upload Error:", uploadError);
        toast.error("Failed to upload image. Please try again.");
        toast.dismiss(loadingToast);
        return;
      }

      // 3. Extract the final image URL
      const imageUrl = getSignedURL.split("?")[0];

      // 4. Prepare mutation data with validation
      const mutationData = {
        artistName: data.artistName?.trim(),
        bio: data.bio?.trim() || "",
        profilePicture: imageUrl,
        facebook: data.facebook?.trim() || "",
        twitter: data.twitter?.trim() || "",
        instagram: data.instagram?.trim() || "",
        website: data.website?.trim() || "",
        country: data.country?.trim(),
        genre: data.genre ? [data.genre.trim()] : [],
      };

      // Validate required fields
      if (!mutationData.artistName || !mutationData.country) {
        toast.error("Please fill in all required fields");
        toast.dismiss(loadingToast);
        return;
      }

      // 5. Execute mutation with await
      const response = await mutate(mutationData);

      // Success handling
      toast.dismiss(loadingToast);
      toast.success("Artist profile created successfully!");

    } catch (error) {
      console.error("Detailed Error:", {
        name: error.name,
        message: error.message,
        response: error.response,
        stack: error.stack,
        graphqlErrors: error.response?.errors,
      });

      // More specific error handling
      let errorMessage = "Failed to create artist profile. Please try again.";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message.includes("Network")) {
        errorMessage = "Network error. Please check your connection.";
      } else if (error.message.includes("Unauthorized")) {
        errorMessage = "You must be logged in to create an artist profile.";
      }

      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-3xl mx-auto bg-[#121212] shadow-xl">
        <CardHeader className="border-b border-[#282828] px-8 py-6 flex flex-col justify-start">
          <h2 className="text-3xl font-bold text-white">
            Create Artist Profile
          </h2>
          <p className="text-[#A7A7A7] mt-2">Let's get you set up on Spotify</p>
        </CardHeader>

        <CardBody className="px-8 py-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Artist Name - Updated styling */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#A7A7A7]">
                Artist name
              </label>
              <input
                {...register("artistName", {
                  required: "Artist name is required",
                })}
                className="w-full bg-[#2A2A2A] border border-[#2A2A2A] text-white rounded-md p-3 
                          focus:ring-2 focus:ring-[#1DB954] focus:border-transparent
                          hover:border-white transition-colors"
                placeholder="Enter your artist or band name"
              />
              {errors.artistName && (
                <p className="text-[#F15E6C] text-sm mt-1">
                  {errors.artistName.message}
                </p>
              )}
            </div>

            {/* Genre - Updated styling */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#A7A7A7]">
                Genre
              </label>
              <select
                {...register("genre")}
                className="w-full bg-[#2A2A2A] border border-[#2A2A2A] text-white rounded-md p-3
                          focus:ring-2 focus:ring-[#1DB954] focus:border-transparent
                          hover:border-white transition-colors"
              >
                <option value="" disabled selected>
                  Select your genre
                </option>
                <option value="pop">Pop</option>
                <option value="rock">Rock</option>
                <option value="hiphop">Hip Hop</option>
                <option value="electronic">Electronic</option>
                <option value="jazz">Jazz</option>
                <option value="classical">Classical</option>
                <option value="other">Other</option>
              </select>
              {errors.genre && (
                <p className="text-red-500 text-sm">{errors.genre.message}</p>
              )}
            </div>

            {/* Biography */}
            <div className="space-y-2">
              <textarea
                id="bio"
                placeholder="Tell us about yourself and your music"
                {...register("bio", { required: "Biography is required" })}
                className="min-h-[100px] bg-[#282828] border-[#282828] text-white placeholder-[#535353] focus:ring-[#1DB954] focus:border-[#1DB954] outline-none w-full p-3 rounded-md"
                aria-label="Artist Biography"
              />
              {errors.bio && (
                <p className="text-red-500 text-sm">{errors.bio.message}</p>
              )}
            </div>

            {/* Profile Picture - Updated styling */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#A7A7A7]">
                Profile picture
              </label>
              <div className="flex items-center space-x-4">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile preview"
                    className="w-24 h-24 rounded-full object-cover border-2 border-[#1DB954]"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-[#2A2A2A] flex items-center justify-center">
                    <IconUpload className="w-8 h-8 text-[#A7A7A7]" />
                  </div>
                )}
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    {...register("profilePicture")}
                    className="max-w-[250px] bg-[#282828] border-[#282828] text-white"
                    aria-label="Profile Picture"
                    {...register("profilePicture", {
                      required: "Profile picture is required",
                    })}
                  />
                  {errors.profilePicture && (
                    <p className="text-red-500 text-sm">
                      {errors.profilePicture.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Country Selection */}
            <div className="space-y-2">
              <select
                {...register("country", { required: "Country is required" })}
                className="bg-[#282828] border-[#282828] text-white placeholder-[#535353] focus:ring-[#1DB954] focus:border-[#1DB954] w-full p-3 rounded-md"
                aria-label="Select Country"
              >
                <option value="" disabled selected>
                  Select your country
                </option>
                <option value="US">United States</option>
                <option value="UK">United Kingdom</option>
                <option value="CA">Canada</option>
                <option value="AU">Australia</option>
                <option value="IND">India</option>
                <option value="JP">Japan</option>
                <option value="KR">South Korea</option>
                <option value="CN">China</option>
                {/* Add more countries as needed */}
              </select>
              {errors.country && (
                <p className="text-red-500 text-sm">{errors.country.message}</p>
              )}
            </div>

            {/* Website URL */}
            <div className="space-y-2">
              <input
                {...register("website", {
                  pattern: {
                    value:
                      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                    message: "Invalid website URL",
                  },
                })}
                placeholder="Your website URL"
                className="bg-[#282828] border-[#282828] text-white placeholder-[#535353] focus:ring-[#1DB954] focus:border-[#1DB954] w-full p-3 rounded-md"
                aria-label="Website URL"
              />
              {errors.website && (
                <p className="text-red-500 text-sm">{errors.website.message}</p>
              )}
            </div>

            {/* Social Media Links */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <IconBrandFacebook className="text-[#1877F2]" />
                <input
                  {...register("facebook", {
                    pattern: {
                      value:
                        /^(https?:\/\/)?(www\.)?facebook.com\/[A-Za-z0-9-_]+$/,
                      message: "Invalid Facebook URL",
                    },
                  })}
                  placeholder="Facebook profile URL"
                  className="bg-[#282828] border-[#282828] text-white placeholder-[#535353] focus:ring-[#1DB954] focus:border-[#1DB954] w-full p-3 rounded-md"
                  aria-label="Facebook Profile URL"
                />
                {errors.facebook && (
                  <p className="text-red-500 text-sm">
                    {errors.facebook.message}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <IconBrandTwitter className="text-[#1DA1F2]" />
                <input
                  {...register("twitter", {
                    pattern: {
                      value:
                        /^(https?:\/\/)?(www\.)?twitter.com\/[A-Za-z0-9-_]+$/,
                      message: "Invalid Twitter URL",
                    },
                  })}
                  placeholder="Twitter profile URL"
                  className="bg-[#282828] border-[#282828] text-white placeholder-[#535353] focus:ring-[#1DB954] focus:border-[#1DB954] w-full p-3 rounded-md"
                  aria-label="Twitter Profile URL"
                />
                {errors.twitter && (
                  <p className="text-red-500 text-sm">
                    {errors.twitter.message}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <IconBrandInstagram className="text-[#E4405F]" />
                <input
                  {...register("instagram", {
                    pattern: {
                      value:
                        /^(https?:\/\/)?(www\.)?instagram.com\/[A-Za-z0-9-_]+$/,
                      message: "Invalid Instagram URL",
                    },
                  })}
                  placeholder="Instagram profile URL"
                  className="bg-[#282828] border-[#282828] text-white placeholder-[#535353] focus:ring-[#1DB954] focus:border-[#1DB954] w-full p-3 rounded-md"
                  aria-label="Instagram Profile URL"
                />
                {errors.instagram && (
                  <p className="text-red-500 text-sm">
                    {errors.instagram.message}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-[#1DB954] hover:bg-[#1ED760] text-black font-bold"
            >
              <IconMusic className="mr-2 h-4 w-4" /> Create Artist Account
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
