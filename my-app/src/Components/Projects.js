import React from "react";
import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    Grid,
    Box,
    CardActionArea,
} from "@mui/material";
import { motion } from "framer-motion";

const projects = [
    {
        title: "Portfolio Website",
        description: "A personal portfolio showcasing my projects and skills.",
        image: "/images/portfolio.png",
        link: "https://example.com/portfolio",
    },
    {
        title: "Chat Application",
        description: "A real-time chat app with WebSocket integration.",
        image: "/images/chatapp.png",
        link: "https://example.com/chatapp",
    },
    {
        title: "AI Productivity Tool",
        description: "An AI-powered app for boosting productivity.",
        image: "/images/ai-productivity.png",
        link: "https://example.com/ai-tool",
    },
];

const ProjectCard = () => {
    return (
        <Box sx={{ flexGrow: 1, padding: 4 }}>
            <Grid container spacing={4}>
                {projects.map((project, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Card sx={{ maxWidth: 345, borderRadius: "16px", boxShadow: 6 }}>
                                <CardActionArea
                                    href={project.link}
                                    target="_blank"
                                    sx={{ height: "100%" }}
                                >
                                    <CardMedia
                                        component="img"
                                        height="180"
                                        image={project.image}
                                        alt={project.title}
                                    />
                                    <CardContent>
                                        <Typography
                                            variant="h6"
                                            component="div"
                                            gutterBottom
                                            sx={{
                                                color: "#323DD6",
                                                fontWeight: "bold",
                                                textAlign: "center",
                                            }}
                                        >
                                            {project.title}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{
                                                textAlign: "center",
                                            }}
                                        >
                                            {project.description}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </motion.div>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default ProjectCard;
