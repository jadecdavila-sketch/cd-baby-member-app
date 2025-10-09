'use client';

import {
  ReleaseContext,
  ReleaseStepStatus,
} from '@/app/_providers/ReleaseProvider';
import { Button } from '@/components/button';
import { ReleaseNav } from '@/components/release-sidebar/release-nav';
import { cn } from '@/shared/utils';
import { AlertCircle, CheckCircle, Circle, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useContext } from 'react';

function ReleaseStatusIcon({ status }: { status: ReleaseStepStatus }) {
  function Svg() {
    switch (status) {
      case ReleaseStepStatus.Complete:
        return (
          <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-400" />
        );
      case ReleaseStepStatus.Incomplete:
        return <Circle className="h-4 w-4 text-gray-500 dark:text-gray-400" />;
      case ReleaseStepStatus.ActionRequired:
        return (
          <AlertCircle className="h-4 w-4 text-amber-500 dark:text-amber-400" />
        );
      default:
        return null;
    }
  }
  return (
    <span className="ml-auto">
      <Svg />
    </span>
  );
}

function ReleaseMobileSidebarTrigger() {
  const { isSidebarOpen, setIsSidebarOpen, releaseNavItemStatuses } =
    useContext(ReleaseContext);
  return (
    <div className="bg-background sticky top-[calc(4rem+1px)] z-10 -mx-6 mb-6 border-b px-2 md:hidden">
      <Button
        variant="ghost"
        size="icon"
        className="w-full max-w-48 justify-start p-2"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <div className="flex w-full items-center justify-between">
          <Menu className="h-5 w-5" />
          {releaseNavItemStatuses.map((item) => (
            <ReleaseStatusIcon key={item.id} status={item.status} />
          ))}
          <span className="sr-only">Toggle Release Menu</span>
        </div>
      </Button>
    </div>
  );
}

function ReleaseSidebar({ releaseID }: { releaseID: string }) {
  const { isSidebarOpen, setIsSidebarOpen } = useContext(ReleaseContext);
  return (
    <>
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div
          className="bg-background/80 fixed inset-0 z-40 backdrop-blur-sm md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar for mobile (off-canvas) */}
      <div
        className={cn(
          'bg-background fixed inset-y-0 left-0 z-50 w-64 transform border-r transition-transform duration-200 ease-in-out md:hidden',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
          <Link
            className="font-semibold"
            href={`/release-dashboard/${releaseID}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            Release {releaseID}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        </div>

        <div className="flex h-[calc(100vh-4rem)] flex-col justify-between">
          <ReleaseNav releaseID={releaseID} />
        </div>
      </div>

      {/* Sidebar for desktop (always visible and fixed) */}
      <div className="bg-background fixed top-[calc(4rem+1px)] bottom-0 left-0 z-40 hidden w-64 overflow-y-auto border-r md:block">
        <div className="flex h-full flex-col justify-between pt-4">
          <div>
            <Link
              className="text-semibold hover:bg-muted flex items-center px-3 py-2 pl-6 text-sm font-semibold transition-colors"
              href={`/release-dashboard/${releaseID}`}
            >
              Release {releaseID}
            </Link>
            <ReleaseNav releaseID={releaseID} />
          </div>
        </div>
      </div>
    </>
  );
}

export { ReleaseSidebar, ReleaseMobileSidebarTrigger, ReleaseStatusIcon };
