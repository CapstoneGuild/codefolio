
/* Convert comma-separated string → array */
export const parseCommaList = (value) => {
    if (!value) return []
    if (Array.isArray(value)) return value

    return value.split(',').map(item => item.trim()).filter(Boolean)
}

export const formatDate = (value) => {
    const myDate = new Date(value)
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    
    return myDate.toLocaleDateString('en-US', options)
}

export const formatLink = (url) => {
    if (!url) return ""
    return url.startsWith("http://") || url.startsWith("https://")
        ? url
        : `https://${url}`
}