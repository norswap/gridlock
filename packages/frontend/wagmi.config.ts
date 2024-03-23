import { defineConfig } from "@wagmi/cli"
import { foundry, react } from "@wagmi/cli/plugins"

export default defineConfig({
    out: "src/generated.ts",
    plugins: [
        react(),
        foundry({
            project: "../contracts",
            include: ["GridLand721.sol/**/*.json", "GridResource1155.sol/**/*.json"],
        }),
    ],
})
