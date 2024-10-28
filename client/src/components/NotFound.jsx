import React from "react";
import Navbar from "./Navbar";
import { Button } from "@nextui-org/button";
import { IconUserX } from "@tabler/icons-react";
import { Link } from "react-router-dom";

export const NotFound = () => {
  return (
    <div>
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <IconUserX className="w-24 h-24 text-gray-500 mb-6" />
        <h1 className="text-4xl font-bold mb-4">No User Found</h1>
        <p className="text-xl text-gray-400 mb-8">
          We couldn't find the user you're looking for.
        </p>
        <Button className="bg-green-500 hover:bg-green-600 text-black font-bold px-8 py-3 rounded-full">
          <Link to={"/"}>Go to Home</Link>
        </Button>
      </main>
    </div>
  );
};
