import { useState } from "react"

const ZoomImage = ({ alt, src }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Small Image */}
      <img
        src={src}
        alt={alt}
        onClick={() => setIsOpen(true)}
        className="w-full object-cover max-h-60 rounded-xl cursor-pointer hover:opacity-80 transition"
      />

      {/* Fullscreen Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setIsOpen(false)}
        >
          <img
            src={src}
            alt={alt}
            className="max-w-[90%] max-h-[90%] rounded-xl scale-100 animate-[zoomIn_0.2s_ease]"
          />
        </div>
      )}
    </>
  )
}

export default ZoomImage