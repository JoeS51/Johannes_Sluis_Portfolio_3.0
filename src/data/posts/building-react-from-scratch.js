const post = {
  slug: 'building-react-from-scratch',
  frontmatter: {
    title: 'How I Rebuilt React From Scratch',
    description: 'Rebuilding React for fun',
    date: '2026-02-10',
    tags: ['React', 'JavaScript', 'Side project'],
    readingTime: 35,
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

Now for the fun part. How did I actually implement a mini React?
<br/><br/>
To start off, it is important to know that JSX just compiles into JavaScript. So let's say you have a *index.jsx* file and within that file you have something like 
\`\`\` javascript
  const App = () => {
    return (
      <div id="hi">
        <h1>test</h1>
      </div>
    );
  };
\`\`\`

A tool like [Babel](https://babeljs.io/) takes this code and converts it into **createElement** function calls before the code runs in the browser. So the above code would turn into this:

\`\`\` javascript
  React.createElement(
    "div",
    {id: "hi"},
    React.createElement("h1", null, "test")
  );
\`\`\`

As you can see, the generated JavaScript code maintains the same structure as the HTML code, but represented as arguments and nested function calls. 
This *createElement* function takes these arguments: 
- Element type (div, h1, etc.)
- Props object
- Any number of children.
<br/>
This plain JavaScript object serves as a virtual DOM node. When combined, these objects form the virtual DOM tree that React uses during reconciliation.
<br/>
Let's see what a simplified implementation of*createElement* might look like:

\`\`\` javascript
  const React = {
    createElement: (type, props, ...children) => {
      return {
        type,
        props: props || {},
        children: children.flat(),
      };
    }
  };
\`\`\`

so the earlier createElement code becomes:

\`\`\`
{
  type: "div",
  props: { id: "hi" },
  children: [
    {
      type: "h1",
      props: {},
      children: ["test"]
    }
  ]
}
\`\`\`

> JavaScript evaluates function arguments before calling the outer function, so the inner createElement("h1", ...) runs first. That’s why the outer call already receives a fully constructed child object.

As you can see this createElement implementation is just making the earlier nested function call structure into a cleaner object. We do this to make reconciliation easier for ourselves. 

Now that we can describe what the UI should look like, we need a way to turn this virtual DOM tree into actual DOM nodes in the browser.

The virtual DOM is just a tree of plain JavaScript objects. To display anything on the screen, we need to traverse this tree and create corresponding DOM nodes. Thus, rendering is just a tree traversal problem.

Let’s start with this implementation:
\`\`\`
function render(vnode, container) {
  // 1) Text node
  if (typeof vnode === "string" || typeof vnode === "number") {
    container.appendChild(document.createTextNode(String(vnode)));
    return;
  }

  // 2) Function component
  if (typeof vnode.type === "function") {
    const childVNode = vnode.type({ ...(vnode.props || {}), children: vnode.children });
    render(childVNode, container);
    return;
  }

  // 3) Host element
  const domNode = document.createElement(vnode.type);
  vnode.children.forEach(child => render(child, domNode));
  container.appendChild(domNode);
}
\`\`\`

Since each virtual node can have children, and those children can have children themselves, we recursively call render() for each child. 
Essentially, we’re performing DFS of the virtual DOM tree, creating corresponding DOM nodes as we go. Don't worry if some of this code doesn't make sense. We will come back to this when I explain function components.

To mount the application, we simply call render with a root virtual node and a container element.

\`\`\`
const root = document.getElementById("root");

render(<App />, root);
\`\`\`
> Remember, this JSX is compiled into React.createElement(App, null) before the code runs which is why we can pass it directly to render.

And with that, we have rendered something to the screen!

## Re-rendering and the Problem With Naive updates

Great, we rendered something to the screen, but we're missing a core part of React: re-rendering when state changes.

Right now, the only way to update the UI is to call render() again with a brand new virtual DOM tree.

For example:
\`\`\`
let count = 0;

function increment() {
  count++;
  render(<App count={count} />, root);
}
\`\`\`

This technically works, but it's naive. Every update re-renders the entire tree from the root down. For a large applciation, this gets expensive fast and you can start losing little DOM state things (input focus, scroll position, etc). So we need a smarter way to update only what actually changed.

## Reconciliation Strategy

The smarter reconciliation strategy is to keep the previous virtual DOM tree around, generate the next one, and compare them. Then apply the smallest possible set of DOM mutations. This is how reconciliation actually works.

At a high level, my reconciler does three checks as it walks the tree:
1) Node type changed ("div" -> "span", or component type changed) => replace the node.
2) Same type, props changed => update attributes/event listeners.
3) Children changed => reconcile children (with keys if provided).

Here's a simplified idea of the diff:

\`\`\`
function reconcile(parentDom, oldVNode, newVNode) {
  // 1) The vdom node was removed
  if (newVNode == null) {
    parentDom.removeChild(oldVNode.dom);
    return;
  }

  // 2) Create this new vdom node
  if (oldVNode == null) {
    const newDom = createDom(newVNode);
    parentDom.appendChild(newDom);
    return;
  }

  // 3) Replace if different type
  if (oldVNode.type !== newVNode.type) {
    const newDom = createDom(newVNode);
    parentDom.replaceChild(newDom, oldVNode.dom);
    return;
  }

  // 4) Update props + reconcile children
  updateProps(oldVNode.dom, oldVNode.props, newVNode.props);
  reconcileChildren(oldVNode.dom, oldVNode.children, newVNode.children);
}
\`\`\`

Notice in the snippet above I’m doing things like *oldVNode.dom* and *parentDom.replaceChild(...)*. That only works because I attach the real DOM node onto each vnode as a *dom* field. So when we diff, we already have a direct handle to the element we need to update with no DOM querying required. This makes things way simpler.

For children, the naive approach is "diff by index" (child 0 with child 0, child 1 with child 1, etc). This breaks when you insert at the start of a list because everything shifts. That's what key-based reconciliation is for. If children have stable keys, we can match old and new children by key instead of index and move/insert/remove the right ones. 

(this is why React always bothers you about missing keys in lists)

This is the core idea behind reconciliation! Keep the old tree, compare it to the new tree, and patch the DOM minimally (this is where the leetcode practice actually paid off).

## Component Model 

In React, we often use components to modularize our UI, but how can we handle reconciliation with components in our version of React? In the end, a component is just a function and calling that function returns a vnode tree.

When the renderer hits a vnode whose type is a function, it calls that function with props and uses whatever it returns as the real child to render.

Here’s the tiny bit of logic that makes components work (same idea as earlier):

\`\`\` javascript
if (typeof vnode.type === "function") {
  const childVNode = vnode.type({ ...(vnode.props || {}), children: vnode.children });
  render(childVNode, container);
  return;
}
\`\`\`

Components still return regular virtual DOM nodes, so the reconciler doesn't need to account for it in a special way.

One thing to note is that components need identity across renders. React uses the function reference (and key if you’re in a list) to decide if it’s the same component or a new one. That identity is what lets state and hooks attach to the right component later.
I didn’t fully implement this in my version since I overlooked this at the start, but for a full implementation, you would want to account for this.

## State and setState

## Hooks

## Next steps
`
};

export default post;
