import fastify from "fastify";
import { LMStudioClient } from "@lmstudio/sdk";
import { marked } from "marked";

import { routes } from "./routes";

declare module "fastify" {
  interface FastifyInstance {
    lmsClient: LMStudioClient;
  }
}

const PORT = Number(process.env.PORT) || 9001;
const server = fastify({ logger: true, requestTimeout: 60000 });
const signals = ["SIGTERM", "SIGINT"];

const start = async () => {
  try {
    const lmsClient = new LMStudioClient();

    console.log("Loading local model...");

    await lmsClient.llm.load("bartowski/deepseek-r1-distill-qwen-14b", {
      identifier: "local-model",
    });

    server.decorate("lmsClient", lmsClient);

    marked.setOptions({
      breaks: true,
      gfm: true,
    });

    await server.register(routes);
    await server.listen({ port: PORT });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

server.addHook("onClose", async (instance) => {
  console.log("Unloading local model...");

  await instance.lmsClient.llm.unload("local-model");
});

signals.forEach((signal) => {
  process.on(signal, async () => {
    await server.close();
  });
});

start();
