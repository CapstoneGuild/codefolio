import { parseCommaList } from "../../utils/format"

export const renderBadges = (list, limit = 4) => {
  const array = parseCommaList(list)
  const visible = limit ? array.slice(0, limit) : array

  return (
    <div className="flex flex-wrap gap-2">
      {visible.map((item, index) => (
        <span key={index} className="bg-surface border border-muted text-primary px-2 py-1 rounded-full text-xs font-medium">
          {item}
        </span>
      ))}
    </div>
  )
}