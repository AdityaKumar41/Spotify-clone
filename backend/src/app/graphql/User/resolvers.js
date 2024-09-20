const prismaClient = require("../../client/app");
const axios = require("axios");
const JWTServices = require("../../jwt/jwt");

const Query = {
  verifyGoogleToken: async (parent, { token }) => {
    try {
      const GoogleAuthToken = token;
      const GoogleAuthUrl = new URL("https://oauth2.googleapis.com/tokeninfo");
      GoogleAuthUrl.searchParams.set("id_token", GoogleAuthToken);

      // Correct axios call
      const response = await axios.get(GoogleAuthUrl.toString(), {
        responseType: "json",
      });

      const data = response.data;
      console.log(data);

      // Check if the user already exists
      let user = await prismaClient.user.findUnique({
        where: { email: data.email },
      });

      // Create user if not found
      if (!user) {
        user = await prismaClient.user.create({
          data: {
            email: data.email,
            username: data.email,
            profileImage: data.picture,
          },
        });
      }

      if (!user) throw new Error("User creation failed");

      // Generate token using JWTServices
      const userToken = JWTServices.GenerateJWT(user);

      return userToken;
    } catch (error) {
      console.error("Error verifying Google token:", error);
      throw new Error("Failed to verify Google token");
    }
  },

  getCurrentUser: async (_parent, _args, context) => {
    if (!context.user) throw new Error("Unauthorized");
    return await prismaClient.user.findUnique({
      where: { id: context.user.id },
    });
  },
  getUser: async (_parent, args) => {
    try {
      return await prismaClient.user.findUnique({ where: { id: args.id } });
    } catch (error) {
      throw new Error(`Failed to fetch user with id ${args.id}`);
    }
  },

  listUsers: async () => {
    try {
      return await prismaClient.user.findMany();
    } catch (error) {
      throw new Error("Failed to fetch users.");
    }
  },

  getSong: async (_parent, args) => {
    try {
      return await prismaClient.song.findUnique({
        where: { id: args.id },
        include: { artist: true },
      });
    } catch (error) {
      throw new Error(`Failed to fetch song with id ${args.id}`);
    }
  },

  listSongs: async () => {
    try {
      return await prismaClient.song.findMany({ include: { artist: true } });
    } catch (error) {
      throw new Error("Failed to fetch songs.");
    }
  },

  getArtist: async (_parent, args) => {
    try {
      return await prismaClient.artist.findUnique({
        where: { id: args.id },
        include: { Song: true },
      });
    } catch (error) {
      throw new Error(`Failed to fetch artist with id ${args.id}`);
    }
  },

  listArtists: async () => {
    try {
      return await prismaClient.artist.findMany({ include: { Song: true } });
    } catch (error) {
      throw new Error("Failed to fetch artists.");
    }
  },
};

const Mutation = {
  createUser: async (_parent, args) => {
    try {
      return await prismaClient.user.create({
        data: {
          username: args.username,
          email: args.email,
          password: args.password,
          profileImage: args.profileImage,
        },
      });
    } catch (error) {
      throw new Error("Failed to create user.");
    }
  },

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
      return await prismaClient.song.create({
        data: {
          title: args.title,
          artistId: args.artistId,
          duration: args.duration,
          releaseDate: new Date(args.releaseDate),
          fileUrl: args.fileUrl,
        },
      });
    } catch (error) {
      throw new Error("Failed to create song.");
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
    try {
      if (!context.user) throw new Error("Unauthorized");
      return await prismaClient.song.delete({ where: { id: args.id } });
    } catch (error) {
      throw new Error(`Failed to delete song with id ${args.id}`);
    }
  },

  createArtist: async (_parent, args) => {
    try {
      return await prismaClient.artist.create({
        data: { name: args.name },
      });
    } catch (error) {
      throw new Error("Failed to create artist.");
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
};

const resolvers = { Query, Mutation };

module.exports = resolvers;
