module.exports = {
  apps: [
    {
      name: "nci-wms",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      cwd: "./",
      watch: false,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
