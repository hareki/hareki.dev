import { PROJECT_REPO_FULL_NAME } from '@/data/git';

export const easterEggLog = () => {
  const separator = `%c`;
  console.log(
    `${separator}\n%c👋 Greetings! Interested in how the site is built? 👀
\n%cCheck out the source code: https://github.com/${PROJECT_REPO_FULL_NAME}\n%cHave a great day!\n${separator}`,
    '',
    'font-size:1rem;font-weight:700;',
    'font-size: 0.75rem;font-weight:700',
    'font-size: 0.75rem;',
    '',
  );
};
