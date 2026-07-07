import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

type MutableEnv = Record<string, string | undefined>;

export type LoadLocalEnvResult = {
  readonly loaded: boolean;
  readonly envPath: string;
  readonly appliedKeys: readonly string[];
};

export function loadLocalEnv(input: {
  readonly envPath?: string;
  readonly targetEnv?: MutableEnv;
} = {}): LoadLocalEnvResult {
  const envPath = input.envPath ?? join(process.cwd(), ".env.local");
  const targetEnv = input.targetEnv ?? process.env;

  if (!existsSync(envPath)) {
    return {
      loaded: false,
      envPath,
      appliedKeys: [],
    };
  }

  const appliedKeys: string[] = [];
  const lines = readFileSync(envPath, "utf8").split(/\r?\n/);

  for (const line of lines) {
    const parsed = parseLocalEnvLine(line);
    if (parsed === undefined || targetEnv[parsed.key] !== undefined) {
      continue;
    }

    targetEnv[parsed.key] = parsed.value;
    appliedKeys.push(parsed.key);
  }

  return {
    loaded: true,
    envPath,
    appliedKeys,
  };
}

function parseLocalEnvLine(
  line: string,
): { readonly key: string; readonly value: string } | undefined {
  const trimmed = line.trim();
  if (trimmed.length === 0 || trimmed.startsWith("#")) {
    return undefined;
  }

  const separatorIndex = trimmed.indexOf("=");
  if (separatorIndex <= 0) {
    return undefined;
  }

  const key = trimmed.slice(0, separatorIndex).trim();
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) {
    return undefined;
  }

  return {
    key,
    value: unquoteLocalEnvValue(trimmed.slice(separatorIndex + 1).trim()),
  };
}

function unquoteLocalEnvValue(value: string): string {
  if (value.length < 2) {
    return value;
  }

  const quote = value[0];
  if ((quote !== '"' && quote !== "'") || value[value.length - 1] !== quote) {
    return value;
  }

  return value.slice(1, -1);
}
