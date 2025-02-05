import fastify from "fastify";

const server = fastify();

server.get("/ping", async (request, reply) => {
  return "poooooong!\n";
});

server.listen({ port: 9001 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Lamer is listening at ${address}`);
});
