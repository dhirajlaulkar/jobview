import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Code, 
  Palette, 
  TrendingUp, 
  Headphones, 
  Megaphone, 
  FolderKanban, 
  PenTool, 
  Server 
} from "lucide-react"

const categories = [
  {
    name: "Programming/Development",
    href: "/jobs/live?category=programming-development",
    icon: Code,
  },
  {
    name: "Design",
    href: "/jobs/live?category=design",
    icon: Palette,
  },
  {
    name: "Sales",
    href: "/jobs/live?category=sales",
    icon: TrendingUp,
  },
  {
    name: "Customer Support",
    href: "/jobs/live?category=customer-support",
    icon: Headphones,
  },
  {
    name: "Marketing",
    href: "/jobs/live?category=marketing",
    icon: Megaphone,
  },
  {
    name: "Project Management",
    href: "/jobs/live?category=project-management",
    icon: FolderKanban,
  },
  {
    name: "Copywriting",
    href: "/jobs/live?category=copywriting",
    icon: PenTool,
  },
  {
    name: "Technology & IT",
    href: "/jobs/live?category=technology-it",
    icon: Server,
  },
]

export function PopularCategories() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Job Categories</h2>
          <p className="text-lg text-gray-600">Explore opportunities in your field</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const IconComponent = category.icon
            return (
              <Link key={category.name} href={category.href}>
                <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group hover:-translate-y-1">
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                        <IconComponent className="h-8 w-8 text-blue-600" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
