'use client';

import styles from './index.module.scss';
import { Navbar } from '@/components/navbar';
import { SideNav } from '@/components/side-nav';
import { currentViewAtom } from '@/state';
import { useRecoilValue } from 'recoil';
import { Personal } from './personal';
import { Education } from './education';
import { Health } from './health';

export const Profile = () => {
  const view = useRecoilValue(currentViewAtom);

  return (
    <main className={styles.container}>
      <Navbar />
      <div className={styles.content}>
        <SideNav />
        <Personal visible={view === 'personal'} />
        <Education visible={view === 'education'} />
        <Health visible={view === 'health'} />
      </div>
    </main>
  );
};
