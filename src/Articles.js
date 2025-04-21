import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import md from './articles/first.md';
import vim from './articles/learning-vim.md';
import {
    Box,
    Paper,
    Typography,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Divider,
    Container,
    Grid,
    styled
} from '@mui/material';
import ArticleIcon from '@mui/icons-material/Article';
import remarkGfm from 'remark-gfm';

// Create a styled Paper component for the Windows XP look
const StyledPaper = styled(Paper)(({ theme }) => ({
    backgroundColor: '#ffffff',
    border: '1px solid #000000',
    borderRadius: '0px',
    boxShadow: 'none',
    padding: theme.spacing(2),
    margin: theme.spacing(2),
}));

// Create a styled ListItemButton for the classic Windows look
const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
    '&.Mui-selected': {
        backgroundColor: '#000080',
        color: '#ffffff',
        '&:hover': {
            backgroundColor: '#000080',
        },
    },
    '&:hover': {
        backgroundColor: '#c0c0c0',
    },
}));

// Windows XP font styles
const xpFontStyles = {
    fontFamily: 'Tahoma, Arial, sans-serif',
    letterSpacing: '0.5px',
    lineHeight: '1.2',
};

// Sample blog posts data with dates
const blogPosts = [
    {
        id: 1,
        title: 'Hello World',
        content: md,
        date: '2025-04-21'
    },
    {
        id: 2,
        title: 'Learning Vim',
        content: vim,
        date: '2025-04-21'
    },
    {
        id: 3,
        title: 'Third Blog Post',
        content: 'Coming soon...',
        date: '2025-04-21'
    },
];

// Format date to look like Windows XP style
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

export default function Articles() {
    const [selectedPost, setSelectedPost] = useState(blogPosts[0]);
    const [markdown, setMarkdown] = useState('');

    useEffect(() => {
        if (selectedPost.id === 1 || selectedPost.id === 2) {
            fetch(selectedPost.content)
                .then((res) => res.text())
                .then((text) => setMarkdown(text));
        } else {
            setMarkdown(selectedPost.content);
        }
    }, [selectedPost]);

    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 4 }}>
                <Typography
                    variant="h4"
                    component="h1"
                    gutterBottom
                    sx={{
                        color: '#000000',
                        ...xpFontStyles,
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        fontSize: '24px',
                        marginBottom: '16px'
                    }}
                >
                    Blog Posts
                </Typography>
                <Grid container spacing={2}>
                    {/* Blog List */}
                    <Grid item xs={12} md={4}>
                        <StyledPaper>
                            <Typography
                                variant="h6"
                                gutterBottom
                                sx={{
                                    color: '#000000',
                                    ...xpFontStyles,
                                    fontWeight: 'bold',
                                    borderBottom: '1px solid #000000',
                                    paddingBottom: '4px',
                                    fontSize: '16px'
                                }}
                            >
                                Recent Posts
                            </Typography>
                            <List sx={{ padding: 0 }}>
                                {blogPosts.map((post) => (
                                    <React.Fragment key={post.id}>
                                        <ListItem disablePadding>
                                            <StyledListItemButton
                                                selected={selectedPost.id === post.id}
                                                onClick={() => setSelectedPost(post)}
                                            >
                                                <ArticleIcon sx={{ mr: 1, color: '#000000' }} />
                                                <ListItemText
                                                    primary={
                                                        <Box>
                                                            <Typography
                                                                sx={{
                                                                    ...xpFontStyles,
                                                                    fontSize: '13px',
                                                                    fontWeight: 'bold'
                                                                }}
                                                            >
                                                                {post.title}
                                                            </Typography>
                                                            <Typography
                                                                sx={{
                                                                    ...xpFontStyles,
                                                                    fontSize: '11px',
                                                                    color: '#808080',
                                                                    marginTop: '2px'
                                                                }}
                                                            >
                                                                {formatDate(post.date)}
                                                            </Typography>
                                                        </Box>
                                                    }
                                                />
                                            </StyledListItemButton>
                                        </ListItem>
                                        <Divider sx={{ borderColor: '#000000' }} />
                                    </React.Fragment>
                                ))}
                            </List>
                        </StyledPaper>
                    </Grid>
                    {/* Blog Content */}
                    <Grid item xs={12} md={8}>
                        <StyledPaper>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #000000', paddingBottom: '4px' }}>
                                <Typography
                                    variant="h5"
                                    sx={{
                                        color: '#000000',
                                        ...xpFontStyles,
                                        fontWeight: 'bold',
                                        fontSize: '18px'
                                    }}
                                >
                                    {selectedPost.title}
                                </Typography>
                                <Typography
                                    sx={{
                                        ...xpFontStyles,
                                        fontSize: '11px',
                                        color: '#808080'
                                    }}
                                >
                                    {formatDate(selectedPost.date)}
                                </Typography>
                            </Box>
                            <Box sx={{ mt: 2 }}>
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        p: ({ node, ...props }) => <Typography {...props} sx={{ ...xpFontStyles, fontSize: '13px', marginBottom: '8px' }} />,
                                        h1: ({ node, ...props }) => <Typography {...props} sx={{ ...xpFontStyles, fontSize: '20px', fontWeight: 'bold', marginBottom: '12px' }} />,
                                        h2: ({ node, ...props }) => <Typography {...props} sx={{ ...xpFontStyles, fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }} />,
                                        h3: ({ node, ...props }) => <Typography {...props} sx={{ ...xpFontStyles, fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }} />,
                                        li: ({ node, ...props }) => <Typography component="li" {...props} sx={{ ...xpFontStyles, fontSize: '13px', marginBottom: '4px' }} />,
                                    }}
                                >
                                    {markdown}
                                </ReactMarkdown>
                            </Box>
                        </StyledPaper>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}


