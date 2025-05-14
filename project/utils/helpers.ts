/**
 * Decode HTML entities in a string
 * @param html String with HTML entities
 * @returns Decoded string
 */
export function decodeHtml(html: string): string {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}

/**
 * Format a date string to a readable format
 * @param dateString ISO date string
 * @returns Formatted date string
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  
  // For invalid dates, return a placeholder
  if (isNaN(date.getTime())) {
    return 'Unknown date';
  }
  
  // Format: "May 15, 2023"
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}