'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const navItems = [
  { href: '/', icon: '1-home.svg', label: 'Home' },
  { href: '/releases', icon: '2-releases.svg', label: 'Releases' },
  { href: '/analytics', icon: '3-analytics.svg', label: 'Analytics' },
  { href: '/earnings', icon: '4-earnings.svg', label: 'Earnings' },
];

export function SidebarNav() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <aside
      className="fixed left-0 top-0 z-40 flex h-screen flex-col transition-all duration-300"
      style={{
        backgroundColor: '#3A3A3A',
        width: isCollapsed ? '56px' : '70px',
      }}
    >
      {/* Navigation items */}
      <nav className="flex flex-1 flex-col items-center gap-1 pt-20">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group relative flex h-14 w-14 items-center justify-center rounded-[3px] transition-colors"
              style={{
                backgroundColor: active ? 'rgba(82, 188, 214, 0.15)' : 'transparent',
              }}
              title={item.label}
            >
              <div className="relative h-7 w-7">
                <Image
                  src={`/assets/main-nav-icons/${item.icon}`}
                  alt={item.label}
                  width={28}
                  height={28}
                  className="object-contain"
                  style={{
                    filter: active
                      ? 'brightness(0) saturate(100%) invert(63%) sepia(47%) saturate(567%) hue-rotate(145deg) brightness(92%) contrast(87%)'
                      : 'brightness(0) saturate(100%) invert(42%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(88%)',
                  }}
                />
              </div>

              {/* Hover tooltip */}
              {!isCollapsed && (
                <div
                  className="pointer-events-none absolute left-full ml-2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
                  style={{ zIndex: 50 }}
                >
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="mb-4 flex h-10 w-10 items-center justify-center self-center rounded-[3px] transition-colors hover:bg-white/10"
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? (
          <ChevronRight className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronLeft className="h-5 w-5 text-gray-400" />
        )}
      </button>
    </aside>
  );
}
