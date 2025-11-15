'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import Link from 'next/link'

// MUI Imports
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  Avatar,
  LinearProgress,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton
} from '@mui/material'

export default function HomePage() {
  // Mock user data
  const user = {
    name: 'Sarah Johnson',
    role: 'Acquisitions Lead',
    avatar: 'SJ'
  }

  // Quick stats
  const quickStats = [
    { label: 'My Active Leads', value: 12, icon: 'ri-user-search-line', color: 'primary', link: '/leads' },
    { label: 'Pending Reviews', value: 5, icon: 'ri-file-list-3-line', color: 'warning', link: '/feasibility' },
    { label: 'Active Loans', value: 23, icon: 'ri-money-dollar-circle-line', color: 'success', link: '/loans' },
    { label: 'Tasks Due Today', value: 8, icon: 'ri-task-line', color: 'error', link: '/dashboard' }
  ]

  // Recent activity
  const recentActivity = [
    {
      id: 1,
      type: 'lead',
      icon: 'ri-user-add-line',
      color: 'primary',
      title: 'New Lead Submitted',
      description: '1234 Maple Street, Seattle',
      time: '5 minutes ago',
      link: '/leads/1'
    },
    {
      id: 2,
      type: 'loan',
      icon: 'ri-check-line',
      color: 'success',
      title: 'Loan Approved',
      description: '5678 Oak Avenue - $2.4M',
      time: '1 hour ago',
      link: '/loans'
    },
    {
      id: 3,
      type: 'draw',
      icon: 'ri-money-dollar-box-line',
      color: 'info',
      title: 'Draw Request Submitted',
      description: 'Draw #4 - 789 Pine Road',
      time: '2 hours ago',
      link: '/servicing/draws'
    },
    {
      id: 4,
      type: 'entitlement',
      icon: 'ri-government-line',
      color: 'warning',
      title: 'Permit Submitted',
      description: '321 Cedar Lane - City of Bellevue',
      time: '3 hours ago',
      link: '/entitlement'
    },
    {
      id: 5,
      type: 'contact',
      icon: 'ri-contacts-line',
      color: 'secondary',
      title: 'New Builder Contact',
      description: 'Michael Chen - Pacific Builders LLC',
      time: '5 hours ago',
      link: '/contacts'
    }
  ]

  // Tasks pending
  const pendingTasks = [
    { id: 1, task: 'Review feasibility for 1234 Maple Street', priority: 'high', due: 'Today' },
    { id: 2, task: 'Call agent re: 5678 Oak Avenue', priority: 'medium', due: 'Today' },
    { id: 3, task: 'Approve draw request for 789 Pine Road', priority: 'high', due: 'Today' },
    { id: 4, task: 'Update proforma for 321 Cedar Lane', priority: 'medium', due: 'Tomorrow' },
    { id: 5, task: 'Schedule site visit for 456 Birch Street', priority: 'low', due: 'Tomorrow' }
  ]

  // Quick actions
  const quickActions = [
    { label: 'Submit New Lead', icon: 'ri-user-add-line', color: 'primary', link: '/leads/new' },
    { label: 'Create Loan', icon: 'ri-money-dollar-circle-line', color: 'success', link: '/loans' },
    { label: 'View Analytics', icon: 'ri-line-chart-line', color: 'info', link: '/analytics' },
    { label: 'Manage Contacts', icon: 'ri-contacts-line', color: 'secondary', link: '/contacts' }
  ]

  const getPriorityColor = priority => {
    switch (priority) {
      case 'high':
        return 'error'
      case 'medium':
        return 'warning'
      case 'low':
        return 'info'
      default:
        return 'default'
    }
  }

  return (
    <Grid container spacing={6}>
      {/* Welcome Header */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Box display='flex' justifyContent='space-between' alignItems='center' flexWrap='wrap' gap={4}>
              <Box display='flex' alignItems='center' gap={3}>
                <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main', fontSize: '1.5rem' }}>
                  {user.avatar}
                </Avatar>
                <Box>
                  <Typography variant='h4' sx={{ mb: 0.5 }}>
                    Welcome back, {user.name}!
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    {user.role} • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </Typography>
                </Box>
              </Box>
              <Box display='flex' gap={2}>
                <Button variant='outlined' startIcon={<i className='ri-notification-line' />}>
                  Notifications
                </Button>
                <Button variant='contained' startIcon={<i className='ri-settings-line' />}>
                  Settings
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Quick Stats */}
      {quickStats.map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Link href={stat.link} style={{ textDecoration: 'none' }}>
            <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 6 } }}>
              <CardContent>
                <Box display='flex' alignItems='center' justifyContent='space-between' mb={2}>
                  <Avatar sx={{ bgcolor: `${stat.color}.main`, width: 48, height: 48 }}>
                    <i className={stat.icon} style={{ fontSize: '1.5rem' }} />
                  </Avatar>
                  <Chip label={stat.value} color={stat.color} size='large' />
                </Box>
                <Typography variant='body2' color='text.secondary'>
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          </Link>
        </Grid>
      ))}

      {/* Quick Actions */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant='h6' sx={{ mb: 3 }}>
              Quick Actions
            </Typography>
            <Grid container spacing={3}>
              {quickActions.map((action, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Link href={action.link} style={{ textDecoration: 'none' }}>
                    <Button
                      variant='outlined'
                      color={action.color}
                      fullWidth
                      size='large'
                      startIcon={<i className={action.icon} />}
                      sx={{ height: '100%', py: 2 }}
                    >
                      {action.label}
                    </Button>
                  </Link>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Recent Activity */}
      <Grid item xs={12} md={7}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Box display='flex' justifyContent='space-between' alignItems='center' mb={3}>
              <Typography variant='h6'>Recent Activity</Typography>
              <Link href='/dashboard' style={{ textDecoration: 'none' }}>
                <Button size='small' endIcon={<i className='ri-arrow-right-line' />}>
                  View All
                </Button>
              </Link>
            </Box>
            <List>
              {recentActivity.map((activity, index) => (
                <Box key={activity.id}>
                  <ListItem
                    sx={{
                      px: 0,
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'action.hover' },
                      borderRadius: 1
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: `${activity.color}.main` }}>
                        <i className={activity.icon} />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={activity.title}
                      secondary={
                        <>
                          <Typography variant='body2' color='text.secondary' component='span' display='block'>
                            {activity.description}
                          </Typography>
                          <Typography variant='caption' color='text.disabled' component='span' display='block'>
                            {activity.time}
                          </Typography>
                        </>
                      }
                    />
                    <IconButton size='small'>
                      <i className='ri-arrow-right-s-line' />
                    </IconButton>
                  </ListItem>
                  {index < recentActivity.length - 1 && <Divider sx={{ my: 1 }} />}
                </Box>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>

      {/* Tasks Pending */}
      <Grid item xs={12} md={5}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Box display='flex' justifyContent='space-between' alignItems='center' mb={3}>
              <Typography variant='h6'>My Tasks</Typography>
              <Chip label={`${pendingTasks.length} Pending`} color='warning' size='small' />
            </Box>
            <List>
              {pendingTasks.map((task, index) => (
                <Box key={task.id}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary={task.task}
                      secondary={`Due: ${task.due}`}
                      secondaryTypographyProps={{
                        component: 'span',
                        variant: 'caption',
                        color: 'text.disabled',
                        sx: { display: 'block', mt: 0.5 }
                      }}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip label={task.priority} color={getPriorityColor(task.priority)} size='small' />
                      <IconButton size='small' color='success'>
                        <i className='ri-check-line' />
                      </IconButton>
                    </Box>
                  </ListItem>
                  {index < pendingTasks.length - 1 && <Divider sx={{ my: 1 }} />}
                </Box>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>

      {/* Performance Overview */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant='h6' sx={{ mb: 3 }}>
              My Performance This Month
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} md={3}>
                <Box>
                  <Typography variant='body2' color='text.secondary' gutterBottom>
                    Lead Conversion Rate
                  </Typography>
                  <Box display='flex' alignItems='center' gap={2}>
                    <Typography variant='h5'>34%</Typography>
                    <Chip label='+6%' color='success' size='small' />
                  </Box>
                  <LinearProgress variant='determinate' value={34} color='success' sx={{ mt: 2 }} />
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box>
                  <Typography variant='body2' color='text.secondary' gutterBottom>
                    Avg Review Time
                  </Typography>
                  <Box display='flex' alignItems='center' gap={2}>
                    <Typography variant='h5'>2.3 days</Typography>
                    <Chip label='-12%' color='success' size='small' />
                  </Box>
                  <LinearProgress variant='determinate' value={76} color='success' sx={{ mt: 2 }} />
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box>
                  <Typography variant='body2' color='text.secondary' gutterBottom>
                    Loans Funded
                  </Typography>
                  <Box display='flex' alignItems='center' gap={2}>
                    <Typography variant='h5'>18</Typography>
                    <Chip label='+3' color='success' size='small' />
                  </Box>
                  <LinearProgress variant='determinate' value={90} color='primary' sx={{ mt: 2 }} />
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box>
                  <Typography variant='body2' color='text.secondary' gutterBottom>
                    Customer Satisfaction
                  </Typography>
                  <Box display='flex' alignItems='center' gap={2}>
                    <Typography variant='h5'>4.8/5</Typography>
                    <Chip label='Excellent' color='success' size='small' />
                  </Box>
                  <LinearProgress variant='determinate' value={96} color='success' sx={{ mt: 2 }} />
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
