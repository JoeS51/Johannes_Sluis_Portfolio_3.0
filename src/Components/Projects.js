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
import robot from '../Pictures/hello_robot.jpg'
import manuscript from '../Pictures/manuscript.png'
import simple from '../Pictures/simpledb.jpg'
import stimma from '../Pictures/stimma.png'
import stimma2 from '../Pictures/stimma2.png'

const projects = [
    {
        title: "Manuscript Checker AI",
        description: "A manuscript checker AI that checks for plagiarism and other issues.",
        image: manuscript,
        link: "https://www.manuscriptcheck.ai/"
    },
    {
        title: "Jenni.AI Preview Tools",
        description: "A personal portfolio showcasing my projects and skills.",
        image: jenni,
        link: "https://jenni.ai/",
    },
    {
        title: "SimpleDB",
        description: "A simple database system that allows users to store and retrieve data.",
        image: simple,
        imageStyle: { objectFit: 'contain', maxHeight: '300px' },
        link: "https://example.com/chatapp",
    },
    {
        title: "Stimma",
        description: "A platform for creating and sharing AI-generated content.",
        image: stimma2,
        secondaryImage: stimma,
        imageStyle: { objectFit: 'contain', maxHeight: '200px' },
        link: "stimma.us"
    },
    {
        title: "AlgoViz",
        description: "An AI-powered app for boosting productivity.",
        image: algoviz,
        link: "https://github.com/hcp-uw/algo-visualizer"
    },
    {
        title: "SpotLite",
        description: "A real-time chat app with WebSocket integration.",
        image: spotlite,
        link: "https://github.com/JoeS51/Dubhacks24",
    },
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
                                        sx={{
                                            ...(project.imageStyle || {}),
                                            borderBottom: project.secondaryImage ? '1px solid #e0e0e0' : 'none'
                                        }}
                                    />
                                    {project.secondaryImage && (
                                        <CardMedia
                                            component="img"
                                            height="180"
                                            image={project.secondaryImage}
                                            alt={`${project.title} secondary`}
                                            sx={project.imageStyle || {}}
                                        />
                                    )}
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