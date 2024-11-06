export interface PersonalInfoDto {
  fullName: string;
  dateOfBirth: string;
  gender: string;
  nationalIdentificationNumber: string;
  phoneNumber: string;
  email: string;
}

export interface HealthInfoDto {
  bloodType: string;
  allergies: string;
  preExistingConditions: string;
  disability: string;
  healthInsuranceProvider: string;
  height: string;
  weight: string;
}

export interface EducationInfoDto {
  primarySchool: string;
  secondarySchool: string;
  tertiaryInstitution: string;
  degreeOrDiploma: string;
  graduationDate: string;
  additionalCertifications: string;
}

export interface IProfile {
  did: string;
  personalInfo: PersonalInfoDto;
  healthInfo: HealthInfoDto;
  educationInfo: EducationInfoDto;
}
