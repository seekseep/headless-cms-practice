import { useState } from 'react'
import { Link, Outlet, useNavigate } from '@tanstack/react-router'
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import CategoryIcon from '@mui/icons-material/Category'
import PersonIcon from '@mui/icons-material/Person'
import LogoutIcon from '@mui/icons-material/Logout'
import { useAuth } from '../contexts/AuthContext'

const DRAWER_WIDTH = 240

export function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { userEmail } = useAuth()
  const navigate = useNavigate()

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap>
          CMS 管理
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        <ListItem disablePadding>
          <Link
            to="/categories"
            style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}
          >
            <ListItemButton>
              <ListItemIcon>
                <CategoryIcon />
              </ListItemIcon>
              <ListItemText primary="カテゴリ" />
            </ListItemButton>
          </Link>
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <Link
            to="/me"
            style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}
          >
            <ListItemButton>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="プロフィール" />
            </ListItemButton>
          </Link>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate({ to: '/logout' })}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="ログアウト" />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { sm: `${DRAWER_WIDTH}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setMobileOpen(!mobileOpen)}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            CMS 管理
          </Typography>
          <Typography variant="body2">{userEmail}</Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  )
}
