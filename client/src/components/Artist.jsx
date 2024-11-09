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

      console.log("Initial Form Data:", data); // Debug log

      // 1. Get Signed URL for image upload
      const { getSignedURL } = await graphqlClient.request(GetSignedURL, {
        fileName: data.profilePicture[0].name,
        fileType: data.profilePicture[0].type,
        type: 'profile' // Specify the type if required by your backend
      });

      console.log("Got signed URL:", getSignedURL); // Debug log

      // 2. Upload image to S3
      await axios.put(getSignedURL, data.profilePicture[0], {
        headers: {
          "Content-Type": data.profilePicture[0].type,
        },
      });

      // 3. Extract the final image URL
      const imageUrl = getSignedURL.split('?')[0]; // Get the base URL without query parameters

      console.log("Final image URL:", imageUrl); // Debug log

      // 4. Prepare mutation data
      const mutationData = {
        artistName: data.artistName.trim(),
        bio: data.bio?.trim() || null,
        profilePicture: imageUrl,
        facebook: data.facebook?.trim() || null,
        twitter: data.twitter?.trim() || null,
        instagram: data.instagram?.trim() || null,
        website: data.website?.trim() || null,
        country: data.country?.trim() || null,
        genre: Array.isArray(data.genre) 
          ? data.genre.map(g => g.trim()) 
          : data.genre 
            ? [data.genre.trim()] 
            : []
      };

      console.log("Prepared Mutation Data:", mutationData); // Debug log

      // 5. Execute mutation
      const response = await mutate(mutationData);
      
      console.log("Mutation Response:", response); // Debug log

      toast.success("Artist profile created successfully!");
      
      // Optional: Redirect or perform other actions on success
      // navigate('/dashboard');
      
    } catch (error) {
      console.error("Error creating artist profile:", {
        message: error.message,
        response: error.response?.data,
        graphqlErrors: error.response?.errors,
        stack: error.stack
      });

      // More specific error messages
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.message.includes("Network")) {
        toast.error("Network error. Please check your connection.");
      } else if (error.message.includes("Unauthorized")) {
        toast.error("You must be logged in to create an artist profile.");
      } else {
        toast.error("Failed to create artist profile. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-spotify-green to-dark-bg text-white py-12 px-4 sm:px-6 lg:px-8 dark">
      <Card className="w-full max-w-2xl mx-auto bg-[#121212] border-[#282828]">
        <CardHeader className="border-b border-[#282828] flex flex-col items-start space-y-1">
          <h2 className="text-2xl font-bold text-[#1DB954]">
            Hello, Artist {user?.username}!
          </h2>
          <p className="text-[#B3B3B3]">
            Fill in your details to set up your artist profile on Spotify
          </p>
        </CardHeader>

        <CardBody className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Artist Name */}
            <div className="space-y-2">
              <input
                id="artist-name"
                placeholder="Enter your artist or band name"
                {...register("artistName", {
                  required: "Artist name is required",
                })}
                className="bg-[#282828] border-[#282828] text-white placeholder-[#535353] focus:ring-[#1DB954] focus:border-[#1DB954] w-full p-3 rounded-md"
                aria-label="Artist or Band Name"
              />
              {errors.artistName && (
                <p className="text-red-500 text-sm">
                  {errors.artistName.message}
                </p>
              )}
            </div>

            {/* Genre */}
            <div className="space-y-2">
              <select
                {...register("genre", { required: "Genre is required" })}
                className="bg-[#282828] border-[#282828] text-white placeholder-[#535353] focus:ring-[#1DB954] focus:border-[#1DB954] w-full p-3 rounded-md"
                aria-label="Select Genre"
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

            {/* Profile Picture */}
            <div className="space-y-2">
              <label htmlFor="profile-picture" className="block text-[#B3B3B3]">
                Upload your profile picture
              </label>
              <input
                id="profile-picture"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
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

              {/* Image Preview */}
              {imagePreview && (
                <div className="mt-4">
                  <img
                    src={imagePreview}
                    alt="Profile preview"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                </div>
              )}
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
                    value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
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
                      value: /^(https?:\/\/)?(www\.)?facebook.com\/[A-Za-z0-9-_]+$/,
                      message: "Invalid Facebook URL",
                    },
                  })}
                  placeholder="Facebook profile URL"
                  className="bg-[#282828] border-[#282828] text-white placeholder-[#535353] focus:ring-[#1DB954] focus:border-[#1DB954] w-full p-3 rounded-md"
                  aria-label="Facebook Profile URL"
                />
                {errors.facebook && (
                  <p className="text-red-500 text-sm">{errors.facebook.message}</p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <IconBrandTwitter className="text-[#1DA1F2]" />
                <input
                  {...register("twitter", {
                    pattern: {
                      value: /^(https?:\/\/)?(www\.)?twitter.com\/[A-Za-z0-9-_]+$/,
                      message: "Invalid Twitter URL",
                    },
                  })}
                  placeholder="Twitter profile URL"
                  className="bg-[#282828] border-[#282828] text-white placeholder-[#535353] focus:ring-[#1DB954] focus:border-[#1DB954] w-full p-3 rounded-md"
                  aria-label="Twitter Profile URL"
                />
                {errors.twitter && (
                  <p className="text-red-500 text-sm">{errors.twitter.message}</p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <IconBrandInstagram className="text-[#E4405F]" />
                <input
                  {...register("instagram", {
                    pattern: {
                      value: /^(https?:\/\/)?(www\.)?instagram.com\/[A-Za-z0-9-_]+$/,
                      message: "Invalid Instagram URL",
                    },
                  })}
                  placeholder="Instagram profile URL"
                  className="bg-[#282828] border-[#282828] text-white placeholder-[#535353] focus:ring-[#1DB954] focus:border-[#1DB954] w-full p-3 rounded-md"
                  aria-label="Instagram Profile URL"
                />
                {errors.instagram && (
                  <p className="text-red-500 text-sm">{errors.instagram.message}</p>
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
