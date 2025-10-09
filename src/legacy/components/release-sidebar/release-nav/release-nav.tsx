'use client';

import { useContext, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronRight, Eye } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  ReleaseContext,
  ReleaseStepStatus,
} from '@/app/_providers/ReleaseProvider';
import { ReleaseStatusIcon } from '@/components/release-sidebar';

export interface ReleaseNavItem {
  id: string;
  name: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  isDropdown?: boolean;
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
  subItems?: ReleaseNavItem[];
  status: ReleaseStepStatus;
}

function ReleaseNav({ releaseID }: { releaseID: string }) {
  const { setIsSidebarOpen, releaseNavItemStatuses } =
    useContext(ReleaseContext);
  const pathname = usePathname();

  // default dropdown to open if the current page is a subpage of the dropdown
  // e.g. /release-dashboard/1234/release-info/genre-sub-genre
  // would open the release-info dropdown
  const currentPageId = pathname.split('/').pop() || '';
  const currentPageParent = releaseNavItemStatuses.find((item) =>
    item.subItems?.some((subItem) => subItem.id === currentPageId)
  );

  const [isReleaseInfoOpen, setIsReleaseInfoOpen] = useState(
    currentPageParent && currentPageParent.id === 'release-info'
  );
  const [isTracksOpen, setIsTracksOpen] = useState(
    currentPageParent && currentPageParent.id === 'tracks'
  );
  const [isDistributionOpen, setIsDistributionOpen] = useState(
    currentPageParent && currentPageParent.id === 'distribution'
  );

  // Helper map for nav item names
  // These ids match the folder names in the release-dashboard
  // and the ids in the releaseNavItemStatuses array.

  // TODO: should these ids be in an enum?
  const navItemNames: Record<string, string> = {
    'art-upload': 'Art Upload',
    'dd-partners': 'DD Partners',

    'release-info': 'Release Info',
    'genre-sub-genre': 'Genre/Sub-genre',
    'record-label-and-copyright-owner': 'Record Label & Copyright Owner',
    'release-date': 'Release Date',
    'release-language': 'Release Language',
    'release-name': 'Release Name',
    'select-release-artists': 'Select Release Artists',
    'territory-restrictions': 'Territory Restrictions',
    upc: 'UPC',
    'version-info': 'Version Info',

    distribution: 'Distribution',
    'review-and-submit': 'Review & Submit',
    'social-partners': 'Social Partners',

    tracks: 'Tracks',
    'select-tracks': 'Select Tracks',
    'track-data': 'Track Data',
  };

  const releaseFolder = '/release-dashboard/';
  const releaseNavItems: ReleaseNavItem[] = releaseNavItemStatuses.map(
    (item) => {
      const isDropdown = !!item.subItems;
      let subItems;
      if (item.subItems) {
        subItems = item.subItems.map(
          (sub: { id: string; status: ReleaseStepStatus }) => {
            let href = '';
            if (item.id === 'tracks') {
              href = `${releaseFolder}${releaseID}/tracks/${sub.id}`;
            } else if (item.id === 'release-info') {
              href = `${releaseFolder}${releaseID}/release-info/${sub.id}`;
            } else if (item.id === 'distribution') {
              href = `${releaseFolder}${releaseID}/distribution/${sub.id}`;
            }
            return {
              id: sub.id,
              name: navItemNames[sub.id],
              href,
              status: sub.status,
            };
          }
        );
      }
      let isOpen, setIsOpen, icon;
      if (item.id === 'tracks') {
        isOpen = isTracksOpen;
        setIsOpen = setIsTracksOpen;
        icon = ChevronRight;
      }
      if (item.id === 'release-info') {
        isOpen = isReleaseInfoOpen;
        setIsOpen = setIsReleaseInfoOpen;
        icon = ChevronRight;
      }
      if (item.id === 'distribution') {
        isOpen = isDistributionOpen;
        setIsOpen = setIsDistributionOpen;
        icon = ChevronRight;
      }
      if (item.id === 'review-and-submit') {
        icon = Eye;
      }

      return {
        id: item.id,
        name: navItemNames[item.id],
        href: (() => {
          if (
            item.id === 'tracks' ||
            item.id === 'release-info' ||
            item.id === 'distribution'
          )
            return '#';
          return `${releaseFolder}${releaseID}/${item.id}`;
        })(),
        isOpen,
        setIsOpen,
        icon,
        isDropdown,
        subItems,
        status: item.status,
      };
    }
  );

  return (
    <nav className="flex w-full flex-col space-y-1">
      {releaseNavItems.map((item) => {
        return (
          <div key={item.id} className="flex flex-col">
            <Link
              href={item.href}
              //TODO: some sort of loading state while the page is loading
              onClick={(e) => {
                if (item.isDropdown) {
                  e.preventDefault();
                  item.setIsOpen && item.setIsOpen(!item.isOpen);
                } else {
                  setIsSidebarOpen(false);
                }
              }}
              className={cn(
                'hover:bg-muted flex items-center px-5 py-2 text-sm font-medium transition-colors',
                pathname === item.href
                  ? 'bg-muted text-primary'
                  : 'text-muted-foreground'
              )}
            >
              {item.icon && (
                <item.icon
                  className={cn(
                    'mr-2 h-4 w-4',
                    item.isDropdown && 'transition-transform duration-200',
                    item.isDropdown && item.isOpen && 'rotate-90 transform'
                  )}
                />
              )}
              <span>{item.name}</span>
              {item.status && <ReleaseStatusIcon status={item.status} />}
            </Link>
            {item.isDropdown && item.subItems && (
              <div className={`${!item.isOpen && 'hidden'}`}>
                {item.subItems.map((subItem) => {
                  return (
                    <Link
                      key={subItem.id}
                      href={subItem.href}
                      //TODO: some sort of loading state while the page is loading
                      onClick={() => {
                        setIsSidebarOpen(false);
                      }}
                      className={cn(
                        'hover:bg-muted flex items-center py-2 pr-5 pl-11 text-sm font-medium transition-colors',
                        pathname === subItem.href
                          ? 'bg-muted text-primary'
                          : 'text-muted-foreground'
                      )}
                    >
                      <span className="pr-8">{subItem.name}</span>
                      {subItem.status && (
                        <ReleaseStatusIcon status={subItem.status} />
                      )}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

export { ReleaseNav };
