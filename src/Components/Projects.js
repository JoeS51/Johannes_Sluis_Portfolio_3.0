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
import algoviz from '../Pictures/algoviz.JPG'
import jenni from '../Pictures/jenni.JPG'
import spotlite from '../Pictures/spotlite.JPG'

const projects = [
    {
        title: "Jenni.AI Mini Tools",
        description: "A personal portfolio showcasing my projects and skills.",
        image: jenni,
        link: "https://example.com/portfolio",
    },
    {
        title: "SpotLite",
        description: "A real-time chat app with WebSocket integration.",
        image: spotlite,
        link: "https://example.com/chatapp",
    },
    {
        title: "AlgoViz",
        description: "An AI-powered app for boosting productivity.",
        image: algoviz,
        link: "https://example.com/ai-tool",
    },
    {
        title: "Stretch Robot Project",
        description: "test",
        image: algoviz,
        link: "test"
    }
];

const ProjectCard = () => {
    return (
        <Box sx={{ flexGrow: 1, padding: 4, display: 'flex', justifyContent: 'center' }}>
            <Grid
                container
                spacing={2}
                sx={{
                    maxWidth: 1200,
                    justifyContent: 'center',
                    alignItems: 'stretch',
                    gap: "10px",
                }}
            >
                {projects.map((project, index) => (
                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        key={index}
                        sx={{
                            display: 'flex',
                            justifyContent: 'center'
                        }}
                    >
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            style={{ width: '100%', height: '100%' }}
                        >
                            <Card
                                sx={{
                                    width: '100%',
                                    maxWidth: 345,
                                    height: '100%',
                                    borderRadius: "16px",
                                    boxShadow: 6,
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}
                            >
                                <CardActionArea
                                    href={project.link}
                                    target="_blank"
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        height="180"
                                        image={project.image}
                                        alt={project.title}
                                    />
                                    <CardContent sx={{ flexGrow: 1 }}>
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