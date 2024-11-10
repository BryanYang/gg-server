# 使用 Node.js 的官方基础镜像
FROM node:18

# 设置工作目录
WORKDIR /usr/src/app


# 复制 package.json 和 package-lock.json（如果存在）
COPY package*.json ./
COPY yarn.lock ./

# 复制项目文件到工作目录
COPY ./dist .
COPY ./migrations ./migrations
COPY ./config ./config

RUN npm config set registry http://mirrors.cloud.tencent.com/npm/
RUN yarn config set registry http://mirrors.cloud.tencent.com/npm/
# 安装项目依赖
RUN npm install -g pm2

# 暴露应用程序端口
EXPOSE 3000

# 启动应用程序
CMD ["sh", "-c", "yarn install && npx sequelize-cli db:migrate && pm2-runtime start main.js --name gg-server"]