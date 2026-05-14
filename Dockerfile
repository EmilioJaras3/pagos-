FROM node:20-alpine
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY package.json pnpm-lock.yaml ./
RUN pnpm install
COPY tsconfig.json ./
COPY src/ ./src/
EXPOSE 3001
CMD ["pnpm", "run", "dev"]
