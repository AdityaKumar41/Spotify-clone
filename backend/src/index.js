const { serverInit } = require("./app");

async function init() {
  const app = await serverInit();
  const PORT = process.env.PORT || 7000;
  app.listen(PORT, () => {
    console.log("Server is running on http://localhost:7000");
  });
}

init();
