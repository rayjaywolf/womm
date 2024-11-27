import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { Separator } from "@/components/ui/separator"
import Breadcrumbs from "@/components/breadcrumbs"

const links = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/journal', label: 'Journal', icon: '📔' },
  { href: '/history', label: 'History', icon: '📊' },
]

const DashboardLayout = ({ children }) => {
  return (
    <div className="h-screen w-screen relative bg-background">
      <aside className="fixed w-[240px] top-0 left-0 h-full border-r border-border bg-card/40 backdrop-blur-xl">
        <div className="flex flex-col h-full">
          <div className="h-[60px] flex items-center px-6 border-b border-border">
            <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text">WOMM</h2>
          </div>
          
          <nav className="flex-1 px-3 py-4">
            <ul className="space-y-1">
              {links.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-accent-foreground transition-colors"
                  >
                    <span className="text-lg">{link.icon}</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>

      <div className="ml-[240px] h-full">
        <header className="h-[60px] border-b border-border bg-card/40 backdrop-blur-xl sticky top-0">
          <div className="h-full w-full px-6 flex items-center justify-between">
            <Breadcrumbs />
            <UserButton />
          </div>
        </header>
        <main className="h-[calc(100vh-60px)] overflow-auto bg-background">
          {children}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
