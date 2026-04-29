import LeftSidebar from "../components/layout/LeftSidebar"
import useAuthSession from "../hooks/useAuthSession"

const BodyLayout = ({ element }) => {
  const { user } = useAuthSession()

  return (
    <div className="flex flex-col gap-4 min-h-full items-stretch lg:flex-row">
      {/* Left Sidebar */}
      <aside className="hidden lg:block lg:w-56 shrink-0">
        <LeftSidebar />
      </aside>

      {/* Main */}
      <main className="w-full flex-1 min-w-0 min-h-full">
        {element}
      </main>
    </div>
  )
}

export default BodyLayout
