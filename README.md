### lamer

A simple wrapper for the LMStudio SDK so I can talk to a LLM running on my local machine from somewhere else.

#### Usage

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
