interface ProcessOptions {
  includeThinking?: boolean;
}

// Type for the LLM response
interface LLMResponse {
  raw: string;
  markdown: string;
  thinking?: string;
}

export const processLLMOutput = (
  rawOutput: string,
  options: ProcessOptions = {}
): LLMResponse => {
  const { includeThinking = false } = options;

  const thinkPattern = /<think>\s*([\s\S]*?)\s*<\/think>/;
  const thinkMatch = rawOutput.match(thinkPattern);

  let thinkingContent = "";
  let mainContent = rawOutput;

  if (thinkMatch) {
    thinkingContent = thinkMatch[1].trim();
    mainContent = rawOutput.replace(thinkMatch[0], "").trim();
  }

  let markdownOutput = "";

  if (includeThinking && thinkingContent) {
    markdownOutput = `# LLM Response
  
  <details>
  <summary>Thinking Process</summary>
  
  \`\`\`
  ${thinkingContent}
  \`\`\`
  
  </details>
  
  ${mainContent}`;
  } else {
    markdownOutput = mainContent;
  }

  return {
    raw: rawOutput,
    markdown: markdownOutput,
    ...(thinkingContent && { thinking: thinkingContent }),
  };
};
