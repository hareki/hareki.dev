import ZigvyLogo from '@/assets/companies/zigvy.jpg';

interface ExperienceRecord {
  name: string;
  logo: ImageMetadata;
  url: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  responsibilities: string[];
}

export const EXPERIENCE: ExperienceRecord[] = [
  {
    name: 'Zigvy',
    logo: ZigvyLogo,
    url: 'https://zigvy.com/',
    position: 'Junior Frontend Engineer',
    startDate: new Date('2023-01-01'),
    endDate: new Date('2026-03-31'),
    responsibilities: [
      'Developed and maintained the frontend of the Zigvy e-commerce platform using React and TypeScript.',
      'Collaborated with the design team to implement responsive and user-friendly interfaces.',
      'Optimized website performance, resulting in a 20% decrease in load times.',
    ],
  },
];
