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
import Ace from './Pictures/ace.png'
import ListItemButton from '@mui/material/ListItemButton';

import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';

import Grow from '@mui/material/Grow';


const Experience = () => {
    const[job, setJob] = React.useState("Microsoft1");
    return (
        <div>
            <Stack direction="row"
            divider={<Divider orientation="vertical" flexItem />}
            spacing={2}>
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                <ListItemButton onClick={() => setJob("Microsoft1")} selected={job == "Microsoft1"}>
                    <ListItemAvatar>
                        <Avatar variant='square' src={Msft}/>
                    </ListItemAvatar>
                    <ListItemText primary="Microsoft | SWE Intern" secondary="June 2024 - Sep. 2024" />
                </ListItemButton>
                <ListItemButton onClick={() => setJob("Blue")} selected={job == "Blue"}>
                    <ListItemAvatar>
                        <Avatar variant='square' src={Blue}/>
                    </ListItemAvatar>
                    <ListItemText primary="Blue Origin | SWE Intern" secondary="Sep. 2023 - Dec. 2023" />
                </ListItemButton>
                <ListItemButton onClick={() => setJob("Microsoft2")} selected={job == "Microsoft2"}>
                    <ListItemAvatar>
                        <Avatar variant='square' src={Msft}/>
                    </ListItemAvatar>
                    <ListItemText primary="Microsoft | SWE Intern" secondary="June 2023 - Sep. 2023" />
                </ListItemButton>
                <ListItemButton onClick={() => setJob("Hcr")} selected={job == "Hcr"}>
                    <ListItemAvatar>
                        <Avatar variant='square' src={hcr}/>
                    </ListItemAvatar>
                    <ListItemText primary="HCR Lab | Researcher" secondary="June 2022 - Present" />
                </ListItemButton>
                <ListItemButton onClick={() => setJob("Cledge")} selected={job == "Cledge"}>
                    <ListItemAvatar>
                        <Avatar variant='square' src={Cledge}/>
                    </ListItemAvatar>
                    <ListItemText primary="Cledge | Software Developer" secondary="Oct. 2022 - June 2023" />
                </ListItemButton>
                <ListItemButton onClick={() => setJob("Codeninjas")} selected={job == "Codeninjas"}>
                    <ListItemAvatar>
                        <Avatar variant='square' src={Codeninjas}/>
                    </ListItemAvatar>
                    <ListItemText primary="Code Ninjas | Lead Instructor" secondary="Aug. 2019 - July 2022" />
                </ListItemButton>
                </List>
                {job == "Microsoft1" &&
                <Grow in={job == "Microsoft1"} {...(job == "Microsoft1" ? { timeout: 750 } : {})}>
                    <Card border="light" style={{ width: '30rem' }}>
                        <Card.Header>Microsoft</Card.Header>
                        <Card.Body>
                        <Card.Title>Light Card Title</Card.Title>
                        <Card.Text>
                            Some quick example text to build on the card title and make up the
                            bulk of the card's content.
                        </Card.Text>
                        </Card.Body>
                    </Card>
                </Grow>
                }
                {job == "Blue" &&
                <Grow in={job == "Blue"} {...(job == "Blue" ? { timeout: 750 } : {})}>
                    <Card border="light" style={{ width: '30rem' }}>
                        <Card.Header>Blue Origin</Card.Header>
                        <Card.Body>
                        <Card.Title>Light Card Title</Card.Title>
                        <Card.Text>
                            Some quick example text to build on the card title and make up the
                            bulk of the card's content.
                        </Card.Text>
                        </Card.Body>
                    </Card>
                </Grow>
                }
                {job == "Microsoft2" &&
                <Grow in={job == "Microsoft2"} {...(job == "Microsoft2" ? { timeout: 750 } : {})}>
                    <Card border="light" style={{ width: '30rem' }}>
                        <Card.Header>Microsoft 2</Card.Header>
                        <Card.Body>
                        <Card.Title>Light Card Title</Card.Title>
                        <Card.Text>
                            Some quick example text to build on the card title and make up the
                            bulk of the card's content.
                        </Card.Text>
                        </Card.Body>
                    </Card>
                </Grow>
                }
                {job == "Hcr" &&
                <Grow in={job == "Hcr"} {...(job == "Hcr" ? { timeout: 750 } : {})}>
                    <Card border="light" style={{ width: '30rem' }}>
                        <Card.Header>HCR Lab</Card.Header>
                        <Card.Body>
                        <Card.Title>Light Card Title</Card.Title>
                        <Card.Text>
                            Some quick example text to build on the card title and make up the
                            bulk of the card's content.
                        </Card.Text>
                        </Card.Body>
                    </Card>
                </Grow>
                }
                {job == "Cledge" &&
                <Grow in={job == "Cledge"} {...(job == "Cledge" ? { timeout: 750 } : {})}>
                    <Card border="light" style={{ width: '30rem' }}>
                        <Card.Header>Cledge</Card.Header>
                        <Card.Body>
                        <Card.Title>Light Card Title</Card.Title>
                        <Card.Text>
                            Some quick example text to build on the card title and make up the
                            bulk of the card's content.
                        </Card.Text>
                        </Card.Body>
                    </Card>
                </Grow>
                }
                {job == "Codeninjas" &&
                <Grow in={job == "Codeninjas"} {...(job == "Codeninjas" ? { timeout: 750 } : {})}>
                    <Card border="light" style={{ width: '30rem' }}>
                        <Card.Header>Lead Instructor</Card.Header>
                        <Card.Body>
                        <Card.Title>Code Ninjas</Card.Title>
                        <Card.Text>
                            Some quick example text to build on the card title and make up the
                            bulk of the card's content.
                        </Card.Text>
                        </Card.Body>
                    </Card>
                </Grow>
                }
            </Stack>
        </div>
        
    );
}

export default Experience