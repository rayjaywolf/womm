'use client'

import * as React from "react"
import { Home } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const Breadcrumbs = () => {
  const pathname = usePathname()
  const paths = pathname.split('/').filter(Boolean)

  const formatPath = (path: string, index: number) => {
    if (paths[index - 1] === 'journal' && path.length === 24) {
      return 'Entry'
    }
    return path
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/" className="flex items-center">
              <Home className="h-4 w-4" />
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {paths.map((path, index) => (
          <React.Fragment key={path}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link 
                  href={`/${paths.slice(0, index + 1).join('/')}`}
                  className="capitalize"
                >
                  {formatPath(path, index)}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export default Breadcrumbs 