/**
 * Get items + count together
 */
export const getStatusData = (list = []) => {
  return {
    items: list,
    count: list.length
  }
}