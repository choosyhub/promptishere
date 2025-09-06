const { exec } = require("child_process");

const process = exec("npm run dev");

process.stdout.on("data", (data) => {
  console.log(data.toString());
});

process.stderr.on("data", (data) => {
  console.error(data.toString());
});
