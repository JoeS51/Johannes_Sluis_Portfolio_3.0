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
import HomeIcon from '@mui/icons-material/Home';
import { motion } from 'framer-motion';
import pfp from '../Pictures/profilepic.jpeg';
import { Link } from "react-router-dom";
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

const pages = ['About', 'Experience', 'Projects', 'Contact'];
const mobilePages = ['About', 'Experience', 'Projects'];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [activeSection, setActiveSection] = React.useState('home');

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
    document.getElementById('home').scrollIntoView({ behavior: "smooth" })
    setActiveSection('home');
  }

  const handleCloseNavMenu = (section) => {
    setAnchorElNav(null);

    if (section) {
      document.getElementById(section.toLowerCase()).scrollIntoView({ behavior: 'smooth' });
      setActiveSection(section.toLowerCase());
    }
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // Update active section based on scroll position
  React.useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100; // Adding offset for better detection

      // Get all sections
      const sections = ['home', 'about', 'experience', 'projects', 'contact'];

      // Find the current active section
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (page) => activeSection === page.toLowerCase();

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        background: 'var(--card-bg)',
        color: 'var(--text-color)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--divider-color)',
        transition: 'all 0.3s ease',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <IconButton onClick={goToHome} sx={{ color: 'var(--primary-color)' }}>
              <HomeIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, fontSize: 28 }} />
            </IconButton>
          </motion.div>

          <Typography
            variant="h6"
            noWrap
            component="a"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'Inter, sans-serif',
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: 'var(--text-color)',
              textDecoration: 'none',
            }}
          >
            Johannes Sluis
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              sx={{ color: 'var(--text-color)' }}
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
              onClose={() => handleCloseNavMenu()}
              sx={{
                display: { xs: 'block', md: 'none' },
                '& .MuiPaper-root': {
                  background: 'var(--card-bg)',
                  color: 'var(--text-color)',
                  boxShadow: 'var(--card-shadow)',
                },
              }}
            >
              {mobilePages.map((page) => (
                <MenuItem key={page} onClick={() => handleCloseNavMenu(page)}>
                  <Typography
                    sx={{
                      textAlign: 'center',
                      fontWeight: isActive(page) ? 'bold' : 'normal',
                      color: isActive(page) ? 'var(--primary-color)' : 'var(--text-color)'
                    }}
                  >
                    {page}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Typography
            variant="h5"
            noWrap
            component="a"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'Inter, sans-serif',
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: 'var(--text-color)',
              textDecoration: 'none',
            }}
          >
            JS
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
            {pages.map((page) => (
              <motion.div
                key={page}
                whileHover={{ y: -2 }}
                whileTap={{ y: 1 }}
              >
                <Button
                  onClick={() => handleCloseNavMenu(page)}
                  sx={{
                    my: 2,
                    mx: 1,
                    color: isActive(page) ? 'var(--primary-color)' : 'var(--text-color)',
                    display: 'block',
                    fontFamily: "Inter, sans-serif",
                    textTransform: 'none',
                    fontSize: 16,
                    fontWeight: isActive(page) ? 700 : 500,
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: '50%',
                      width: isActive(page) ? '80%' : '0%',
                      height: '2px',
                      backgroundColor: 'var(--primary-color)',
                      transition: 'all 0.3s ease',
                      transform: 'translateX(-50%)',
                    },
                    '&:hover::after': {
                      width: '80%',
                    },
                  }}
                >
                  {page}
                </Button>
              </motion.div>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Contact Info">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    src={pfp}
                    sx={{
                      border: '2px solid var(--primary-color)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  />
                </IconButton>
              </motion.div>
            </Tooltip>
            <Menu
              sx={{
                mt: '45px',
                '& .MuiPaper-root': {
                  background: 'var(--card-bg)',
                  color: 'var(--text-color)',
                  boxShadow: 'var(--card-shadow)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                },
              }}
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
              <MenuItem onClick={goToLinkedin} sx={{ gap: 1 }}>
                <LinkedInIcon sx={{ color: '#0072b1' }} />
                <Typography>LinkedIn</Typography>
              </MenuItem>
              <MenuItem sx={{ gap: 1 }}>
                <PhoneIcon sx={{ color: 'var(--primary-color)' }} />
                <Typography>206-317-9976</Typography>
              </MenuItem>
              <MenuItem sx={{ gap: 1 }}>
                <EmailIcon sx={{ color: 'var(--primary-color)' }} />
                <Typography>jsluis@cs.washington.edu</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar
