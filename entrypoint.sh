#!/bin/sh

echo "⏳ Running database init..."
npm run db:init

echo "🚀 Starting app..."
exec node dist/main.js
