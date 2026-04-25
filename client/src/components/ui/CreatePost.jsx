import { useState, useRef, useEffect } from "react"
import postService from "../../services/postService"
import { notifyError } from "../../utils/notifications"

const FIELDS = [
    { name: "title", label: "Title", placeholder: "What did you build?" },
    { name: "link", label: "Link", placeholder: "https://github.com/..." },
    { name: "media_url", label: "Image URL", placeholder: "https://..." },
]

const CreatePost = ({ onPostCreated }) => {
    const [form, setForm] = useState({ title: "", description: "", media_url: "", link: "" })
    const [selectedTags, setSelectedTags] = useState([])
    const [tagInput, setTagInput] = useState("")
    const [suggestions, setSuggestions] = useState([])
    const [loading, setLoading] = useState(false)
    const debounceRef = useRef(null)

    useEffect(() => {
        if (!tagInput.trim()) { setSuggestions([]); return }
        clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(async () => {
            try {
                const results = await postService.searchHashtags(tagInput.trim())
                setSuggestions(results.filter((r) => !selectedTags.includes(r.tag_text)))
            } catch {
                setSuggestions([])
            }
        }, 250)
    }, [tagInput, selectedTags])

    const addTag = (tag_text) => {
        setSelectedTags((prev) => [...prev, tag_text])
        setTagInput("")
        setSuggestions([])
    }

    const removeTag = (tag_text) => setSelectedTags((prev) => prev.filter((t) => t !== tag_text))

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const post = await postService.createPost({ ...form, hashtags: selectedTags })
            setForm({ title: "", description: "", media_url: "", link: "" })
            setSelectedTags([])
            onPostCreated?.(post)
        } catch (err) {
            notifyError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full rounded-tr-4xl rounded-bl-4xl border border-muted bg-app-bg text-app shadow-sm transition duration-300 hover:shadow-md">
            <div className="p-6">
                <h2 className="heading-sm mb-5 text-center">Create a Post</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {FIELDS.map(({ name, label, placeholder }) => (
                        <div key={name} className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-app">{label}</label>
                            <input
                                name={name}
                                type="text"
                                placeholder={placeholder}
                                value={form[name]}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-muted bg-app-bg px-3 py-2 text-sm text-app placeholder:text-app-muted focus:outline-none focus:ring-2 focus:ring-primary transition"
                            />
                        </div>
                    ))}

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-app">Description</label>
                        <textarea
                            name="description"
                            placeholder="Share what you learned or built..."
                            value={form.description}
                            onChange={handleChange}
                            rows={3}
                            className="w-full rounded-lg border border-muted bg-app-bg px-3 py-2 text-sm text-app placeholder:text-app-muted focus:outline-none focus:ring-2 focus:ring-primary transition resize-none"
                        />
                    </div>

                    <div className="flex flex-col gap-1 relative">
                        <label className="text-sm font-medium text-app">Hashtags</label>

                        {selectedTags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-1">
                                {selectedTags.map((tag) => (
                                    <span key={tag} className="flex items-center gap-1 rounded-full bg-surface border border-muted px-2.5 py-0.5 text-xs text-primary">
                                        #{tag}
                                        <span onClick={() => removeTag(tag)} className="text-lg font-bold hover:text-red-700 cursor-pointer">&times;</span>
                                    </span>
                                ))}
                            </div>
                        )}

                        <input
                            type="text"
                            placeholder="Search tags..."
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            className="w-full rounded-lg border border-muted bg-app-bg px-3 py-2 text-sm text-app placeholder:text-app-muted focus:outline-none focus:ring-2 focus:ring-primary transition"
                        />

                        {suggestions.length > 0 && (
                            <ul className="absolute top-full left-0 right-0 z-10 mt-1 rounded-lg border border-muted bg-app-bg shadow-md overflow-y-auto max-h-40">
                                {suggestions.map((s) => (
                                    <li
                                        key={s.id}
                                        onMouseDown={() => addTag(s.tag_text)}
                                        className="flex items-center justify-between px-3 py-2 text-sm cursor-pointer hover:bg-surface"
                                    >
                                        <span className="text-primary">#{s.tag_text}</span>
                                        {s.category && <span className="text-xs text-app-muted">{s.category}</span>}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !form.title.trim()}
                        className="mt-1 self-end rounded-full border border-muted bg-primary px-5 py-1.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Posting..." : "Post"}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default CreatePost
