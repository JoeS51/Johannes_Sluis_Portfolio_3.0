const post = {
  slug: 'building-react-from-scratch',
  frontmatter: {
    title: 'Building React From Scratch',
    description: 'Rebuilding React for fun',
    date: '2026-02-10',
    tags: ['React', 'JavaScript', 'Side project'],
    readingTime: 30,
    cover: null
  },
  content: `
⚠️ This blog is still under construction.

## Why?
I started this project in the summer of 2025 after reading this [wonderful article](https://www.rob.directory/blog/react-from-scratch#reconciling-view-nodes-between-render) by Rob Pruzan. Since then, it's been a fun side project, and I've finally gotten it
to a point where I wanted to share. I didn't necessarily have a goal in mind when starting this project, but surprisingly, it's opened up a lot of possibilities for me.
Some open source projects I'm interested in, like HonoX, Solid.js, and Rari (React rewritten in Rust), all have very similar concepts to what I implemented for this project.

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
As you can see, it's basically just a tree. When you want to change some state on your website, you could just change this DOM directly like I mentioned earlier. Without React, that usually means wiring up event listeners, finding the right node, and mutating it by hand. If you wanted to change the <title>, for example, you'd grab that element (or just set document.title) and update its text. React takes a different approach though.
React actually creates a lightweight representation of this DOM, called the virtual DOM. Remember that React manages state for you, so when you change some state, React needs to be able to update the DOM on its own. To understand what part of the DOM
to change, React maintains this virtual DOM and compares it to the previous version to figure out what needs updating.

## Rendering to the DOM

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
