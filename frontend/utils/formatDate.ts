export function formatDate(dateString: string): string {
    const date = new Date(dateString);

    // Format the date into a readable format
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: '2-digit', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);

    return formattedDate;
}