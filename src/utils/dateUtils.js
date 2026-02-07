export const getCompetitionStatus = (deadlineStr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const deadline = new Date(deadlineStr);
    deadline.setHours(0, 0, 0, 0);

    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Admin relative status
    if (diffDays < -2) {
        return { label: 'Berakhir', color: 'text-red-500', bg: 'bg-red-500/10', code: 'EXPIRED' };
    } else if (diffDays < 0) {
        return { label: 'Masa Tenggang', color: 'text-orange-500', bg: 'bg-orange-500/10', code: 'GRACE_PERIOD' };
    } else if (diffDays <= 3) {
        return { label: 'Segera Berakhir', color: 'text-amber-500', bg: 'bg-amber-500/10', code: 'CLOSING_SOON' };
    } else {
        return { label: 'Aktif', color: 'text-green-500', bg: 'bg-green-500/10', code: 'ACTIVE' };
    }
};

export const isCompetitionVisible = (deadlineStr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const deadline = new Date(deadlineStr);
    deadline.setHours(0, 0, 0, 0);

    // Grace period check: deadline + 2 days
    const graceDeadline = new Date(deadline);
    graceDeadline.setDate(deadline.getDate() + 2);

    // Visible if today is before or on grace deadline
    return today <= graceDeadline;
};
