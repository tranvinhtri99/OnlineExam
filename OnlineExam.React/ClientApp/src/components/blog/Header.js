import * as React from 'react';
import PropTypes from 'prop-types';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { AuthContext } from '../../contexts/AuthContext';
import { useContext } from 'react'
import { useHistory } from 'react-router-dom';

function Header(props) {
  const { sections, title } = props;
  const { authState: { user: { name, type } }, logoutUser } = useContext(AuthContext)
  const history = useHistory()

  const logout = () => logoutUser()

  if (type == 'Student') {
    return (
      <React.Fragment>
        <Toolbar sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Link>
            <Button size="small">Subscribe</Button>
          </Link>
          <Typography
            component="h2"
            variant="h5"
            color="inherit"
            align="center"
            noWrap
            sx={{ flex: 1 }}
          >
            {title}
          </Typography>
          <IconButton>
            {name}
          </IconButton>
          <Link to='/login'>
            <Button variant="outlined" size="small" onClick={logout}>
              Sign out
            </Button>
          </Link>
        </Toolbar>
        <Toolbar
          component="nav"
          variant="dense"
          sx={{ justifyContent: 'space-between', overflowX: 'auto' }}
        >
          {sections.map((section) => (
            <Link
              color="inherit"
              noWrap
              key={section.title}
              variant="body2"
              href={section.url}
              sx={{ p: 1, flexShrink: 0 }}
            >
              {section.title}
            </Link>
          ))}
        </Toolbar>
      </React.Fragment>
    );
  }
  else {
    return (
      <React.Fragment>
        <Toolbar sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Link>
            <Button size="small">Subscribe</Button>
          </Link>
          <Typography
            component="h2"
            variant="h5"
            color="inherit"
            align="center"
            noWrap
            sx={{ flex: 1 }}
          >
            {title}
          </Typography>
          <IconButton>
            {name}
          </IconButton>
          <Link to='/login'>
            <Button variant="outlined" size="small" onClick={logout}>
              Sign out
            </Button>
          </Link>
        </Toolbar>
        <Toolbar
          component="nav"
          variant="dense"
          sx={{ justifyContent: 'space-between', overflowX: 'auto' }}
        >
          <Link
            color="inherit"
            noWrap
            key='Home'
            variant="body2"
            onClick={() => history.push("/home")}
            sx={{ p: 1, flexShrink: 0 }}
          >
            HOME
          </Link>
          <Link
            color="inherit"
            noWrap
            key='CHANGE PASSWORD'
            variant="body2"
            onClick={() => history.push("/updatepass")}
            sx={{ p: 1, flexShrink: 0 }}
          >
            CHANGE PASSWORD
          </Link>
          <Link
            color="inherit"
            noWrap
            key='Dashboard'
            variant="body2"
            onClick={() => history.push("/dashboard")}
            sx={{ p: 1, flexShrink: 0 }}
          >
            DASHBOARD
          </Link>
        </Toolbar>
      </React.Fragment>
    );
  }
}

Header.propTypes = {
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }),
  ).isRequired,
  title: PropTypes.string.isRequired,
};

export default Header;