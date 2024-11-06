'use client';

import { useAuthActions } from '@/actions/auth';
import { Button } from '@/components/buttons';
import { Input } from '@/components/input';
import { PushDropdown } from '@/components/push-dropdown';
import { HealthInfoDto } from '@/interface/profile.interface';
import { profileAtom } from '@/state';
import classNames from 'classnames';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRecoilValue } from 'recoil';

interface Props {
  visible: boolean;
}

export const Health = ({ visible }: Props) => {
  const profile = useRecoilValue(profileAtom);
  const { createOrUpdateHealthInfo } = useAuthActions();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Partial<HealthInfoDto>>({});

  const onChange = (key: keyof HealthInfoDto, value: string) => {
    setData({ ...data, [key]: value });
  };

  const onSubmit = async () => {
    if (loading) return;

    setLoading(true);
    const response = await createOrUpdateHealthInfo(data);
    setLoading(false);

    if (response) {
      toast.success('Health information updated successfully');
      setData({});
    }
  };

  const canSubmit = Object.keys(data).some(
    (key) => (data as any)[key] !== (profile?.healthInfo || ({} as any))[key],
  );

  const bloodTypes: string[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  return (
    <div
      className={classNames(
        visible ? 'flex' : 'hidden',
        'flex-col flex-1 px-8 py-10 h-[100%] overflow-y-auto gap-7',
        'items-center',
      )}
    >
      <h1 className="w-[100%] text-xl font-[600] max-w-[600px]">Edit your health information</h1>
      <div className="flex flex-col gap-4 max-w-[600px] w-[100%]">
        <PushDropdown
          label="Blood type"
          placeholder={profile?.healthInfo?.bloodType || 'Select your blood type'}
          data={bloodTypes}
          value={data?.bloodType || ''}
          onChange={(value) => onChange('bloodType', value)}
        />
        <Input
          onChange={(value) => onChange('allergies', value)}
          value={data?.allergies || ''}
          placeholder={profile?.healthInfo?.allergies || 'What are your allergies if you have any?'}
          label="Allergies"
        />
        <Input
          onChange={(value) => onChange('preExistingConditions', value)}
          value={data?.preExistingConditions || ''}
          placeholder={
            profile?.healthInfo?.preExistingConditions ||
            'What are your pre-existing health conditions if any?'
          }
          label="Pre-existing health conditions"
        />
        <Input
          onChange={(value) => onChange('disability', value)}
          value={data?.disability || ''}
          placeholder={profile?.healthInfo?.disability || 'What are your disabilities if any?'}
          label="Disabilities"
        />
        <Input
          onChange={(value) => onChange('healthInsuranceProvider', value)}
          value={data?.healthInsuranceProvider || ''}
          placeholder={
            profile?.healthInfo?.healthInsuranceProvider ||
            'Who is your health insurance provider if any?'
          }
          label="Health Insurance Provider"
        />
        <Input
          onChange={(value) => onChange('height', value)}
          value={data?.height || ''}
          placeholder={profile?.healthInfo?.height || 'Enter your height in centimeters'}
          label="Height (cm)"
        />
        <Input
          onChange={(value) => onChange('weight', value)}
          value={data?.weight || ''}
          placeholder={profile?.healthInfo?.height || 'Enter your weight in kilograms'}
          label="Weight (kg)"
        />
        <Button loading={loading} onClick={onSubmit} disabled={!canSubmit} className="mt-4">
          Submit
        </Button>
      </div>
    </div>
  );
};
