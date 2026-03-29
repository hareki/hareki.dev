import { PROJECT_REPO_FULL_NAME } from '@/data/git';

export const easterEggLog = () => {
  const separator = `%c`;
  console.log(
    `${separator}
%cGreetings! Interested in how this website is built?

%cCheck out the source code: https://github.com/${PROJECT_REPO_FULL_NAME}
%cHave a great day!
${separator}`,
    '',
    'font-size:1rem;font-weight:700;',
    'font-size: 0.75rem;font-weight:700',
    'font-size: 0.75rem;',
    '',
  );
};
