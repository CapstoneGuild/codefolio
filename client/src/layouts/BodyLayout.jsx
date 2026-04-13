import LeftSidebar from "../components/layout/LeftSidebar"
import RightSidebar from "../components/layout/RightSidebar"

const BodyLayout = ({ element }) => {
  return (
    <div className="flex">
      {/* Left Sidebar */}
      <div className="w-60">
        <LeftSidebar />
      </div>
      {/* Main */}
      <div className="flex-1">
        {element}
      </div>

      {/* Right Sidebar */}
      <div className="w-60">
        <RightSidebar />
      </div>
    </div>
  )
}

export default BodyLayout