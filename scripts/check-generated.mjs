import { execFileSync } from "node:child_process";

const forbiddenRoots = ["node_modules/", "dist/"];
const tracked = execFileSync("git", ["ls-files", "--", "node_modules", "dist"], {
  encoding: "utf8",
})
  .split(/\r?\n/)
  .filter(Boolean);

if (tracked.length > 0) {
  const unexpected = tracked.filter((file) =>
    forbiddenRoots.some((root) => file.startsWith(root)),
  );
  console.error("Generated files must not be tracked:\n" + unexpected.join("\n"));
  process.exit(1);
}

console.log("Generated directories are not tracked.");
