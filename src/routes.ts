import { FastifyInstance } from "fastify";

import { processLLMOutput } from "./utils";

interface PredictionRequest {
  prompt: string;
  thinking?: boolean;
}

interface PredictionResponse {
  answer: string;
}

export async function routes(server: FastifyInstance) {
  server.get("/ping", async (request, reply) => {
    return "poooooong!\n";
  });

  server.post<{ Body: PredictionRequest }>("/pred", async (request, reply) => {
    try {
      const { prompt, thinking = false } = request.body;
      const model = await request.server.lmsClient.llm.get("local-model");
      const responseParams = [
        {
          role: "system",
          content:
            "Answer the following question and make sure the output is in Markdown.",
        },
        { role: "user", content: prompt },
      ];

      const { content } = await model.respond(responseParams);
      const processedContent = processLLMOutput(content, {
        includeThinking: thinking,
      });

      return reply.type("text/markdown").send(processedContent.markdown);
    } catch (error) {
      request.log.error(error);
      reply.status(500);

      return { error: "Couldn't generate prediction!" };
    }
  });
}
