# Stage 2: Run
FROM node:20.17.0-alpine AS runner
WORKDIR /app

RUN apk add --no-cache curl

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

EXPOSE 3000
ENV NODE_ENV=production

CMD ["sh", "./entrypoint.sh"]
