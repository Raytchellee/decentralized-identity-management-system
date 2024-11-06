'use client';

import { useAuthActions } from '@/actions/auth';
import { Button } from '@/components/buttons';
import { Input } from '@/components/input';
import { EducationInfoDto } from '@/interface/profile.interface';
import { profileAtom } from '@/state';
import classNames from 'classnames';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRecoilValue } from 'recoil';

interface Props {
  visible: boolean;
}

export const Education = ({ visible }: Props) => {
  const profile = useRecoilValue(profileAtom);
  const { createOrUpdateEducationInfo } = useAuthActions();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Partial<EducationInfoDto>>({});

  const onChange = (key: keyof EducationInfoDto, value: string) => {
    setData({ ...data, [key]: value });
  };

  const onSubmit = async () => {
    if (loading) return;

    setLoading(true);
    const response = await createOrUpdateEducationInfo(data);
    setLoading(false);

    if (response) {
      toast.success('Educational information updated successfully');
      setData({});
    }
  };

  const canSubmit = Object.keys(data).some(
    (key) => (data as any)[key] !== (profile?.educationInfo || ({} as any))[key],
  );

  return (
    <div
      className={classNames(
        visible ? 'flex' : 'hidden',
        'flex-col flex-1 px-8 py-10 h-[100%] overflow-y-auto gap-7',
        'items-center',
      )}
    >
      <h1 className="w-[100%] text-xl font-[600] max-w-[600px]">
        Edit your educational information
      </h1>
      <div className="flex flex-col gap-4 max-w-[600px] w-[100%]">
        <Input
          onChange={(value) => onChange('primarySchool', value)}
          value={data?.primarySchool || ''}
          placeholder={
            profile?.educationInfo?.primarySchool || 'What primary school did you attend?'
          }
          label="Primary School"
        />
        <Input
          onChange={(value) => onChange('secondarySchool', value)}
          value={data?.secondarySchool || ''}
          placeholder={
            profile?.educationInfo?.primarySchool || 'What secondary school did you attend?'
          }
          label="Secondary School"
        />
        <Input
          onChange={(value) => onChange('tertiaryInstitution', value)}
          value={data?.tertiaryInstitution || ''}
          placeholder={
            profile?.educationInfo?.tertiaryInstitution ||
            'What tertiary institution did you attend?'
          }
          label="Tertiary Institution"
        />
        <Input
          onChange={(value) => onChange('degreeOrDiploma', value)}
          value={data?.degreeOrDiploma || ''}
          placeholder={
            profile?.educationInfo.degreeOrDiploma ||
            'What degree(s) or diploma(s) do you have? (comma separated)'
          }
          label="Degree/Diploma"
        />
        <Input
          onChange={(value) => onChange('graduationDate', value)}
          value={data?.graduationDate}
          type="date"
          placeholder={profile?.educationInfo.graduationDate || 'What was your graduation date?'}
          label="Graduation date"
        />
        <Input
          onChange={(value) => onChange('additionalCertifications', value)}
          value={data?.additionalCertifications || ''}
          placeholder={
            profile?.educationInfo.additionalCertifications ||
            'What additional certifications do you have? (comma separated)'
          }
          label="Additional qualifications"
        />
        <Button loading={loading} onClick={onSubmit} disabled={!canSubmit} className="mt-4">
          Submit
        </Button>
      </div>
    </div>
  );
};
