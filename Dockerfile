FROM denoland/deno:latest

WORKDIR /app

COPY deno.json* .

RUN deno cache main.ts

COPY . .

EXPOSE 8000

CMD ["deno", "run", "--allow-net", "--allow-env", "--allow-read", "--allow-sys", "main.ts"]
