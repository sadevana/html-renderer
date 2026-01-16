const escapeMap: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
};

export function escapeHtml(str: string): string {
  return str.replace(/[&<>"']/g, char => escapeMap[char]);
}

export function renderTemplate(
  html: string,
  values: Record<string, string>
): string {
  return html.replace(/\{\{(\w+)\}\}/g, (_, key) =>
    escapeHtml(values[key] ?? '')
  );
}
