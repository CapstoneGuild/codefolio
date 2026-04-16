
/* Convert comma-separated string → array */
export const parseCommaList = (value) => {
    if (!value) return []
    if (Array.isArray(value)) return value

    return value.split(',').map(item => item.trim()).filter(Boolean)
}