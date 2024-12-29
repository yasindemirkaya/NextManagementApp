export const getStyleForNotificationType = (type) => {
    const baseClass = 'fw-bold';

    switch (type) {
        case 'Reminder':
            return `${baseClass} text-success`;
        case 'Warning':
            return `${baseClass} text-warning`;
        case 'Info':
            return `${baseClass} text-info`;
        case 'Task Assignment':
            return `${baseClass} text-success`;
        case 'Meeting':
            return `${baseClass} text-danger`;
        case 'Critical':
            return `${baseClass} text-danger`;
        case 'Deadline':
            return `${baseClass} text-danger`;
        case 'Feedback':
            return `${baseClass} text-success`;
        default:
            return baseClass;
    }
};