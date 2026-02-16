'use client'

import { ReactNode } from 'react'
import AdminProtection from './AdminProtection'
import AdminHeader from './AdminHeader'
import AdminSidebar from './AdminSidebar'

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AdminProtection>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <div className="fixed inset-y-0 left-0 z-50">
          <AdminSidebar />
        </div>

        {/* Main content area */}
        <div className="flex-1 ml-64">
          {/* Header */}
          <AdminHeader />
          
          {/* Page content */}
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </AdminProtection>
  )
}
