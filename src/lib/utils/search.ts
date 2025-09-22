export type SearchOptions = {
  caseSensitive?: boolean;
  useRegex?: boolean;
};

export function buildSearchRegex(query: string, opts: SearchOptions) {
  const { caseSensitive = false, useRegex = false } = opts || {};
  const trimmed = (query ?? '').trim();
  if (!trimmed) {
    return {
      regex: null as RegExp | null,
      pattern: '',
      error: null as string | null,
    };
  }

  const pattern = useRegex
    ? trimmed
    : trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  try {
    const regex = new RegExp(pattern, `g${caseSensitive ? '' : 'i'}`);
    return { regex, pattern, error: null as string | null };
  } catch (e) {
    return {
      regex: null as RegExp | null,
      pattern,
      error: (e as Error).message,
    };
  }
}

export function countMatches(text: string, regex: RegExp | null): number {
  if (!text || !regex) return 0;
  let count = 0;
  regex.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    const start = match.index;
    const end = start + match[0].length;
    if (end === start && regex.lastIndex === match.index) {
      regex.lastIndex++;
      continue;
    }
    count += 1;
  }
  return count;
}
