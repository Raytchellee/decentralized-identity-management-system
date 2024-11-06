import { currentViewAtom } from '@/state';
import classNames from 'classnames';
import Link from 'next/link';
import React from 'react';
import { useRecoilState } from 'recoil';

export const SideNav = () => {
  const [view, setView] = useRecoilState(currentViewAtom);

  return (
    <aside className="w-64 h-[screen] bg-gray-900 text-white hrefp-0 left-0 p-6">
      <nav className="flex flex-col space-y-4">
        <div
          className={classNames(
            'py-2 px-4 rounded cursor-pointer hover:bg-gray-700',
            view === 'personal' && 'bg-gray-700',
          )}
          onClick={() => setView('personal')}
        >
          Personal Information
        </div>

        <div
          className={classNames(
            'py-2 px-4 rounded cursor-pointer hover:bg-gray-700',
            view === 'education' && 'bg-gray-700',
          )}
          onClick={() => setView('education')}
        >
          Education Information
        </div>

        <div
          className={classNames(
            'py-2 px-4 rounded cursor-pointer hover:bg-gray-700',
            view === 'health' && 'bg-gray-700',
          )}
          onClick={() => setView('health')}
        >
          Health Information
        </div>
      </nav>
    </aside>
  );
};
