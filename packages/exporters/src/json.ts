import type { CallData } from "@lf/types";

export function toJSON(data: CallData): string {
  return JSON.stringify(data, null, 2);
}
