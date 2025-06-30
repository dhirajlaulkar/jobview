import Link from "next/link"
import { Briefcase, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                <Briefcase className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">JobView</span>
            </div>
            <p className="text-gray-400 text-sm">
              Find your dream job with India's leading job portal. Connect with top companies and build your career.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-white">For Job Seekers</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="https://takeuforward.org/" className="hover:text-white transition-colors">
                 Preparation for Interview
                </Link>
              </li>
              <li>
                <Link href="https://wiki.developersindia.in/" className="hover:text-white transition-colors">
                  Career Advice
                </Link>
              </li>
              <li>
                <Link href="https://resumeworded.com/" className="hover:text-white transition-colors">
                  Resume Builder
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-white">For Employers</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="mailto:dhirajlaulkar11@gmail.com" className="hover:text-white transition-colors">
                  Post a Job
                </Link>
              </li>
             
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-white">Contact Info</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>support@jobview.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p> {new Date().getFullYear()} JobView. All rights reserved.</p>
          <p>Developed with ❤️ by <Link href="https://www.github.com/dhirajlaulkar" className="text-blue-500 hover:text-blue-600"> Dhiraj </Link></p>
        </div>
      </div>
    </footer>
  )
}
