const vimBlocks = [
  {
    type: 'h2',
    id: 'start-in-normal-mode',
    text: 'Start in normal mode',
  },
  {
    type: 'p',
    text: 'Vim feels strange at first because you do not begin by typing. You begin in normal mode, which is the mode for moving, deleting, jumping, searching, and deciding what to do next. This article is also a tiny fake Vim buffer, so you can practice the keys while reading about them.',
  },
  {
    type: 'p',
    text: 'Try this first: press h to move left, l to move right, j to move down, and k to move up. Those four keys are the classic Vim movement keys. The cursor is the highlighted character, and the status bar at the bottom shows your current line and column.',
  },
  {
    type: 'h2',
    id: 'why-hjkl-exists',
    text: 'Why hjkl exists',
  },
  {
    type: 'p',
    text: 'The h j k l keys come from the ADM-3A terminal keyboard used by Bill Joy when vi was created. Its arrow labels lived on those letter keys, so the habit became part of vi, then Vim, and now every Vim user gets to pretend the arrow keys are lava.',
  },
  {
    type: 'quote',
    text: 'Practice: move to this quote, then use h and l to walk across the sentence one character at a time. Use j and k to leave and come back.',
  },
  {
    type: 'h2',
    id: 'jump-within-a-line',
    text: 'Jump within a line',
  },
  {
    type: 'p',
    text: 'Moving one character at a time is useful, but Vim is built around bigger jumps. Press 0 to jump to the beginning of the current line. Press $ to jump to the end. Press ^ to jump to the first non-blank character, which matters in code because indentation is usually not where the interesting text begins.',
  },
  {
    type: 'code',
    text: '    function greet() {\n      return "hello from the first non-blank character";\n    }',
  },
  {
    type: 'p',
    text: 'Practice: land on the code block above, press 0, then ^, then $. The cursor should jump from the true start, to the first visible character, to the final character in the line-like block.',
  },
  {
    type: 'h2',
    id: 'move-by-words',
    text: 'Move by words',
  },
  {
    type: 'p',
    text: 'Vim also thinks in words. Press w to jump forward to the start of the next word. Press b to jump backward to the start of the previous word. This is faster than holding l forever like a tiny keyboard woodpecker.',
  },
  {
    type: 'p',
    text: 'Practice words here: alpha beta_gamma 123numbers punctuation! final-word. Try w and b across this sentence until the rhythm starts to make sense.',
  },
  {
    type: 'h2',
    id: 'delete-with-dd-and-x',
    text: 'Delete with x and dd',
  },
  {
    type: 'p',
    text: 'In normal mode, x deletes the character under the cursor. That is good for tiny mistakes. Press dd to delete the whole current block, which is the Vim classic for deleting a line. If you regret it, press u to undo the last change.',
  },
  {
    type: 'p',
    text: 'Practice: delete a few characters from this sentence with x. Then press u. If you are feeling chaotic, press dd on this whole paragraph and bring it back with u.',
  },
  {
    type: 'h2',
    id: 'insert-mode-is-for-typing',
    text: 'Insert mode is for typing',
  },
  {
    type: 'p',
    text: 'Normal mode is not where you write prose. Press i to enter insert mode before the cursor, or a to enter insert mode after the cursor. Type whatever you want, then press Esc to return to normal mode. Your edits are temporary and live only in this page session.',
  },
  {
    type: 'p',
    text: 'You can also press o to open a new editable line below the current block, or O to open one above it. That mirrors Vim: lowercase o opens below, uppercase O opens above.',
  },
  {
    type: 'h2',
    id: 'modes-are-the-point',
    text: 'Modes are the point',
  },
  {
    type: 'p',
    text: 'Vim has modes because editing is not just typing. Normal mode is for commands. Insert mode is for text. Visual mode is for selecting text. Command-line mode is for commands that begin with a colon, like :w to write a file or :q to quit. This demo only implements a tiny slice, but the idea is the same.',
  },
  {
    type: 'quote',
    text: 'The core Vim trick is composability: small motions and small actions combine into larger editing moves. Once that clicks, editing starts to feel like a language.',
  },
  {
    type: 'h2',
    id: 'history-and-fun-facts',
    text: 'History and fun facts',
  },
  {
    type: 'p',
    text: 'vi was created by Bill Joy in the 1970s. Vim, short for Vi IMproved, was first released by Bram Moolenaar in 1991. Neovim later forked from Vim with a focus on extensibility, async plugins, and cleaner embedding.',
  },
  {
    type: 'p',
    text: 'Fun fact: Vim has registers, macros, marks, splits, tabs, buffers, folding, spell checking, terminal windows, and enough configuration gravity to turn a quiet weekend into dotfiles archaeology.',
  },
  {
    type: 'h2',
    id: 'playground',
    text: 'Playground',
  },
  {
    type: 'p',
    text: 'This bottom section is for messing around. Try h j k l, w, b, 0, ^, $, x, dd, u, i, a, o, and O. Refreshing the page restores the original tutorial, so nothing you do here is permanent.',
  },
  {
    type: 'p',
    text: 'Playground line one: edit me, delete me, jump around me, and undo your tiny crimes.',
  },
  {
    type: 'p',
    text: 'Playground line two: the quick brown Vim user jumped over the lazy arrow keys.',
  },
  {
    type: 'p',
    text: 'Playground line three: press o below this paragraph and write your own temporary note.',
  },
];

const blockToMarkdown = (block) => {
  switch (block.type) {
    case 'h2':
      return `## ${block.text}`;
    case 'h3':
      return `### ${block.text}`;
    case 'quote':
      return `> ${block.text}`;
    case 'code':
      return `\`\`\`vim\n${block.text}\n\`\`\``;
    default:
      return block.text;
  }
};

const post = {
  slug: 'vim-test-buffer',
  frontmatter: {
    title: 'Learn Vim by Editing This Article',
    description: 'An interactive Vim-style blog post that teaches movement, modes, deletion, insertion, and a few editor facts.',
    date: '2026-05-08',
    tags: ['Vim', 'Experiment', 'Editor'],
    readingTime: 5,
    cover: null,
  },
  interactive: {
    type: 'vim-editor',
    blocks: vimBlocks,
  },
  content: vimBlocks.map(blockToMarkdown).join('\n\n'),
};

export default post;
