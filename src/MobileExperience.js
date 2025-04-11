import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Box, Typography, Avatar, Chip, Paper,
    Divider, IconButton, Stack
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

// Import your existing company logos
import Msft from './Pictures/msft.png';
import Blue from './Pictures/bo.jpeg';
import hcr from './Pictures/hcr_logo.svg';
import Cledge from './Pictures/cledge.jpeg';
import Codeninjas from './Pictures/codeninjas.png';

const experienceData = [
    {
        id: 'microsoft1',
        company: 'Microsoft',
        role: 'SWE Intern',
        logo: Msft,
        period: 'June 2024 - Sep. 2024',
        team: 'Azure Arc SQL Server Team',
        details: [
            'Developed automated tooling to generate analysis reports for simulations to ensure mission objectives are met',
            'Engineered over 15 configurations of the rocket\'s Monte-Carlo simulations, ensuring efficacy and safety'
        ],
        color: '#00a4ef'
    },
    {
        id: 'blue',
        company: 'Blue Origin',
        role: 'SWE Intern',
        logo: Blue,
        period: 'Sep. 2023 - Dec. 2023',
        team: 'New Glenn Guidance & Control',
        details: [
            'Developed automated tooling to generate analysis reports for simulations to ensure mission objectives are met',
            'Engineered over 15 configurations of the rocket\'s Monte-Carlo simulations, ensuring efficacy and safety'
        ],
        color: '#005288'
    },
    {
        id: 'microsoft2',
        company: 'Microsoft',
        role: 'SWE Intern',
        logo: Msft,
        period: 'June 2023 - Sep. 2023',
        team: 'Azure Arc SQL Server Team',
        details: [
            'Migrated Backup/Restore settings into SQL Server instances for Arc-enabled SQL Servers to allow 16,000+ enterprise partners and over 140,000 SQL Server instances to have configuration settings for backup properties',
            'Developed and integrated back end and front end solutions for the Azure Portal, using C#, REST APIs, .NET, React, and TypeScript to enhance the Backup and Restore tab for SQL Server instances'
        ],
        color: '#00a4ef'
    },
    {
        id: 'hcr',
        company: 'HCR Lab',
        role: 'Researcher',
        logo: hcr,
        period: 'June 2022 - Present',
        team: 'Stretch Robot',
        details: [
            'Collaborated with Hello Robot researchers to develop and deploy an improved interface for the Stretch Robot, enhancing client independence by reducing task completion time by over 80%',
            'Co-authoring the paper "Inquiries during Programming by Demonstration to Reduce User Burden" to facilitate easier control of the robot for individuals with motor impairments'
        ],
        color: '#6B5B95'
    },
    {
        id: 'cledge',
        company: 'Cledge',
        role: 'Software Developer',
        logo: Cledge,
        period: 'Oct. 2022 - June 2023',
        team: 'Full Stack Developer',
        details: [
            'Spearheaded the development of key features for our accessible college counseling platform, resulting in a successful demonstration at the 2023 Dempsey competition and securing a $25,000 grant for our start-up',
            'Enhanced our platform\'s experience for our 100+ users with Next.js, REST API and Azure Cosmo DB'
        ],
        color: '#FFA500'
    },
    {
        id: 'codeninjas',
        company: 'Code Ninjas',
        role: 'Lead Instructor',
        logo: Codeninjas,
        period: 'Aug. 2019 - July 2022',
        team: 'Lead Instructor',
        details: [
            'Taught the game development process to over 100 different students through platforms ranging from scratch to the Unity game engine where students created complex games to eventually publish them on the appstore and itch.io'
        ],
        color: '#FF0000'
    }
];

const MobileExperience = () => {
    const [expandedId, setExpandedId] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const handleScroll = (index) => {
        setActiveIndex(index);
        // You could add smooth scrolling here if desired
    };

    return (
        <Box sx={{ position: 'relative', pb: 4 }}>
            {/* Timeline line */}
            <Box
                sx={{
                    position: 'absolute',
                    left: '20px',
                    top: 0,
                    height: 'calc(100% - 50px)',
                    width: '3px',
                    background: 'var(--timeline-bg)',
                    zIndex: 0
                }}
            />

            {/* Experience cards */}
            {experienceData.map((job, index) => (
                <Box key={job.id} sx={{ mb: 4, position: 'relative' }}>
                    {/* Timeline dot */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                    >
                        <Box
                            component={activeIndex === index ? motion.div : 'div'}
                            animate={activeIndex === index ? {
                                scale: [1, 1.2, 1],
                                boxShadow: ['0px 0px 0px rgba(0,0,0,0.2)', '0px 0px 8px rgba(0,0,0,0.5)', '0px 0px 0px rgba(0,0,0,0.2)']
                            } : {}}
                            transition={{ repeat: Infinity, duration: 2 }}
                            sx={{
                                position: 'absolute',
                                left: '18.5px',
                                top: '24px',
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                backgroundColor: job.color,
                                zIndex: 2
                            }}
                        />
                    </motion.div>

                    {/* Card with job details */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        whileHover={{ scale: 1.03, y: -5 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Paper
                            elevation={3}
                            sx={{
                                ml: 5,
                                p: 2,
                                borderRadius: '12px',
                                borderLeft: `4px solid ${job.color}`,
                                cursor: 'pointer',
                                position: 'relative',
                                bgcolor: 'var(--card-bg)',
                                color: 'var(--text-color)',
                                boxShadow: 'var(--card-shadow)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                                }
                            }}
                            onClick={() => {
                                toggleExpand(job.id);
                                handleScroll(index);
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Avatar
                                    src={job.logo}
                                    variant="rounded"
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        mr: 2,
                                        bgcolor: '#ffffff',
                                        p: '2px',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                    }}
                                />
                                <Box sx={{ flexGrow: 1 }}>
                                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                                        {job.company}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary', opacity: 0.8 }}>
                                        {job.period}
                                    </Typography>
                                </Box>
                                <IconButton
                                    size="small"
                                    sx={{
                                        color: 'var(--text-color)',
                                        '&:hover': {
                                            color: job.color,
                                            bgcolor: 'rgba(0,0,0,0.05)'
                                        }
                                    }}
                                >
                                    {expandedId === job.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                </IconButton>
                            </Box>

                            <Chip
                                label={job.role}
                                size="small"
                                sx={{
                                    backgroundColor: `${job.color}22`,
                                    color: job.color,
                                    fontWeight: 'bold',
                                    mb: 1,
                                    '&:hover': {
                                        backgroundColor: `${job.color}33`,
                                    }
                                }}
                            />

                            <AnimatePresence>
                                {expandedId === job.id && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Divider sx={{ my: 1.5, bgcolor: 'var(--divider-color)' }} />
                                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: job.color }}>
                                            {job.team}
                                        </Typography>
                                        <Stack spacing={1.5}>
                                            {job.details.map((detail, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: i * 0.1 }}
                                                >
                                                    <Typography variant="body2" sx={{
                                                        p: 1.5,
                                                        borderRadius: '8px',
                                                        backgroundColor: 'rgba(0,0,0,0.03)',
                                                        borderLeft: `2px solid ${job.color}`,
                                                        color: 'var(--text-color)',
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(0,0,0,0.05)',
                                                            transform: 'translateX(3px)'
                                                        }
                                                    }}>
                                                        • {detail}
                                                    </Typography>
                                                </motion.div>
                                            ))}
                                        </Stack>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Paper>
                    </motion.div>
                </Box>
            ))}
        </Box>
    );
};

export default MobileExperience; 