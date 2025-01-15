import React from 'react'
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import CardGroup from 'react-bootstrap/CardGroup';
import styles from './styles.module.css'

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import WorkIcon from '@mui/icons-material/Work';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import Msft from './Pictures/msft.png'
import Blue from './Pictures/bo.jpeg'
import hcr from './Pictures/hcr_logo.svg'
import Cledge from './Pictures/cledge.jpeg'
import Codeninjas from './Pictures/codeninjas.png'
import Azure from './Pictures/azure.png'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import Ace from './Pictures/ace.png'
import ListItemButton from '@mui/material/ListItemButton';
import robot from './Pictures/robot.png'
import ninja from './Pictures/ninja.png'

import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import { motion } from 'framer-motion';

import Grow from '@mui/material/Grow';


const Experience = () => {
    const [job, setJob] = React.useState("Microsoft1");
    return (
        <div>
            <Stack direction="row"
                divider={<Divider orientation="vertical" flexItem />}
                spacing={2}>
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                    <ListItemButton onClick={() => setJob("Microsoft1")} selected={job == "Microsoft1"}>
                        <ListItemAvatar>
                            <Avatar variant='square' src={Msft} />
                        </ListItemAvatar>
                        <ListItemText primary="Microsoft | SWE Intern" secondary="June 2024 - Sep. 2024" />
                    </ListItemButton>
                    <ListItemButton onClick={() => setJob("Blue")} selected={job == "Blue"}>
                        <ListItemAvatar>
                            <Avatar variant='square' src={Blue} />
                        </ListItemAvatar>
                        <ListItemText primary="Blue Origin | SWE Intern" secondary="Sep. 2023 - Dec. 2023" />
                    </ListItemButton>
                    <ListItemButton onClick={() => setJob("Microsoft2")} selected={job == "Microsoft2"}>
                        <ListItemAvatar>
                            <Avatar variant='square' src={Msft} />
                        </ListItemAvatar>
                        <ListItemText primary="Microsoft | SWE Intern" secondary="June 2023 - Sep. 2023" />
                    </ListItemButton>
                    <ListItemButton onClick={() => setJob("Hcr")} selected={job == "Hcr"}>
                        <ListItemAvatar>
                            <Avatar variant='square' src={hcr} />
                        </ListItemAvatar>
                        <ListItemText primary="HCR Lab | Researcher" secondary="June 2022 - Present" />
                    </ListItemButton>
                    <ListItemButton onClick={() => setJob("Cledge")} selected={job == "Cledge"}>
                        <ListItemAvatar>
                            <Avatar variant='square' src={Cledge} />
                        </ListItemAvatar>
                        <ListItemText primary="Cledge | Software Developer" secondary="Oct. 2022 - June 2023" />
                    </ListItemButton>
                    <ListItemButton onClick={() => setJob("Codeninjas")} selected={job == "Codeninjas"}>
                        <ListItemAvatar>
                            <Avatar variant='square' src={Codeninjas} />
                        </ListItemAvatar>
                        <ListItemText primary="Code Ninjas | Lead Instructor" secondary="Aug. 2019 - July 2022" />
                    </ListItemButton>
                </List>
                {job == "Microsoft1" &&
                    <Grow in={job == "Microsoft1"} {...(job == "Microsoft1" ? { timeout: 750 } : {})}>
                        <Card border="light" style={{ width: '40rem' }}>
                            <Card.Header>Microsoft</Card.Header>
                            <Card.Body>
                                <Card.Title>Azure Arc SQL Server Team</Card.Title>
                                <Card.Text>
                                    <ul className={styles.list}>
                                        <br></br>
                                        <li className={styles.listItem}>Developed automated tooling to generate analysis reports for simulations to ensure mission objectives are met</li>
                                        <br></br>
                                        <li className={styles.listItem}>Engineered over 15 configurations of the rocket’s Monte-Carlo simulations, ensuring efficacy and safety</li>
                                    </ul>
                                    <br></br>
                                    <motion.div
                                        animate={{ rotate: [0, 360] }} // Rotate from 0 to 360 degrees
                                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            transformOrigin: "center", // Ensures rotation happens around the center
                                        }}
                                    >
                                        <img src={Azure} height={100} width={100} />
                                    </motion.div>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Grow>
                }
                {job == "Blue" &&
                    <Grow in={job == "Blue"} {...(job == "Blue" ? { timeout: 750 } : {})}>
                        <Card border="light" style={{ width: '40rem' }}>
                            <Card.Header>Blue Origin</Card.Header>
                            <Card.Body>
                                <Card.Title>New Glenn Guidance & Control</Card.Title>
                                <Card.Text>
                                    <ul className={styles.list}>
                                        <br></br>
                                        <li className={styles.listItem}>Developed automated tooling to generate analysis reports for simulations to ensure mission objectives are met</li>
                                        <br></br>
                                        <li className={styles.listItem}>Engineered over 15 configurations of the rocket’s Monte-Carlo simulations, ensuring efficacy and safety</li>
                                    </ul>
                                    <br></br>
                                    <motion.div
                                        animate={{ x: [0, 500, 0] }}  // Move 30px to the right and back
                                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                    >
                                        <RocketLaunchIcon
                                            fontSize="large" />
                                    </motion.div>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Grow>
                }
                {job == "Microsoft2" &&
                    <Grow in={job == "Microsoft2"} {...(job == "Microsoft2" ? { timeout: 750 } : {})}>
                        <Card border="light" style={{ width: '40rem' }}>
                            <Card.Header>Microsoft</Card.Header>
                            <Card.Body>
                                <Card.Title>Azure Arc SQL Server Team</Card.Title>
                                <Card.Text>
                                    <ul className={styles.list}>
                                        <br></br>
                                        <li className={styles.listItem}>Migrated Backup/Restore settings into SQL Server instances for Arc-enabled SQL Servers to allow 16,000+
                                            enterprise partners and <span style={{ color: 'green' }}>over 140,000 SQL Server instances</span> to have configuration settings for backup properties</li>
                                        <br></br>
                                        <li className={styles.listItem}>Developed and integrated back end and front end solutions for the Azure Portal, using C#, REST APIs, .NET,
                                            React, and TypeScript to enhance the Backup and Restore tab for SQL Server instances</li>
                                    </ul>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Grow>
                }
                {job == "Hcr" &&
                    <Grow in={job == "Hcr"} {...(job == "Hcr" ? { timeout: 750 } : {})}>
                        <Card border="light" style={{ width: '40rem' }}>
                            <Card.Header>HCR Lab</Card.Header>
                            <Card.Body>
                                <Card.Title>Stretch Robot</Card.Title>
                                <ul className={styles.list}>
                                    <br></br>
                                    <li className={styles.listItem}>Collaborated with Hello Robot researchers to develop and deploy an improved interface for the Stretch Robot,
                                        enhancing client independence by reducing task completion time by over 80%</li>

                                    <li className={styles.listItem}>Co-authoring the paper “Inquiries during Programming by Demonstration to Reduce User Burden” to facilitate
                                        easier control of the robot for individuals with motor impairments</li>
                                </ul>
                            </Card.Body>
                            <motion.div
                                animate={{ x: [200, 300, 200] }}  // Move 30px to the right and back
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <img src={robot} height={100} width={100} />
                            </motion.div>
                        </Card>
                    </Grow>
                }
                {job == "Cledge" &&
                    <Grow in={job == "Cledge"} {...(job == "Cledge" ? { timeout: 750 } : {})}>
                        <Card border="light" style={{ width: '40rem' }}>
                            <Card.Header>Cledge</Card.Header>
                            <Card.Body>
                                <Card.Title>Full Stack Developer</Card.Title>
                                <Card.Text>
                                    <ul className={styles.list}>
                                        <br></br>
                                        <li className={styles.listItem}>Spearheaded the development of key features for our accessible college counseling platform, resulting in a successful demonstration at the 2023 Dempsey competition and securing a $25,000 grantfor our start-up</li>
                                        <br></br>
                                        <li className={styles.listItem}>Enhanced our platform's experience for our 100+ users with Next.js, REST API and Azure Cosmo DB</li>
                                    </ul>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Grow>
                }
                {job == "Codeninjas" &&
                    <Grow in={job == "Codeninjas"} {...(job == "Codeninjas" ? { timeout: 750 } : {})}>
                        <Card border="light" style={{ width: '40rem' }}>
                            <Card.Header>Lead Instructor</Card.Header>
                            <Card.Body>
                                <Card.Title>Code Ninjas</Card.Title>
                                <Card.Text>
                                    <ul className={styles.list}>
                                        <br></br>
                                        <li className={styles.listItem}>Taught the game development process to over 100 different students through platforms ranging from scratch to the Unity game engine where students created complex games to eventually publish them on the appstore and itch.io</li>
                                        <br></br>
                                    </ul>
                                </Card.Text>
                                <motion.div
                                    animate={{
                                        x: [200, 300, 200],
                                        y: [0, -50, 0], // Moves up, then down
                                    }}
                                    transition={{
                                        duration: 1,
                                        repeat: Infinity,
                                        repeatType: "loop",
                                    }}
                                >
                                    <img src={ninja} width={100} height={100} />
                                </motion.div>
                            </Card.Body>
                        </Card>
                    </Grow>
                }
            </Stack>
        </div>

    );
}

export default Experience