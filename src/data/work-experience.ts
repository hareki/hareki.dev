import ZigvyLogo from '@/assets/companies/zigvy.webp';

export interface ExperienceRecord {
  company: {
    name: string;
    logo: ImageMetadata;
    website: string;
    description: string;
  };
  title: string;
  startDate: Date;
  endDate?: Date;
  responsibilities: string[];
}

export const EXPERIENCE: ExperienceRecord[] = [
  {
    company: {
      name: 'Zigvy',
      logo: ZigvyLogo,
      website: 'https://zigvy.com/',
      description:
        'Zigvy is a joint American and Vietnamese software development company located in Ho Chi Minh City.',
    },
    title: 'Frontend Engineer',
    startDate: new Date('2023-01-01'),
    endDate: new Date('2026-03-31'),
    responsibilities: [
      'Built and maintained web apps for sports management and notary services.',
      'Led a microfrontend migration for an HR platform serving 200+ companies.',
    ],
  },
];
