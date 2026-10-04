const post = {
  slug: 'leetcode-in-x86-64-assembly',
  frontmatter: {
    title: 'Solving LeetCode in x86-64 Assembly',
    description:
      'What it takes to solve LeetCode problems without a compiler, runtime, or standard library.',
    date: '2026-10-03',
    tags: ['Assembly', 'x86-64', 'LeetCode'],
    cover: null,
  },
  content: `
## Why solve LeetCode in assembly?

<!-- TODO: Explain what motivated the experiment and what you hoped to learn. -->

Most LeetCode solutions hide details like calling conventions, memory layout, and register allocation behind a compiler. Writing a solution in x86-64 assembly makes every one of those decisions explicit.

## The environment

<!-- TODO: Document the LeetCode language/runtime setup and link to the final submission. -->

This article uses x86-64 assembly with Intel syntax and the System V AMD64 ABI. Before solving a problem, we need to know how LeetCode calls our function and what it expects us to return.

## Calling convention crash course

<!-- TODO: Explain argument registers, return values, caller-saved registers, and callee-saved registers. -->

| Purpose | Register |
| --- | --- |
| Arguments 1-6 | \`rdi\`, \`rsi\`, \`rdx\`, \`rcx\`, \`r8\`, \`r9\` |
| Integer return value | \`rax\` |
| Stack pointer | \`rsp\` |

~~~asm
global solution

section .text
solution:
    ; TODO: Implement the function.
    xor eax, eax
    ret
~~~

## Choosing a problem

<!-- TODO: Introduce the problem, its constraints, and why it is a useful assembly example. -->

Start with a problem whose interface uses integers and flat arrays. This keeps the focus on the algorithm and ABI instead of string representation or dynamic allocation.

## Designing the algorithm

<!-- TODO: Show the high-level solution first, then map each variable to a register or stack slot. -->

| Value | Location | Notes |
| --- | --- | --- |
| Input pointer | \`rdi\` | TODO |
| Input length | \`rsi\` | TODO |
| Return value | \`rax\` | TODO |

## Translating it to x86-64

<!-- TODO: Build the solution incrementally and explain each instruction sequence. -->

~~~asm
; TODO: Add the complete accepted solution here.
~~~

## Debugging the submission

<!-- TODO: Cover compiler errors, segfaults, register clobbering, and off-by-one mistakes encountered. -->

Useful questions when the submission fails:

- Does every memory access use the correct element width?
- Are callee-saved registers restored before returning?
- Is the stack aligned before calling another function?
- Does the function satisfy LeetCode's exact return-value contract?

## Performance and tradeoffs

<!-- TODO: Compare the assembly submission with an equivalent C/C++ solution and inspect generated assembly. -->

Handwritten assembly is not automatically faster than compiler output. The interesting comparison is not only runtime, but which low-level decisions the compiler makes differently.

## What I learned

<!-- TODO: Summarize the lessons about the ABI, memory, debugging, and compiler behavior. -->
`,
};

export default post;
