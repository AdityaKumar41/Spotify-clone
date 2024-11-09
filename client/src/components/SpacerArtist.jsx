import { Skeleton } from "@nextui-org/skeleton";

const SpacerArtist = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 mt-10">
      {/* Header Section */}
      <div className="flex gap-8 flex-col md:flex-row md:items-end">
        {/* Artist Image Skeleton */}
        <Skeleton className="rounded-lg">
          <div className="w-44 h-44"></div>
        </Skeleton>

        <div className="flex flex-col gap-3 flex-1">
          {/* Playlist Text */}
          <Skeleton className="rounded-lg">
            <div className="h-4 w-16"></div>
          </Skeleton>

          {/* Artist Name */}
          <Skeleton className="rounded-lg">
            <div className="h-16 w-3/4"></div>
          </Skeleton>

          {/* Stats Line */}
          <Skeleton className="rounded-lg">
            <div className="h-5 w-64"></div>
          </Skeleton>
        </div>
      </div>

      {/* Table Header */}
      <div className="mt-8 mb-4 px-6">
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 text-sm text-[#a7a7a7] border-b border-[#ffffff1a] pb-2">
          <Skeleton className="rounded-lg">
            <div className="h-4 w-20"></div>
          </Skeleton>
          <Skeleton className="rounded-lg hidden sm:block">
            <div className="h-4 w-20"></div>
          </Skeleton>
          <Skeleton className="rounded-lg">
            <div className="h-4 w-20"></div>
          </Skeleton>
          <Skeleton className="rounded-lg">
            <div className="h-4 w-20"></div>
          </Skeleton>
        </div>
      </div>

      {/* Song List Skeletons */}
      <div className="space-y-4">
        {[...Array(8)].map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-3 sm:grid-cols-4 gap-2 items-center px-6 py-2"
          >
            {/* Song Title with Number */}
            <Skeleton className="rounded-lg">
              <div className="h-12 flex items-center">
                <div className="w-8 h-4 mr-4"></div>
                <div className="w-8 h-8 mr-4"></div>
                <div className="flex-1 h-4"></div>
              </div>
            </Skeleton>

            {/* Album */}
            <Skeleton className="rounded-lg hidden sm:block">
              <div className="h-12"></div>
            </Skeleton>

            {/* Date Added */}
            <Skeleton className="rounded-lg">
              <div className="h-12"></div>
            </Skeleton>

            {/* Duration */}
            <Skeleton className="rounded-lg">
              <div className="h-12"></div>
            </Skeleton>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpacerArtist;
