import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import LockIcon from '@mui/icons-material/Lock'
import EmailIcon from '@mui/icons-material/Email'
import { useAuth } from '../../../contexts/AuthContext'

export const Route = createFileRoute('/_authenticated/me/')({
  component: ProfilePage,
})

function ProfilePage() {
  const { userEmail } = useAuth()

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Profile
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle2" color="text.secondary">
          Email
        </Typography>
        <Typography variant="body1">{userEmail}</Typography>
      </Paper>

      <Typography variant="h6" gutterBottom>
        Settings
      </Typography>

      <Paper>
        <List>
          <ListItem disablePadding>
            <Link
              to="/me/password"
              style={{
                textDecoration: 'none',
                color: 'inherit',
                width: '100%',
              }}
            >
              <ListItemButton>
                <ListItemIcon>
                  <LockIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Change Password"
                  secondary="Update your account password"
                />
              </ListItemButton>
            </Link>
          </ListItem>
          <ListItem disablePadding>
            <Link
              to="/me/email"
              style={{
                textDecoration: 'none',
                color: 'inherit',
                width: '100%',
              }}
            >
              <ListItemButton>
                <ListItemIcon>
                  <EmailIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Change Email"
                  secondary="Update your email address"
                />
              </ListItemButton>
            </Link>
          </ListItem>
        </List>
      </Paper>
    </Box>
  )
}
