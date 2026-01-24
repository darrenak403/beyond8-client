# ===========================================
# Beyond8 Frontend - Multi-stage Dockerfile
# Next.js 16.1.1 + React 19
# ===========================================

# --- Stage 1: Dependencies ---
FROM node:22-alpine AS deps
WORKDIR /app

# Cài đặt dependencies cần thiết cho native modules (sharp, etc.)
RUN apk add --no-cache libc6-compat

# Copy package files
COPY package.json package-lock.json* ./

# Cài đặt dependencies
RUN npm ci --legacy-peer-deps

# --- Stage 2: Builder ---
FROM node:22-alpine AS builder
WORKDIR /app

# Copy dependencies từ stage trước
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Tắt Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED=1

# Build arguments cho environment variables
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Build ứng dụng
RUN npm run build

# --- Stage 3: Runner (Production) ---
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Cài đặt sharp cho image optimization (Next.js 16 recommendation)
RUN apk add --no-cache libc6-compat

# Tạo user non-root để bảo mật
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public folder
COPY --from=builder /app/public ./public

# Set permission cho prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copy standalone build output (Next.js 16 structure)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Chuyển sang user non-root
USER nextjs

# Expose port 5173
EXPOSE 5173

# Set port environment variable
ENV PORT=5173
ENV HOSTNAME="0.0.0.0"

# Chạy server (Next.js 16 standalone server)
CMD ["node", "server.js"]
