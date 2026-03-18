const DOTFILES_FULL_NAME = 'hareki/dotfiles';

export const BeyondWorkLink = {
  MONKEYTYPE_PROFILE: 'https://monkeytype.com/profile/hareki',
  GLOVE80: 'https://www.moergo.com/collections/glove80-keyboards',
  NEOVIM: 'https://neovim.io/',
  DOTFILES: `https://github.com/${DOTFILES_FULL_NAME}`,
  DOTFILES_FULL_NAME: DOTFILES_FULL_NAME,
};

interface Module {
  name: string;
  url: string;
}
const DOTFILES = `${BeyondWorkLink.DOTFILES}/tree/main`;

export const MAIN_MODULES: Module[] = [
  {
    name: 'Neovim',
    url: `${DOTFILES}/nvim/.config/nvim`,
  },

  {
    name: 'Zsh',
    url: `${DOTFILES}/zsh`,
  },

  {
    name: 'Tmux',
    url: `${DOTFILES}/tmux`,
  },
];
