import { GoogleLogin } from "@react-oauth/google";
import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { VerifyGoogleToken } from "../graphql/query/user";
import { toast } from "react-hot-toast";
import { graphqlClient } from "../api/app";

export default function Singup() {
  const queryClient = useQueryClient();
  const handleOnSuccess = useCallback(
    async (cred) => {
      const googleToken = cred.credential;
      if (!googleToken) return toast.error("Google Token not found!");
      const { verifyGoogleToken } = await graphqlClient.request(
        VerifyGoogleToken,
        {
          token: googleToken,
        }
      );

      toast.success("Verified Success!");
      if (verifyGoogleToken)
        window.localStorage.setItem("fy_token", verifyGoogleToken);

      await queryClient.invalidateQueries({ queryKey: ["me"] });
    },
    [queryClient]
  );
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="w-full max-w-md p-8 space-y-8">
        <div className="flex justify-center">
          <svg
            className="w-10 h-10 text-white"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
          </svg>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Log in to Spotify
        </h2>
        <div className="mt-8 space-y-6">
          <div className="space-y-2">
            <GoogleLogin onSuccess={handleOnSuccess} />
          </div>
          <hr className="bg-[#282828]" />
          <form className="mt-8 space-y-6">
            <div className="rounded-md shadow-sm -space-y-px flex flex-col gap-4">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="bg-[#121212] text-white border-[#282828] focus:ring-[#1DB954] focus:border-[#1DB954] w-full p-3 rounded-md"
                  placeholder="Email or username"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="bg-[#121212] text-white border-[#282828] focus:ring-[#1DB954] focus:border-[#1DB954] w-full p-3 rounded-md"
                  placeholder="Password"
                />
              </div>
            </div>

            <div>
              <Button className="w-full bg-[#1DB954] hover:bg-[#1ED760] text-black font-bold py-3 px-4 rounded-full">
                Log In
              </Button>
            </div>
          </form>
          <div className="text-center">
            <a
              href="#"
              className="font-medium text-[#1DB954] hover:text-[#1ED760]"
            >
              Forgot your password?
            </a>
          </div>
        </div>
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-400">
            Don't have an account?{" "}
            <a
              href="#"
              className="font-medium text-[#1DB954] hover:text-[#1ED760]"
            >
              Sign up for Spotify
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
