// 
import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { gptPrompt } from "./shared/openai.ts";
import { ask, say } from "./shared/cli.ts";

import { createExitSignal, staticServer } from "./shared/server.ts";

import { Chalk } from "npm:chalk@5";
const chalk = new Chalk({ level: 1 });

const app = new Application();
const router = new Router();

// // API routes
// router.get("/api/gpt", async (ctx) => {
//   const prompt = ctx.request.url.searchParams.get("prompt");
//   const shortPrompt = prompt.slice(0, 128);
//   const result = await gptPrompt(shortPrompt);
//   ctx.response.body = result;
// });

router.get("/api/gpt", async (ctx) => {
  try {
    const userQuery = ctx.request.url.searchParams.get("prompt").toLowerCase();
    let response;

    if (userQuery.includes("number")) {
      response = "571-422-8961";
    } else if (userQuery.includes("email")) {
      response = "chasecthaynes@gmail.com";
    } else if (userQuery.includes("return")) {
      response = "chasecthaynes@gmail.com";
    } else {
      // If the query doesn't match specific triggers, send it to the model
      response = await gptPrompt(userQuery);
    }

    ctx.response.body = response;
  } catch (error) {
    console.error('Error occurred:', error);
    ctx.response.status = 500;  // Set HTTP status code to 500 Internal Server Error
    ctx.response.body = "An error occurred processing your request.";
  }
});


app.use(router.routes());
app.use(router.allowedMethods());
app.use(staticServer);

console.log(chalk.green("\nListening on http://localhost:8000"));

await app.listen({ port: 8000, signal: createExitSignal() });