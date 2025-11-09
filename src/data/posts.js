const posts = [
  {
    slug: 'hello-world',
    frontmatter: {
      title: 'Hello World',
      description: 'Kicking off the blog with thoughts on learning in public and what to expect.',
      date: '2024-04-21',
      tags: ['Personal', 'Meta'],
      cover: null
    },
    content: `# My First Piece

`
  }
  // {
  //   slug: 'learning-vim',
  //   frontmatter: {
  //     title: 'Learning Vim',
  //     description: 'A lighthearted rundown of how I got comfortable living inside Vim.',
  //     date: '2024-04-28',
  //     tags: ['Tools', 'Developer'],
  //     cover: null
  //   },
  //   content: `# So you want to learn vim?

// The first and most important step before you learn vim is to reconsider it.

// If you still want to learn it, I'll give you the ultimate guide as someone that has been using it since about 7 (months ago).

// ## Understanding the basics

// - h = 1 char left
// - j = 1 char down
// - k = 1 char up
// - l = 1 char right
// - h, j, k, l is so random why do we use them?
//   - It started because old keyboards had arrow keys on h, j, k, l...
// - Once you master moving around like that you're ready

// Okay go ahead and screenshot these—I know you want to. Here's my Venmo:

// ![picture of grass](/images/touch-grass.jpg "Remember to touch grass between Vim sessions")
// `
  // },
  // {
  //   slug: 'shipping-things',
  //   frontmatter: {
  //     title: 'Shipping Things Fast',
  //     description: 'A few notes on staying focused, iterating quickly, and actually shipping.',
  //     date: '2024-05-05',
  //     tags: ['Process', 'Product'],
  //     cover: null
  //   },
  //   content: `# Shipping things fast

// I love the feeling of shipping a feature while the idea is still warm. It keeps momentum high and teaches you what actually matters.

// Here is the framework I'm trying to follow lately:

// 1. **Decide once.** If the decision isn't reversible, grab a friend, talk it out, then move forward confidently.
// 2. **Automate the boring bits.** Scripts, snippets, templates—anything that removes friction lets you stay in flow.
// 3. **Write down what you learned.** Even a short paragraph helps future-you remember the context behind a choice.

// ## Staying focused

// > Momentum thrives on clarity. Every todo list item should move the mission forward.

// - Start the day by rewriting the backlog in plain language.
// - Keep meetings short and purposeful.
// - Celebrate the small wins so the team knows progress is real.

// ## Iteration loops

// I try to ship in loops no longer than a week:

// | Day | Focus |
// | --- | ----- |
// | Mon | Define the problem |
// | Tue | Prototype |
// | Wed | Feedback |
// | Thu | Polish |
// | Fri | Ship |

// By keeping the loop tight, nothing has the chance to drift. Feedback happens while the details are fresh, which makes the next loop even faster.
// `
  // }
];

export default posts;
