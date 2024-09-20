const { serverInit } = require("./app");

async function init() {
  const app = await serverInit();
  app.listen(8000, () => {
    console.log("Server is running on http://localhost:8000");
  });
}

init();
