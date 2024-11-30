'use client'

import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Separator } from '@/components/ui/separator'
import { Card } from '@/components/ui/card'
import Breadcrumbs from '@/components/breadcrumbs'
import { Home, BookOpen, LineChart, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const links = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/journal', label: 'Journal', icon: BookOpen },
  { href: '/history', label: 'History', icon: LineChart },
]

const DashboardLayout = ({ children }) => {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <div className="min-h-screen w-full relative bg-gradient-to-br from-background to-secondary/5 overflow-hidden">
      <Card className="fixed w-[240px] top-4 bottom-4 left-4 rounded-xl border-none shadow-sm bg-card/80 backdrop-blur-xl">
        <div className="flex flex-col h-full">
          <div className="h-[60px] flex items-center justify-center px-6">
            <h2 className="text-2xl font-bold tracking-tight text-black">
              WOMM
            </h2>
          </div>

          <Separator className="mb-2" />

          <nav className="flex-1 px-3 py-4">
            <ul className="space-y-1">
              {links.map((link) => {
                const isActive = pathname.startsWith(link.href)
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`flex items-center gap-3 px-4 py-3 text-sm rounded-lg transition-colors ${isActive
                        ? 'bg-primary/10 text-primary'
                        : 'hover:bg-primary/10 hover:text-primary'
                        }`}
                    >
                      <link.icon className="w-4 h-4" />
                      {link.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </Card>

      <div className="ml-[280px] pt-4 pr-4 min-h-screen pb-4">
        <Card className="h-[60px] border-none shadow-sm bg-card/80 backdrop-blur-xl">
          <div className="h-full w-full px-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 mr-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => router.back()}
                  className="bg-background/60 hover:bg-background/80 border-border/40"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => router.forward()}
                  className="bg-background/60 hover:bg-background/80 border-border/40"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <Breadcrumbs />
            </div>
            <UserButton />
          </div>
        </Card>
        <main className="mt-4">{children}</main>
      </div>
    </div>
  )
}

export default DashboardLayout
