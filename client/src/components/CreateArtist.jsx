import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import {
  IconChevronRight,
  IconGlobe,
  IconPlaystationCircle,
  IconTrendingUp,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";
// import { useCurrentUser } from "../hooks/user";
import { useMe } from "../hooks/useUser";

export default function Artist() {
  const { data: user } = useMe();
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <main className="flex-grow flex flex-col items-center justify-center p-4 md:p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Share Your Music with the World
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Join millions of artists on Spotify and start your journey to global
            stardom.
          </p>
        </div>

        <Button className="bg-green-500 hover:bg-green-600 text-black font-bold text-lg px-8 py-6 rounded-full mb-12">
          <Link to={`/artist/${user.id}`}>
            <div className="flex items-center">
              <p>Create Artist Account</p>
              <IconChevronRight className="ml-2 w-5 h-5" />
            </div>
          </Link>
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <IconGlobe className="w-8 h-8 text-green-500 mb-2" />
              Global Reach
            </CardHeader>
            <CardBody>
              <p className="text-gray-400">
                Connect with listeners from all around the world and expand your
                fanbase.
              </p>
            </CardBody>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <IconTrendingUp className="w-8 h-8 text-green-500 mb-2" />
              Powerful Analytics
            </CardHeader>
            <CardBody>
              <p className="text-gray-400">
                Gain insights into your audience and track your music's
                performance.
              </p>
            </CardBody>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <IconPlaystationCircle className="w-8 h-8 text-green-500 mb-2" />
              Playlist Opportunities
            </CardHeader>
            <CardBody>
              <p className="text-gray-400">
                Get your music featured on popular playlists and reach new
                listeners.
              </p>
            </CardBody>
          </Card>
        </div>
      </main>
    </div>
  );
}
