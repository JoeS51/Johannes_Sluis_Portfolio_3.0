const post = {
  slug: 'building-react-from-scratch',
  frontmatter: {
    title: 'Building React From Scratch',
    description: 'Rebuilding React for fun',
    date: '2026-02-10',
    tags: ['React', 'JavaScript', 'Side project'],
    readingTime: 35.2,
    cover: null
  },
  content: `
⚠️ This blog is still under construction.

## Why?
I started this project in the summer of 2025 after reading this [wonderful article](https://www.rob.directory/blog/react-from-scratch#reconciling-view-nodes-between-render) by Rob Pruzan. Since then, it's been a fun side project, and I've finally gotten it
to a point where I wanted to share. I didn't necessarily have a goal in mind when starting this project, but surprisingly, it's opened up a lot of possibilities for me.
Some open source projects I'm interested in, like (LINK THESE AND MAKE SURE IT"S ACCURATE) HonoX, Solid.js, and Rari (React rewritten in Rust), all have very similar concepts to what I implemented for this project.

Here is the repo if you want to follow along with this article:
[link](https://github.com/JoeS51/React-lite)

As part of this project, I built a lightweight React with a virtual DOM, a custom renderer and reconciler, key-based reconciliation, and a lot of the hooks (useState, useEffect, useRef, useMemo, useCallback, useReducer, useLayoutEffect).

## Context
Before frameworks like React existed, interactivity in websites required you to manually update the DOM in response to events. Developers would listen for user interactions, query the DOM, and mutate the DOM using tools like jQuery.
The developer was responsible for keeping the UI in sync with the application state. React introduced a new way of creating web apps that abstracted this away. With React, you define some state and React handles updating the DOM based on state changes. (Important note: React wasn't the first framework to do this, but it popularized the approach) <br/><br/>
I wanted to explore how React does this for you using concepts like the virtual DOM, reconciliation, hooks, which is what I'll be explaining :)

## Virtual DOM basics
To understand the purpose of the virtual DOM, you need to understand the DOM itself.
The DOM is what browsers use to know what goes on your webpage. [More info here](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model).

Here's a quick visual of the DOM:
![DOM tree diagram](/images/1_W91R-0YkyCNOVfQChFqZVg.gif)
As you can see, it's just a tree. When you want to update something on the page, you could mutate this DOM directly like I mentioned earlier. Without React, finding the correct node and manually changing its properties.
If you wanted to change the title, for example, you'd grab that element (or just set document.title) and update its text. For small websites, this can work fine. As your app grows though, this becomes hard to manage (although React has its own problems as applications grow).
<br/><br/>
React takes a different approach.
React actually creates a lightweight representation of this DOM in memory, called the virtual DOM. Remember that React manages state for you, so when you change some state, React needs to be able to update the DOM on its own rather than the developer doing this.
To understand what part of the DOM to change, React maintains this virtual DOM. To be more specific, this virtual DOM is just a tree of JavaScript objects that descibes what the UI *should* look like. 
<br/><br/>
When state changes in your React app, React generates a new virtual DOM tree. It then compares this new virtual DOM tree with your previous virtual DOM tree to determine what exactly changed. This process is called **diffing**.
Diffing allows React to compute the set of updates required to synchronize the real DOM with the new virtual DOM. The full process of updating the UI to match the new virtual DOM state is called **reconciliation**.

Here's a visual representation of how diffing/reconciliation works:
![Diffing visual](/images/diffing.jpg)

## Rendering to the DOM

Now for the fun part. How did I actually implement React in code?
<br/><br/>
To start off, it is important to know that JSX just compiles into JavaScript. So let's say you have a *index.jsx* file and within that file you have something like 
\`\`\` javascript
  const app = () => {
    return (
      <h1>test</h1>
    );
  };
\`\`\`

### CreateElement


## Updating elements

## Reconciliation strategy

## Component model

## Props and children

## State and setState

## Hooks: useState

## useEffect, useState, useMemo, etc

## Testing your renderer

## Next steps
`
};

export default post;
