
// Helper function to format the current date
export const getCurrentDateFormatted = () => {
    let currentDate = new Date(Date.now());
    let year = currentDate.getFullYear();
    let month = String(currentDate.getMonth() + 1).padStart(2, '0');
    let day = String(currentDate.getDate()).padStart(2, '0');
    let hours = String(currentDate.getHours()).padStart(2, '0');
    let seconds = String(currentDate.getSeconds()).padStart(2, '0');

    let ginFormat = `${year}${month}${day}${hours}${seconds}`;

    return ginFormat;
}

