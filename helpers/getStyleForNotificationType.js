export const getStyleForNotificationType = (type) => {
    const baseClass = 'fw-bold';

    switch (type) {
        case 'Reminder':
            return `${baseClass} text-success`;
        case 'Warning':
            return `${baseClass} text-warning`;
        case 'Info':
            return `${baseClass} text-info`;
        case 'Feedback':
            return `${baseClass} text-success`;
        case 'Task Assignment':
            return `${baseClass} text-success`;
        case 'Critical':
            return `${baseClass} text-danger`;
        default:
            return baseClass;
    }
};