const { serverInit } = require("./app");

async function init() {
  const app = await serverInit();
  app.listen(7000, () => {
    console.log("Server is running on http://localhost:7000");
  });
}

init();
