'use client';

import { createContext, ReactNode, useState } from 'react';

export enum ReleaseStepStatus {
  Complete = 'complete',
  Incomplete = 'incomplete',
  ActionRequired = 'action-required',
}

export type ReleaseNavItemStatus = {
  id: string;
  status: ReleaseStepStatus;
  subItems?: {
    id: string;
    status: ReleaseStepStatus;
  }[];
};

// these statuses would come from the database eventually
// the order of the items in this array is important, as it determines the order of the items in the sidebar
const initialReleaseNavItemStatuses: ReleaseNavItemStatus[] = [
  {
    id: 'tracks',
    status: ReleaseStepStatus.Incomplete,
    subItems: [
      { id: 'select-tracks', status: ReleaseStepStatus.Incomplete },
      { id: 'track-data', status: ReleaseStepStatus.Incomplete },
    ],
  },
  {
    id: 'release-info',
    status: ReleaseStepStatus.Incomplete,
    subItems: [
      { id: 'art-upload', status: ReleaseStepStatus.Incomplete },
      { id: 'release-name', status: ReleaseStepStatus.Incomplete },
      { id: 'select-release-artists', status: ReleaseStepStatus.Incomplete },
      { id: 'release-language', status: ReleaseStepStatus.Incomplete },
      { id: 'version-info', status: ReleaseStepStatus.Incomplete },
      {
        id: 'record-label-and-copyright-owner',
        status: ReleaseStepStatus.Incomplete,
      },
      { id: 'genre-sub-genre', status: ReleaseStepStatus.Incomplete },
      { id: 'upc', status: ReleaseStepStatus.Incomplete },
      { id: 'release-date', status: ReleaseStepStatus.Incomplete },
      { id: 'territory-restrictions', status: ReleaseStepStatus.Incomplete },
    ],
  },
  {
    id: 'distribution',
    status: ReleaseStepStatus.Incomplete,
    subItems: [
      { id: 'dd-partners', status: ReleaseStepStatus.Incomplete },
      { id: 'social-partners', status: ReleaseStepStatus.Incomplete },
    ],
  },
  { id: 'review-and-submit', status: ReleaseStepStatus.Incomplete },
];

export const ReleaseContext = createContext<{
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  releaseNavItemStatuses: ReleaseNavItemStatus[];
  setReleaseNavItemStatuses: React.Dispatch<
    React.SetStateAction<ReleaseNavItemStatus[]>
  >;
}>({
  isSidebarOpen: false,
  setIsSidebarOpen: () => {},
  releaseNavItemStatuses: [],
  setReleaseNavItemStatuses: () => {},
});

export default function ReleaseProvider({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [releaseNavItemStatuses, setReleaseNavItemStatuses] = useState<
    ReleaseNavItemStatus[]
  >(initialReleaseNavItemStatuses);

  return (
    <ReleaseContext.Provider
      value={{
        isSidebarOpen,
        setIsSidebarOpen,
        releaseNavItemStatuses,
        setReleaseNavItemStatuses,
      }}
    >
      {children}
    </ReleaseContext.Provider>
  );
}
