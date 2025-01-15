import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import CastleIcon from '@mui/icons-material/Castle';
import CottageIcon from '@mui/icons-material/Cottage';
import HomeIcon from '@mui/icons-material/Home';
import { lightBlue } from '@mui/material/colors';
import pfp from '../Pictures/profilepic.jpeg';
import { animateScroll } from 'react-scroll';
import { Link } from "react-router-dom";

const pages = ['About', 'Resume', 'Projects', 'Random'];

const options = {
    // your options here, for example:
    duration: 500,
    smooth: true,
  };
  
function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  
  const goToLinkedin = (e) => {
    window.open('https://www.linkedin.com/in/johannes-joe-sluis-b8585b1b3/', '_blank')
  }

  const goToHome = (e) => {
    console.log("go hom")
    document.getElementById('root').scrollIntoView({ behavior: "smooth" }) 
  }

  const handleCloseNavMenu = (e, str) => {
    //window.location.href = '#resume-section'
    console.log(str)
    if (str == 'About') {
        document.getElementById('about').scrollIntoView({ block: 'end',  behavior: 'smooth' })
    } else {
        document.getElementById('resume-section').scrollIntoView({ block: 'end',  behavior: 'smooth' }) 
    }
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="absolute" color='inherit'>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Link to="/" style={{ textDecoration: 'none' }} >
            <IconButton onClick={goToHome}>
                <HomeIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, fontSize: 'large' }} />
            </IconButton>
          </Link>
          <Typography
            variant="h6"
            noWrap
            component="a"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'Helvetica',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
                <MenuItem onClick={ (e) => handleCloseNavMenu(e)}>
                    <Typography sx={{ textAlign: 'center' }}>About</Typography>
                </MenuItem>
                <MenuItem onClick={ (e) => handleCloseNavMenu(e)}>
                    <Typography sx={{ textAlign: 'center' }}>Resume</Typography>
                </MenuItem>
                <MenuItem onClick={ (e) => handleCloseNavMenu(e)}>
                    <Typography sx={{ textAlign: 'center' }}>Random</Typography>
                </MenuItem>
            </Menu>
          </Box>
          <CastleIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'Helvetica',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            LOGO
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            
              <Button
                onClick={ (e) => handleCloseNavMenu(e)}
                sx={{ my: 2,
                      color: 'black',
                      display: 'block',
                      fontFamily: "Helvetica",
                      textTransform: 'none',
                      fontSize: 20,}}
              >
                About
              </Button>

              <Button
                onClick={ (e) => handleCloseNavMenu(e)}
                sx={{ my: 2,
                      color: 'black',
                      display: 'block',
                      fontFamily: "Helvetica",
                      textTransform: 'none',
                      fontSize: 20,}}
              >
                Resume
              </Button>

              <Button
                onClick={ (e) => handleCloseNavMenu(e)}
                sx={{ my: 2,
                      color: 'black',
                      display: 'block',
                      fontFamily: "Helvetica",
                      textTransform: 'none',
                      fontSize: 20,}}
              >
                Projects
              </Button>
             
            <Link to="/Random" style={{ textDecoration: 'none' }} >
                <Button
                    sx={{ my: 2,
                        color: 'black',
                        display: 'block',
                        fontFamily: "Helvetica",
                        textTransform: 'none',
                        fontSize: 20,}}
                >
                    Random
                </Button>
            </Link>
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                {/* <Avatar sx={{ bgcolor: lightBlue[500] }}>JS</Avatar> */}
                <Avatar src={pfp}></Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
                <MenuItem onClick={goToLinkedin}>
                    <Typography sx={{ textAlign: 'center' }}>Linkedin</Typography>
                </MenuItem>
                <MenuItem>
                    <Typography sx={{ textAlign: 'center' }}>206-317-9976</Typography>
                </MenuItem>
                <MenuItem>
                    <Typography sx={{ textAlign: 'center' }}>jsluis@cs.washington.edu</Typography>
                </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar