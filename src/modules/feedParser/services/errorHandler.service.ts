export function getErrorMessage(error: Error): string {
  const message = error.message;

  if (message.includes('ENOTFOUND')) return 'Feed URL not found';
  if (message.includes('timeout')) return 'Request timed out';
  if (message.includes('Invalid XML') || message.includes('Invalid character'))
    return 'Invalid RSS format - encoding or XML structure issue';
  if (message.includes('Status code 404')) return 'RSS feed not found (404)';
  if (message.includes('Status code 403')) return 'Access denied (403)';
  if (message.includes('Status code 500')) return 'Server error (500)';

  return 'Failed to retrieve feed data';
}
