import React from "react"

const sections = [
  { key: "jobs", label: "Jobs Management" },
]

export function AdminSidebar({ active, setActive }: { active: string, setActive: (key: string) => void }) {
  return (
    <aside className="w-64 bg-gray-100 border-r p-6 flex flex-col gap-4">
      <h2 className="text-2xl font-bold mb-8">Admin Dashboard</h2>
      {sections.map((section) => (
        <button
          key={section.key}
          className={`text-left px-4 py-2 rounded transition font-medium ${active === section.key ? "bg-blue-600 text-white" : "hover:bg-blue-100"}`}
          onClick={() => setActive(section.key)}
        >
          {section.label}
        </button>
      ))}
    </aside>
  )
} 