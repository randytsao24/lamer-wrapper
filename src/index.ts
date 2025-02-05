import fastify from "fastify";
import { LMStudioClient } from "@lmstudio/sdk";

import { routes } from "./routes";

declare module "fastify" {
  interface FastifyInstance {
    lmsClient: LMStudioClient;
  }
}

const PORT = Number(process.env.PORT) || 9001;
const server = fastify({ logger: true });

const start = async () => {
  try {
    const lmsClient = new LMStudioClient();

    // TODO: Remove hardcoded model
    if (!lmsClient.llm.get("local-model")) {
      await lmsClient.llm.load("bartowski/deepseek-r1-distill-qwen-14b", {
        identifier: "local-model",
      });
    }

    server.decorate("lmsClient", lmsClient);

    await server.register(routes);
    await server.listen({ port: PORT });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
