import { FastifyInstance } from "fastify";

interface PredictionRequest {
  prompt: string;
}

export async function routes(server: FastifyInstance) {
  server.get("/ping", async (request, reply) => {
    return "poooooong!\n";
  });

  server.post<{ Body: PredictionRequest }>("/pred", async (request, reply) => {
    try {
      const { prompt } = request.body;
      const model = await request.server.lmsClient.llm.get("local-model");
      const responseParams = [
        { role: "system", content: "Answer the following question." },
        { role: "user", content: prompt },
      ];

      const { content } = await model.respond(responseParams);
      console.log({ content });
      return { answer: content };
    } catch (error) {
      request.log.error(error);
      reply.status(500).send({ error: "Couldn't generate prediction!" });
    }
  });
}
