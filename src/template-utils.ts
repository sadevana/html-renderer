export function extractVariablesInOrder(html: string): string[] {
  const variables: string[] = [];
  const seen = new Set<string>();
  const regex = /\{\{(\w+)\}\}/g;

  let match;
  while ((match = regex.exec(html)) !== null) {
    const varName = match[1];
    if (!seen.has(varName)) {
      seen.add(varName);
      variables.push(varName);
    }
  }

  return variables;
}

export function humanizeLabel(varName: string): string {
  return varName.replace(/_/g, ' ');
}
