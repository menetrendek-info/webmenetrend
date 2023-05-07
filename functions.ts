export const getDayName = (d: Date | string | undefined | null) => {
    if (typeof d === 'string') {
        d = new Date(d)
    }
    switch ((d ? d : new Date()).getDay()) {
        case 0:
            return 'sunday'
        case 1:
            return 'monday'
        case 2:
            return 'tuesday'
        case 3:
            return 'wednesday'
        case 4:
            return 'thursday'
        case 5:
            return 'friday'
        case 6:
            return 'saturday'
        default:
            return (d ? d : new Date()).getDay()
    }
}

export const getDateString = (d: Date | string | undefined | null) => {
    if (typeof d === 'string') {
        d = new Date(d)
    }
    d = d ? d : new Date()
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}