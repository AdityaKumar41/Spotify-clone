// Format seconds into MM:SS format
export const formatDuration = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Format milliseconds into MM:SS format
export const formatMilliseconds = (ms) => {
    if (!ms || isNaN(ms)) return '0:00';
    return formatDuration(ms / 1000);
};

// Format a date to "Month Day, Year" format
export const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

// Format number of plays/likes (e.g., 1.2K, 3.5M)
export const formatCount = (count) => {
    if (!count || isNaN(count)) return '0';
    
    if (count >= 1000000) {
        return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
        return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
};

// Convert hours and minutes to total minutes
export const hoursAndMinutesToMinutes = (hours, minutes) => {
    return (hours * 60) + minutes;
}; 