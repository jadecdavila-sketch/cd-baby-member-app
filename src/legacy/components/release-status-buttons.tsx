// this file is just for example purposes, it will be deleted in the future

import { useContext } from 'react';
import {
  ReleaseContext,
  ReleaseStepStatus,
} from '@/app/_providers/ReleaseProvider';
import { Button } from '@/components/button';

interface ReleaseStatusButtonsProps {
  navItemId: string;
}

export function ReleaseStatusButtons({ navItemId }: ReleaseStatusButtonsProps) {
  const { setReleaseNavItemStatuses } = useContext(ReleaseContext);

  const setStatus = (status: ReleaseStepStatus) => {
    setReleaseNavItemStatuses((prev) => {
      return prev.map((item) => {
        if (item.id === navItemId) {
          return { ...item, status };
        } else if (item.subItems && Array.isArray(item.subItems)) {
          const updatedSubItems = item.subItems.map((subItem) =>
            subItem.id === navItemId ? { ...subItem, status } : subItem
          );
          // TODO: maybe this logic should be preserved somewhere
          const anySubItemsActionRequiredAfterUpdate = updatedSubItems.some(
            (subItem) => subItem.status === ReleaseStepStatus.ActionRequired
          );
          const anySubItemsIncompleteAfterUpdate = updatedSubItems.some(
            (subItem) => subItem.status === ReleaseStepStatus.Incomplete
          );
          const allSubItemsCompleteAfterUpdate = updatedSubItems.every(
            (subItem) => subItem.status === ReleaseStepStatus.Complete
          );
          const newStatus = (() => {
            if (anySubItemsActionRequiredAfterUpdate) {
              return ReleaseStepStatus.ActionRequired;
            }
            if (anySubItemsIncompleteAfterUpdate) {
              return ReleaseStepStatus.Incomplete;
            }
            if (allSubItemsCompleteAfterUpdate) {
              return ReleaseStepStatus.Complete;
            }
            return item.status;
          })();

          return {
            ...item,
            status: newStatus,
            subItems: updatedSubItems,
          };
        } else {
          return item;
        }
      });
    });
  };

  return (
    <div className="mt-4 flex flex-col gap-2">
      <Button
        variant="outline"
        className="border-gray-400 text-gray-700 hover:bg-gray-100 dark:border-gray-500 dark:text-gray-200 dark:hover:bg-gray-800"
        onClick={() => setStatus(ReleaseStepStatus.Incomplete)}
      >
        Mark Incomplete
      </Button>
      <Button
        variant="outline"
        className="border-green-500 text-green-700 hover:bg-green-50 dark:border-green-400 dark:text-green-300 dark:hover:bg-green-900"
        onClick={() => setStatus(ReleaseStepStatus.Complete)}
      >
        Mark Complete
      </Button>
      <Button
        variant="outline"
        className="border-yellow-500 text-yellow-700 hover:bg-yellow-50 dark:border-yellow-400 dark:text-yellow-300 dark:hover:bg-yellow-900"
        onClick={() => setStatus(ReleaseStepStatus.ActionRequired)}
      >
        Mark Action Required
      </Button>
    </div>
  );
}
