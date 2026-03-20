# MonkeytypeAtHome Component Specs

## Technical requirements:

- Keep the component clean, split the logic into multiple subcomponents, hooks as needed.
- We're using react 19
- Performance in mind: Avoid unnecessary rerenders as much as possible, since the user can type pretty fast, unnecessary rerenders on events that fire multiple times in a short period amount of time is the worst
- Smooth transition:
  - When in normal mode, the caret should be smoothly slide through letter to letter from left to right.
  - When in tape mode, the letters should smoothly slide through the caret from right to left

## Functional requirements:

### Idle screen

[Mock UI](./src/components/react/MonkeytypeAtHome/docs/idle-screen.png)

- The shortcut hints act like a clickable ghost buttons (changes background color on hover)
- When `Tape mode` is on, the `Tape mode` hint/ghost button will glow as if it's hovered.
- For the `Tape mode` shortcut, it should be [Ctrl + .] on Windows/Linux, [Cmd + .] on MacOS.
- `Tape mode` is forced to be on with no opt-out when the component width smaller than certain threshold that it can't fully display the entire text in one line. In that case, hide the hint/ghost `Tape mode` button, as it's always on anyway.
- As for the `Tape mode` behavior, refer to [Monkeytype](https://github.com/monkeytypegame/monkeytype) tape mode, use the "letter" variant, meaning the word stream shifts left after every single keypress.
- As for the `Restart` shortcut, we simply need to make sure that when the component is focused,
  the next `tab` key prssed will land on the hint/ghost `Restart` button.
- When component is not focused, clicking anywhere on the component will focus the typing area
  and subtly raise the entire component background, indicating that it's focused.

### Typing screen

[Mock UI](./src/components/react/MonkeytypeAtHome/docs/typing-screen.png)

#### Colors (Use the established catppuccin palette)

- Haven't been typed letters: overlay1
- Correctly typed letters: text
- Incorrectly typed letters: red

#### Word count

- The `0/9` at the bottom right of the mock UI means: `Words typed / Total words`

#### Behavior

- Each time the user hits `space`, with at least one letter typed on that word (might be incorrect)
  increase the word typed, move on to next word. If the previous word is incorrectly typed, pressing `backspace` can bring the move back to the previous word, decrease the words typed accordingly.
- If the previous word is already correctly typed, pressing backspace do not move back to previous word
- Previous incorrectly-typed words will have a red underline
- Suppose a word is correctly typed, but then instead of pressing `space` to move on to next word, the user press a redundant letter, that counts as incorrectly typed letter as well.
- The text is fixed as "The quick brown fox jumps over the lazy dog"

### Result Screen

[Mock UI](./src/components/react/MonkeytypeAtHome/docs/result-screen.png)

- Use the algorithms that [Monkeytype](https://github.com/monkeytypegame/monkeytype) uses to calcute theses stats
- Hovering on each stat will show additional info:
  - wpm: show the words per min in decimal form, ronuded up two 2 decimal places (the stat outside will show words per min rounded to nearest integer)
  - acc: show the accuracy in decimal form, ronuded up two 2 decimal places (the stat outside will show accuracy rounded to nearest integer)
  - time: show the time taken in decimal form, ronuded up two 2 decimal places (the stat outside will show time taken rounded to nearest integer)
  - characters: will show the meaning of each number, which is correct, incorrect, extra, missed, each words separated by the newline character
- Store the best wpm in local storage, if the result is greater than the previous one, update the local storage and show `@tabler/icons/filled/crown.svg` next to the wpm label
