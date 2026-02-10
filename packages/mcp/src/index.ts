import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerCategoryTools } from "./tools/category.js";
import { registerPostTools } from "./tools/post.js";

const server = new McpServer({
  name: "headless-cms",
  version: "1.0.0",
});

registerCategoryTools(server);
registerPostTools(server);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Headless CMS MCP server started");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
