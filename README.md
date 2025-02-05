## lamer

---

A simple wrapper for the [LMStudio SDK](https://github.com/lmstudio-ai/lmstudio.js), so I can talk to an LLM running on my local machine from somewhere else. Kinda lame, right?

### Usage

Lamer is an API running on Node and built with Fastify, and currently is stuck talking to LLMs running with [LM Studio](https://lmstudio.ai/). Make sure that the LM Studio server is running and listening on port `1234` before you spin up Lamer.

#### Request

POST `/pred`

```json
{
  "prompt": "What is the meaning of life?"
}
```

#### Response

```json
{
  "answer": "42"
}
```
