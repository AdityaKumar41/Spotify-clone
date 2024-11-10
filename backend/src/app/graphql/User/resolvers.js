const prismaClient = require("../../client/app");
const axios = require("axios");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
require("dotenv").config();

const JWTServices = require("../../jwt/jwt");

const s3Client = new S3Client([
  {
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  },
]);

const Query = {
  verifyGoogleToken: async (parent, { token }) => {
    try {
      console.log("Verifying Google token");
      const GoogleAuthToken = token;
      const GoogleAuthUrl = new URL("https://oauth2.googleapis.com/tokeninfo");
      GoogleAuthUrl.searchParams.set("id_token", GoogleAuthToken);

      const response = await axios.get(GoogleAuthUrl.toString(), {
        responseType: "json",
      });

      const data = response.data;

      // Check if the user already exists
      let user = await prismaClient.user.findUnique({
        where: { email: data.email },
        include: {
          artist: true,
        },
      });

      // Create user if not found
      if (!user) {
        // Generate a unique username if email username is taken
        let username = data.email.slice(0, data.email.indexOf("@"));
        const existingUser = await prismaClient.user.findUnique({
          where: { username },
          include: {
            artist: true,
          },
        });

        if (existingUser) {
          username = `${username}${Math.floor(Math.random() * 1000)}`;
        }

        user = await prismaClient.user.create({
          data: {
            email: data.email,
            username: username,
            profileImage: data.picture || null,
            createdAt: new Date(),
            lastLogin: new Date(),
            // Optional fields from your schema
            country: null,
            dateOfBirth: null,
          },
          include: {
            playlists: true,
            followers: true,
            following: true,
            artist: true,
          },
        });
      } else {
        // Update last login for existing user
        await prismaClient.user.update({
          where: { id: user.id },
          data: {
            lastLogin: new Date(),
          },
        });
      }

      if (!user) throw new Error("User creation failed");

      console.log(user);

      const userToken = JWTServices.GenerateJWT(user);
      return userToken;
    } catch (error) {
      console.error("Error verifying Google token:", error);
      throw new Error("Failed to verify Google token");
    }
  },

  // User queries
  me: async (_parent, _args, context) => {
    if (!context.user) throw new Error("Unauthorized");
    return await prismaClient.user.findUnique({
      where: { id: context.user.id },
      include: {
        playlists: true,
        savedTracks: true,
        savedAlbums: true,
        following: true,
        followers: true,
        artist: true,
      },
    });
  },

  getUser: async (_parent, { id }) => {
    return await prismaClient.user.findUnique({
      where: { id },
      include: {
        playlists: { where: { isPublic: true } },
        followers: true,
        following: true,
      },
    });
  },

  searchUsers: async (_parent, { query }) => {
    return await prismaClient.user.findMany({
      where: {
        OR: [
          { username: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
        ],
      },
    });
  },

  // Track queries
  getTrack: async (_parent, { id }) => {
    return await prismaClient.track.findUnique({
      where: { id },
      include: {
        artist: true,
        album: true,
        featuredArtists: true,
      },
    });
  },

  getTracks: async (_parent, { ids }) => {
    return await prismaClient.track.findMany({
      where: { id: { in: ids } },
      include: {
        artist: true,
        album: true,
        featuredArtists: true,
      },
    });
  },

  searchTracks: async (_parent, { query }) => {
    return await prismaClient.track.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { artist: { name: { contains: query, mode: "insensitive" } } },
        ],
      },
      include: {
        artist: true,
        album: true,
      },
    });
  },

  // Artist queries
  getArtist: async (_parent, { id }) => {
    try {
      // Convert string ID to integer
      const artistId = parseInt(id, 10);

      // Validate if conversion was successful
      if (isNaN(artistId)) {
        throw new Error("Invalid artist ID");
      }

      const artist = await prismaClient.artist.findUnique({
        where: {
          id: artistId,
        },
        include: {
          albums: true,
          genres: true,
        },
      });

      console.log(artist);

      return artist;
    } catch (error) {
      console.error("Error fetching artist:", error);
      throw error;
    }
  },

  getArtistTopTracks: async (_parent, { id }) => {
    return await prismaClient.track.findMany({
      where: { artistId: id },
      orderBy: { playCount: "desc" },
      take: 10,
      include: {
        artist: true,
        album: true,
      },
    });
  },

  // Playlist queries
  getPlaylist: async (_parent, { id }, context) => {
    const playlist = await prismaClient.playlist.findUnique({
      where: { id },
      include: {
        tracks: { include: { artist: true } },
        owner: true,
      },
    });

    if (!playlist.isPublic && playlist.userId !== context.user?.id) {
      throw new Error("Not authorized to view this playlist");
    }

    return playlist;
  },

  getUserPlaylists: async (_parent, { userId }, context) => {
    const where = { userId };
    if (userId !== context.user?.id) {
      where.isPublic = true;
    }

    return await prismaClient.playlist.findMany({
      where,
      include: {
        tracks: { include: { artist: true } },
        owner: true,
      },
    });
  },

  getSongs: async () => {
    try {
      return await prismaClient.song.findMany({
        include: {
          artist: true,
        },
        orderBy: {
          releaseDate: "desc", // Show newest songs first
        },
      });
    } catch (error) {
      console.error("Error fetching songs:", error);
      throw new Error("Failed to fetch songs");
    }
  },

  searchSongs: async (_parent, { query }) => {
    try {
      if (!query) {
        throw new Error("Search query cannot be empty");
      }

      return await prismaClient.song.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { artist: { name: { contains: query, mode: "insensitive" } } },
            { album: { title: { contains: query, mode: "insensitive" } } },
          ],
        },
        include: {
          artist: true,
        },
        orderBy: {
          releaseDate: "desc",
        },
      });
    } catch (error) {
      console.error("Error searching songs:", error);
      throw new Error("Failed to search songs");
    }
  },

  getSongByArtist: async (_parent, { artistId }) => {
    try {
      if (!artistId) {
        throw new Error("Artist ID is required");
      }

      // Convert string ID to integer if needed
      const parsedArtistId =
        typeof artistId === "string" ? parseInt(artistId, 10) : artistId;

      if (isNaN(parsedArtistId)) {
        throw new Error("Invalid artist ID");
      }

      console.log(parsedArtistId);

      return await prismaClient.song.findMany({
        where: {
          artist: {
            id: parsedArtistId,
          },
        },
        include: {
          artist: true,
          genres: true,
        },
        orderBy: {
          releaseDate: "desc",
        },
      });
    } catch (error) {
      console.error("Error fetching artist songs:", error);
      throw new Error(`Failed to fetch songs for artist: ${error.message}`);
    }
  },

  getArtists: async () => {
    return await prismaClient.artist.findMany({
      include: { user: true, songs: true, albums: true, genres: true },
    });
  },

  // Upload URL generation
  getSignedURL: async (_parent, args, ctx) => {
    try {
      if (!ctx.user) throw new Error("Unauthorized");
      const { fileName, fileType, type } = args;

      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "audio/mpeg",
        "audio/mp3",
      ];
      if (!allowedTypes.includes(fileType))
        throw new Error("Invalid file type");

      // Determine the folder based on type (profile, track, album)
      const folder =
        type === "track"
          ? "tracks"
          : type === "album"
          ? "albums"
          : type === "profile"
          ? "profiles"
          : "misc";

      const putObjectCommand = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${folder}/${ctx.user.id}/${fileName}`,
        ContentType: fileType,
      });

      const signedURL = await getSignedUrl(s3Client, putObjectCommand, {
        expiresIn: 60 * 5, // 5 minutes
      });

      return signedURL;
    } catch (error) {
      console.error("Error getting signed URL:", error);
      throw new Error("Failed to get signed URL");
    }
  },

  getGenres: async () => {
    return await prismaClient.genre.findMany({
      include: { songs: true, artists: true, albums: true },
    });
  },

  getGenre: async (_parent, { id }) => {
    try {
      // Parse ID and validate
      const genreId = parseInt(id, 10);
      if (isNaN(genreId)) {
        throw new Error("Invalid genre ID format");
      }

      const genre = await prismaClient.genre.findUnique({
        where: {
          id: genreId,
        },
        include: {
          songs: {
            include: {
              artist: true, // Include artist details for each song
              album: true, // Include album details
              genres: true, // Include other genres the song might belong to
            },
            orderBy: {
              releaseDate: "desc", // Sort songs by release date
            },
          },
          artists: {
            include: {
              songs: true, // Include artists' songs
              albums: true, // Include artists' albums
            },
          },
        },
      });

      if (!genre) {
        throw new Error(`Genre with ID ${id} not found`);
      }

      console.log("Found genre:", {
        id: genre.id,
        name: genre.name,
        songCount: genre.songs.length,
        artistCount: genre.artists.length,
      });

      return genre;
    } catch (error) {
      console.error("Error fetching genre:", error);
      throw new Error(`Failed to fetch genre: ${error.message}`);
    }
  },
};

const Mutation = {
  updateUser: async (_parent, args) => {
    try {
      return await prismaClient.user.update({
        where: { id: args.id },
        data: {
          username: args.username,
          email: args.email,
          password: args.password,
          profileImage: args.profileImage,
        },
      });
    } catch (error) {
      throw new Error(`Failed to update user with id ${args.id}`);
    }
  },

  deleteUser: async (_parent, args) => {
    try {
      return await prismaClient.user.delete({ where: { id: args.id } });
    } catch (error) {
      throw new Error(`Failed to delete user with id ${args.id}`);
    }
  },

  createSong: async (_parent, args, context) => {
    try {
      if (!context.user) throw new Error("Unauthorized");

      console.log("User context:", context.user);
      console.log("Input received:", args.input);

      // Find the artist ID for the logged-in user
      const userWithArtist = await prismaClient.user.findUnique({
        where: {
          id: context.user.id,
        },
        include: {
          artist: true,
        },
      });

      if (!userWithArtist || !userWithArtist.artist) {
        throw new Error("User does not have an artist profile");
      }

      // First ensure all genres exist by upserting them
      const genrePromises = args.input.genre.map((genreName) =>
        prismaClient.genre.upsert({
          where: { name: genreName },
          update: {}, // No updates needed
          create: { name: genreName },
        })
      );

      // Wait for all genres to be created/verified
      await Promise.all(genrePromises);

      console.log("Found artist:", userWithArtist.artist);

      // Create the song using the artist ID from the user query
      const newSong = await prismaClient.song.create({
        data: {
          title: args.input.title,
          duration: parseInt(args.input.duration),
          releaseDate: new Date(args.input.releaseDate),
          fileUrl: args.input.fileUrl,
          coverImage: args.input.coverImage,
          artist: {
            connect: {
              id: parseInt(userWithArtist.artist.id),
            },
          },
          genres: {
            connect: args.input.genre.map((genreName) => ({
              name: genreName,
            })),
          },
        },
        include: {
          artist: true,
          genres: true,
        },
      });

      console.log("Created song:", newSong);
      return newSong;
    } catch (error) {
      console.error("Error creating song:", error);
      throw new Error(`Failed to create song: ${error.message}`);
    }
  },

  updateSong: async (_parent, args, context) => {
    try {
      if (!context.user) throw new Error("Unauthorized");
      return await prismaClient.song.update({
        where: { id: args.id },
        data: {
          title: args.title,
          artistId: args.artistId,
          duration: args.duration,
          releaseDate: args.releaseDate
            ? new Date(args.releaseDate)
            : undefined,
          fileUrl: args.fileUrl,
        },
      });
    } catch (error) {
      throw new Error(`Failed to update song with id ${args.id}`);
    }
  },

  deleteSong: async (_parent, args, context) => {
    const formatedId = parseInt(args.id, 10);
    try {
      // Check authentication
      if (!context.user) {
        throw new Error("Authentication required");
      }

      // Find the song and include artist information
      const song = await prismaClient.song.findUnique({
        where: { id: formatedId },
        include: {
          artist: true,
        },
      });

      // Check if song exists
      if (!song) {
        throw new Error(`Song with id ${args.id} not found`);
      }

      // // Verify ownership - user must be the artist who created the song
      // if (song.artist.userId !== context.user.id) {
      //   throw new Error("Unauthorized: You can only delete your own songs");
      // }

      // Delete the song
      await prismaClient.song.delete({
        where: { id: formatedId },
      });

      return true;
    } catch (error) {
      console.error("Delete song error:", error);

      // Return more specific error messages based on error type
      if (error.code === "P2025") {
        throw new Error("Song not found or already deleted");
      }

      throw new Error(`Failed to delete song: ${error.message}`);
    }
  },

  createArtist: async (_parent, args, ctx) => {
    if (!ctx.user) throw new Error("Unauthorized");

    try {
      console.log("User context:", ctx.user);
      console.log("Input args:", args);

      // First create or get all genres and collect their IDs
      const genres = await Promise.all(
        args.genre.map(async (genreName) => {
          const genre = await prismaClient.genre.upsert({
            where: { name: genreName },
            create: { name: genreName },
            update: {},
          });
          return genre;
        })
      );

      const artistData = {
        name: args.artistName,
        image: args.profilePicture || null,
        bio: args.bio || null,
        facebook: args.facebook || null,
        twitter: args.twitter || null,
        instagram: args.instagram || null,
        website: args.website || null,
        verified: false,
        monthlyListeners: 0,
        user: {
          connect: {
            id: ctx.user.id,
          },
        },
        genres: {
          connect: genres.map((genre) => ({
            id: genre.id, // Connect using genre IDs instead of names
          })),
        },
      };

      console.log("Artist data to create:", artistData);

      const createdArtist = await prismaClient.artist.create({
        data: artistData,
        include: {
          genres: true,
          user: true,
          songs: true,
          albums: true,
        },
      });

      console.log("Created artist:", createdArtist);
      return createdArtist;
    } catch (error) {
      console.error("Create Artist Error Details:", {
        error: error.message,
        code: error.code,
        meta: error.meta,
      });
      throw new Error(`Failed to create artist: ${error.message}`);
    }
  },

  updateArtist: async (_parent, args) => {
    try {
      return await prismaClient.artist.update({
        where: { id: args.id },
        data: { name: args.name },
      });
    } catch (error) {
      throw new Error(`Failed to update artist with id ${args.id}`);
    }
  },

  deleteArtist: async (_parent, args) => {
    try {
      return await prismaClient.artist.delete({ where: { id: args.id } });
    } catch (error) {
      throw new Error(`Failed to delete artist with id ${args.id}`);
    }
  },

  createPlaylist: async (_parent, args, context) => {
    try {
      if (!context.user) throw new Error("Unauthorized"); // Check for authentication
      return await prismaClient.playlist.create({
        data: {
          title: args.title,
          description: args.description, // 'description' should match the field name in your schema
          Song: { connect: { id: args.songId } }, // Connect to the song by ID
          User: { connect: { id: context.user.id } }, // Connect to the user by ID
          userId: context.user.id,
        },
      });
    } catch (error) {
      console.error(error);
      throw new Error("Failed to create playlist.");
    }
  },

  // User mutations
  updateProfile: async (_parent, { input }, context) => {
    if (!context.user) throw new Error("Unauthorized");
    return await prismaClient.user.update({
      where: { id: context.user.id },
      data: input,
    });
  },

  followUser: async (_parent, { userId }, context) => {
    if (!context.user) throw new Error("Unauthorized");
    await prismaClient.user.update({
      where: { id: context.user.id },
      data: {
        following: { connect: { id: userId } },
      },
    });
    return true;
  },

  unfollowUser: async (_parent, { userId }, context) => {
    if (!context.user) throw new Error("Unauthorized");
    await prismaClient.user.update({
      where: { id: context.user.id },
      data: {
        following: { disconnect: { id: userId } },
      },
    });
    return true;
  },

  // Playlist mutations
  createPlaylist: async (_parent, { input }, context) => {
    if (!context.user) throw new Error("Unauthorized");
    return await prismaClient.playlist.create({
      data: {
        ...input,
        owner: { connect: { id: context.user.id } },
        userId: context.user.id,
      },
    });
  },

  addTrackToPlaylist: async (
    _parent,
    { playlistId, trackId, position },
    context
  ) => {
    if (!context.user) throw new Error("Unauthorized");

    const playlist = await prismaClient.playlist.findUnique({
      where: { id: playlistId },
      include: { tracks: true },
    });

    if (playlist.userId !== context.user.id) {
      throw new Error("Not authorized to modify this playlist");
    }

    return await prismaClient.playlist.update({
      where: { id: playlistId },
      data: {
        tracks: {
          connect: { id: trackId },
        },
      },
      include: { tracks: true },
    });
  },

  // Artist mutations
  updateArtistProfile: async (_parent, { input }, context) => {
    if (!context.user) throw new Error("Unauthorized");
    // Verify user is an artist
    const artist = await prismaClient.artist.findUnique({
      where: { userId: context.user.id },
    });
    if (!artist) throw new Error("User is not an artist");

    return await prismaClient.artist.update({
      where: { id: artist.id },
      data: input,
    });
  },

  // Track mutations
  uploadTrack: async (_parent, { input }, context) => {
    if (!context.user) throw new Error("Unauthorized");

    // Verify user is an artist
    const artist = await prismaClient.artist.findUnique({
      where: { userId: context.user.id },
    });
    if (!artist) throw new Error("User is not an artist");

    return await prismaClient.track.create({
      data: {
        ...input,
        artist: { connect: { id: artist.id } },
      },
    });
  },

  // Album mutations
  createAlbum: async (_parent, { input }, context) => {
    if (!context.user) throw new Error("Unauthorized");

    // Verify user is an artist
    const artist = await prismaClient.artist.findUnique({
      where: { userId: context.user.id },
    });
    if (!artist) throw new Error("User is not an artist");

    return await prismaClient.album.create({
      data: {
        ...input,
        artist: { connect: { id: artist.id } },
      },
    });
  },
};

const resolvers = { Query, Mutation };

module.exports = resolvers;
