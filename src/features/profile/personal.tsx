'use client';

import { useAuthActions } from '@/actions/auth';
import { Button } from '@/components/buttons';
import { Input } from '@/components/input';
import { PushDropdown } from '@/components/push-dropdown';
import { PersonalInfoDto } from '@/interface/profile.interface';
import { profileAtom } from '@/state';
import classNames from 'classnames';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRecoilValue } from 'recoil';

interface Props {
  visible: boolean;
}

export const Personal = ({ visible }: Props) => {
  const profile = useRecoilValue(profileAtom);
  const { createOrUpdatePersonalInfo } = useAuthActions();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Partial<PersonalInfoDto>>({});

  const onChange = (key: keyof PersonalInfoDto, value: string) => {
    setData({ ...data, [key]: value });
  };

  const onSubmit = async () => {
    if (loading) return;

    setLoading(true);
    const response = await createOrUpdatePersonalInfo(data);
    setLoading(false);

    if (response) {
      toast.success('Personal information updated successfully');
      setData({});
    }
  };

  const canSubmit = Object.keys(data).some(
    (key) => (data as any)[key] !== (profile?.personalInfo || ({} as any))[key],
  );

  return (
    <div
      className={classNames(
        visible ? 'flex' : 'hidden',
        'flex-col flex-1 px-8 py-10 h-[100%] overflow-y-auto gap-7',
        'items-center',
      )}
    >
      <h1 className="w-[100%] text-xl font-[600] max-w-[600px]">Edit your personal information</h1>
      <div className="flex flex-col gap-4 max-w-[600px] w-[100%]">
        <Input
          onChange={(value) => onChange('fullName', value)}
          value={data?.fullName || ''}
          placeholder={profile?.personalInfo?.fullName || 'Enter your full name'}
          label="Full name"
        />
        <Input
          onChange={(value) => onChange('email', value)}
          value={data?.email || ''}
          type="email"
          placeholder={profile?.personalInfo?.email || 'Enter your email address'}
          label="Email address"
        />
        <Input
          onChange={(value) => onChange('phoneNumber', value)}
          value={data?.phoneNumber || ''}
          type="tel"
          placeholder={profile?.personalInfo?.phoneNumber || 'Enter your phone number'}
          label="Phone number"
        />
        <Input
          onChange={(value) => onChange('dateOfBirth', value)}
          value={data?.dateOfBirth}
          type="date"
          placeholder={profile?.personalInfo?.dateOfBirth || 'Enter your date of birth'}
          label="Date of birth"
        />
        <PushDropdown
          label="Gender"
          placeholder={profile?.personalInfo?.gender || 'Select your gender'}
          data={['Male', 'Female', 'Other']}
          value={data?.gender || ''}
          onChange={(value) => onChange('gender', value)}
        />
        <Input
          onChange={(value) => onChange('nationalIdentificationNumber', value)}
          value={data?.nationalIdentificationNumber || ''}
          placeholder={
            profile?.personalInfo?.nationalIdentificationNumber ||
            'Enter your National Identification Number'
          }
          label="National Identification Number"
        />
        <Button loading={loading} onClick={onSubmit} disabled={!canSubmit} className="mt-4">
          Submit
        </Button>
      </div>
    </div>
  );
};
