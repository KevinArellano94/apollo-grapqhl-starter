FROM denoland/deno:2.1.10

WORKDIR /app

COPY . .

RUN deno cache main.ts

RUN deno --allow-env --allow-read --allow-net --allow-run ./main.ts