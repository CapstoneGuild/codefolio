import { parseCommaList } from "../../utils/format"

export const renderTechStack = (techStack) => {
    const techArray = parseCommaList(techStack)

    return (
      <div className="flex flex-wrap gap-2">
        {techArray.map((tech, index) => (
          <span key={index} className="bg-surface text-primary px-2 py-1 rounded-full text-xs font-medium">
            {tech}
          </span>
        ))}
      </div>
    )
}