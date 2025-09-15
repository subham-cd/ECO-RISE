import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { PageType } from '../App';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
}

function Layout({ children, currentPage, onPageChange }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Navbar />
      <div className="flex">
        <Sidebar currentPage={currentPage} onPageChange={onPageChange} />
        <main className="flex-1 p-6 ml-64 mt-16">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Layout;