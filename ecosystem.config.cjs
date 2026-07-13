/** @type {import('pm2').StartOptions} */
module.exports = {
  apps: [
    {
      name: "academic-sharing",
      cwd: __dirname,
      // 不要用 `bun run start`：它会调用 next CLI，仍走系统 Node（你服务器上是 18.x）
      // 用 bun --bun 直接跑 Next，走 Bun 运行时，不依赖 Node 20
      script: "bun",
      args: "--bun ./node_modules/next/dist/bin/next start",
      interpreter: "none",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: 14001,
        // PM2 后台进程的 PATH 常不含 bun，显式加上
        PATH: `${process.env.HOME}/.bun/bin:/usr/local/bin:/usr/bin:/bin`,
      },
      time: true,
    },
  ],
};
