import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import md from './microsoft.md'

const markdown = `
# Hello 👋

This is a **Markdown** _example_.
- It supports lists
- \`inline code\`
`;

export default function Articles() {
    const [markdown, setMarkdown] = useState('test');

    useEffect(() => {
        fetch(md)
            .then((res) => {
                console.log(res);
                return res.text();
            })
            .then((text) => setMarkdown(text));
    }, []);

    return (
        <div>
            <h1>Articles</h1>
            <ReactMarkdown>
                {markdown}
            </ReactMarkdown>
        </div>
    );
}


