import { parseCommaList } from "../../utils/format"

export const renderBadges = (list) => {
  const array = parseCommaList(list)
  return (
    <div className="flex flex-wrap gap-2">
      {array.map((item, index) => (
        <span key={index} className="bg-surface text-primary px-2 py-1 rounded-full text-xs font-medium">
          {item}
        </span>
      ))}
    </div>
  )
}