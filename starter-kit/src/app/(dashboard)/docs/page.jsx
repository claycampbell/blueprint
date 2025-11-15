'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Tabs,
  Tab,
  Divider,
  Chip,
  Button,
  TextField,
  Alert,
  AlertTitle,
  Avatar,
  Badge,
  LinearProgress,
  CircularProgress,
  Switch,
  Checkbox,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  Slider,
  Rating,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Breadcrumbs,
  Link as MuiLink,
  Stepper,
  Step,
  StepLabel
} from '@mui/material'

// Component Imports
import { StatusBadge, DocumentUpload, TimelineActivity } from '@/components/shared'

const DocsPage = () => {
  const [tabValue, setTabValue] = useState(0)
  const [sliderValue, setSliderValue] = useState(30)
  const [ratingValue, setRatingValue] = useState(4)
  const [switchChecked, setSwitchChecked] = useState(true)
  const [checkboxChecked, setCheckboxChecked] = useState(true)
  const [radioValue, setRadioValue] = useState('option1')
  const [selectValue, setSelectValue] = useState('option1')
  const [expanded, setExpanded] = useState('panel1')
  const [openDialog, setOpenDialog] = useState(false)
  const [openSnackbar, setOpenSnackbar] = useState(false)

  const handleAccordionChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false)
  }

  const mockActivities = [
    {
      id: 1,
      type: 'created',
      title: 'New Lead Submitted',
      description: '1234 Maple Street, Seattle',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      user: { name: 'Sarah Johnson', avatar: 'SJ' }
    },
    {
      id: 2,
      type: 'approved',
      title: 'Loan Approved',
      description: '$2.4M Construction Loan',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      user: { name: 'Michael Chen', avatar: 'MC' }
    },
    {
      id: 3,
      type: 'submitted',
      title: 'Draw Request',
      description: 'Draw #4 - Foundation Complete',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      user: { name: 'Emily Rodriguez', avatar: 'ER' }
    }
  ]

  return (
    <Grid container spacing={6}>
      {/* Header */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Box display='flex' alignItems='center' justifyContent='space-between' mb={2}>
              <Box>
                <Typography variant='h4' gutterBottom>
                  Component Documentation
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Reference library of all available MUI and custom components
                </Typography>
              </Box>
              <Chip label='Material-UI v6' color='primary' />
            </Box>
            <Breadcrumbs aria-label='breadcrumb'>
              <MuiLink color='inherit' href='/home'>
                Home
              </MuiLink>
              <Typography color='text.primary'>Documentation</Typography>
            </Breadcrumbs>
          </CardContent>
        </Card>
      </Grid>

      {/* Tabs Navigation */}
      <Grid item xs={12}>
        <Card>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} variant='scrollable' scrollButtons='auto'>
            <Tab label='Basics' />
            <Tab label='Forms' />
            <Tab label='Data Display' />
            <Tab label='Feedback' />
            <Tab label='Navigation' />
            <Tab label='Custom Components' />
          </Tabs>
        </Card>
      </Grid>

      {/* Tab 0: Basics */}
      {tabValue === 0 && (
        <>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant='h5' gutterBottom>
                  Typography
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant='h1' gutterBottom>h1. Heading</Typography>
                    <Typography variant='h2' gutterBottom>h2. Heading</Typography>
                    <Typography variant='h3' gutterBottom>h3. Heading</Typography>
                    <Typography variant='h4' gutterBottom>h4. Heading</Typography>
                    <Typography variant='h5' gutterBottom>h5. Heading</Typography>
                    <Typography variant='h6' gutterBottom>h6. Heading</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant='subtitle1' gutterBottom>subtitle1. Lorem ipsum dolor sit amet</Typography>
                    <Typography variant='subtitle2' gutterBottom>subtitle2. Lorem ipsum dolor sit amet</Typography>
                    <Typography variant='body1' gutterBottom>body1. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Typography>
                    <Typography variant='body2' gutterBottom>body2. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Typography>
                    <Typography variant='caption' display='block' gutterBottom>caption text</Typography>
                    <Typography variant='overline' display='block'>overline text</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant='h5' gutterBottom>
                  Buttons
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant='subtitle2' gutterBottom>Contained Buttons</Typography>
                    <Box display='flex' gap={2} flexWrap='wrap'>
                      <Button variant='contained'>Primary</Button>
                      <Button variant='contained' color='secondary'>Secondary</Button>
                      <Button variant='contained' color='success'>Success</Button>
                      <Button variant='contained' color='error'>Error</Button>
                      <Button variant='contained' color='warning'>Warning</Button>
                      <Button variant='contained' color='info'>Info</Button>
                      <Button variant='contained' disabled>Disabled</Button>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant='subtitle2' gutterBottom>Outlined Buttons</Typography>
                    <Box display='flex' gap={2} flexWrap='wrap'>
                      <Button variant='outlined'>Primary</Button>
                      <Button variant='outlined' color='secondary'>Secondary</Button>
                      <Button variant='outlined' color='success'>Success</Button>
                      <Button variant='outlined' color='error'>Error</Button>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant='subtitle2' gutterBottom>Text Buttons</Typography>
                    <Box display='flex' gap={2} flexWrap='wrap'>
                      <Button>Primary</Button>
                      <Button color='secondary'>Secondary</Button>
                      <Button color='success'>Success</Button>
                      <Button color='error'>Error</Button>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant='subtitle2' gutterBottom>Icon Buttons</Typography>
                    <Box display='flex' gap={2} flexWrap='wrap' alignItems='center'>
                      <IconButton color='primary'><i className='ri-heart-line' /></IconButton>
                      <IconButton color='secondary'><i className='ri-star-line' /></IconButton>
                      <IconButton color='success'><i className='ri-check-line' /></IconButton>
                      <IconButton color='error'><i className='ri-delete-bin-line' /></IconButton>
                      <IconButton size='small'><i className='ri-edit-line' /></IconButton>
                      <IconButton size='large'><i className='ri-settings-line' /></IconButton>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant='h5' gutterBottom>
                  Chips & Badges
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant='subtitle2' gutterBottom>Chips</Typography>
                    <Box display='flex' gap={2} flexWrap='wrap'>
                      <Chip label='Default' />
                      <Chip label='Primary' color='primary' />
                      <Chip label='Secondary' color='secondary' />
                      <Chip label='Success' color='success' />
                      <Chip label='Error' color='error' />
                      <Chip label='Warning' color='warning' />
                      <Chip label='Info' color='info' />
                      <Chip label='Deletable' onDelete={() => {}} />
                      <Chip label='Clickable' onClick={() => {}} />
                      <Chip label='Small' size='small' color='primary' />
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant='subtitle2' gutterBottom>Badges</Typography>
                    <Box display='flex' gap={4} flexWrap='wrap' alignItems='center'>
                      <Badge badgeContent={4} color='primary'>
                        <i className='ri-mail-line' style={{ fontSize: '1.5rem' }} />
                      </Badge>
                      <Badge badgeContent={100} color='secondary'>
                        <i className='ri-notification-line' style={{ fontSize: '1.5rem' }} />
                      </Badge>
                      <Badge variant='dot' color='success'>
                        <Avatar>U</Avatar>
                      </Badge>
                      <Badge badgeContent='NEW' color='error'>
                        <i className='ri-shopping-cart-line' style={{ fontSize: '1.5rem' }} />
                      </Badge>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant='h5' gutterBottom>
                  Avatars
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Box display='flex' gap={3} flexWrap='wrap' alignItems='center'>
                  <Avatar>H</Avatar>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>U</Avatar>
                  <Avatar sx={{ bgcolor: 'secondary.main' }}>N</Avatar>
                  <Avatar src='/images/avatars/1.png' />
                  <Avatar sx={{ width: 56, height: 56 }}>LG</Avatar>
                  <Avatar sx={{ width: 24, height: 24 }}>SM</Avatar>
                  <Avatar variant='rounded'>R</Avatar>
                  <Avatar variant='square'>S</Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </>
      )}

      {/* Tab 1: Forms */}
      {tabValue === 1 && (
        <>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant='h5' gutterBottom>
                  Text Fields
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Box display='flex' flexDirection='column' gap={3}>
                  <TextField label='Standard' />
                  <TextField label='Filled' variant='filled' />
                  <TextField label='Outlined' variant='outlined' />
                  <TextField label='Required' required />
                  <TextField label='Disabled' disabled defaultValue='Disabled' />
                  <TextField label='Helper text' helperText='Some important text' />
                  <TextField label='Error' error helperText='Incorrect entry.' />
                  <TextField label='Multiline' multiline rows={4} />
                  <TextField label='With Icon' InputProps={{
                    startAdornment: <i className='ri-user-line' style={{ marginRight: 8 }} />
                  }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant='h5' gutterBottom>
                  Select & Autocomplete
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Box display='flex' flexDirection='column' gap={3}>
                  <FormControl fullWidth>
                    <FormLabel>Select Option</FormLabel>
                    <Select value={selectValue} onChange={(e) => setSelectValue(e.target.value)}>
                      <MenuItem value='option1'>Option 1</MenuItem>
                      <MenuItem value='option2'>Option 2</MenuItem>
                      <MenuItem value='option3'>Option 3</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <FormLabel>Multiple Select</FormLabel>
                    <Select multiple defaultValue={['option1']} renderValue={(selected) => selected.join(', ')}>
                      <MenuItem value='option1'>Option 1</MenuItem>
                      <MenuItem value='option2'>Option 2</MenuItem>
                      <MenuItem value='option3'>Option 3</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant='h5' gutterBottom>
                  Switches, Checkboxes & Radios
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={4}>
                  <Grid item xs={12} md={4}>
                    <Typography variant='subtitle2' gutterBottom>Switches</Typography>
                    <Box display='flex' flexDirection='column'>
                      <FormControlLabel control={<Switch checked={switchChecked} onChange={(e) => setSwitchChecked(e.target.checked)} />} label='Default' />
                      <FormControlLabel control={<Switch defaultChecked color='secondary' />} label='Secondary' />
                      <FormControlLabel control={<Switch defaultChecked color='success' />} label='Success' />
                      <FormControlLabel control={<Switch disabled />} label='Disabled' />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant='subtitle2' gutterBottom>Checkboxes</Typography>
                    <Box display='flex' flexDirection='column'>
                      <FormControlLabel control={<Checkbox checked={checkboxChecked} onChange={(e) => setCheckboxChecked(e.target.checked)} />} label='Default' />
                      <FormControlLabel control={<Checkbox defaultChecked color='secondary' />} label='Secondary' />
                      <FormControlLabel control={<Checkbox defaultChecked color='success' />} label='Success' />
                      <FormControlLabel control={<Checkbox disabled />} label='Disabled' />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant='subtitle2' gutterBottom>Radio Buttons</Typography>
                    <FormControl>
                      <RadioGroup value={radioValue} onChange={(e) => setRadioValue(e.target.value)}>
                        <FormControlLabel value='option1' control={<Radio />} label='Option 1' />
                        <FormControlLabel value='option2' control={<Radio />} label='Option 2' />
                        <FormControlLabel value='option3' control={<Radio />} label='Option 3' />
                        <FormControlLabel value='disabled' disabled control={<Radio />} label='Disabled' />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant='h5' gutterBottom>
                  Sliders
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Box display='flex' flexDirection='column' gap={4}>
                  <Box>
                    <Typography variant='body2' gutterBottom>Continuous slider</Typography>
                    <Slider value={sliderValue} onChange={(e, newValue) => setSliderValue(newValue)} />
                  </Box>
                  <Box>
                    <Typography variant='body2' gutterBottom>Discrete slider</Typography>
                    <Slider defaultValue={30} step={10} marks min={0} max={100} />
                  </Box>
                  <Box>
                    <Typography variant='body2' gutterBottom>Range slider</Typography>
                    <Slider defaultValue={[20, 37]} valueLabelDisplay='auto' />
                  </Box>
                  <Box>
                    <Typography variant='body2' gutterBottom>Small slider</Typography>
                    <Slider defaultValue={30} size='small' />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant='h5' gutterBottom>
                  Rating
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Box display='flex' flexDirection='column' gap={3}>
                  <Box>
                    <Typography variant='body2' gutterBottom>Controlled</Typography>
                    <Rating value={ratingValue} onChange={(e, newValue) => setRatingValue(newValue)} />
                  </Box>
                  <Box>
                    <Typography variant='body2' gutterBottom>Read only</Typography>
                    <Rating value={4} readOnly />
                  </Box>
                  <Box>
                    <Typography variant='body2' gutterBottom>Disabled</Typography>
                    <Rating value={2} disabled />
                  </Box>
                  <Box>
                    <Typography variant='body2' gutterBottom>Half precision</Typography>
                    <Rating value={2.5} precision={0.5} />
                  </Box>
                  <Box>
                    <Typography variant='body2' gutterBottom>Custom icon</Typography>
                    <Rating
                      icon={<i className='ri-heart-fill' />}
                      emptyIcon={<i className='ri-heart-line' />}
                      defaultValue={3}
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </>
      )}

      {/* Tab 2: Data Display */}
      {tabValue === 2 && (
        <>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant='h5' gutterBottom>
                  Tables
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align='right'>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>Sarah Johnson</TableCell>
                        <TableCell>Acquisitions Lead</TableCell>
                        <TableCell><Chip label='Active' color='success' size='small' /></TableCell>
                        <TableCell align='right'>
                          <IconButton size='small'><i className='ri-edit-line' /></IconButton>
                          <IconButton size='small'><i className='ri-delete-bin-line' /></IconButton>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Michael Chen</TableCell>
                        <TableCell>Loan Officer</TableCell>
                        <TableCell><Chip label='Active' color='success' size='small' /></TableCell>
                        <TableCell align='right'>
                          <IconButton size='small'><i className='ri-edit-line' /></IconButton>
                          <IconButton size='small'><i className='ri-delete-bin-line' /></IconButton>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Emily Rodriguez</TableCell>
                        <TableCell>Underwriter</TableCell>
                        <TableCell><Chip label='Inactive' color='default' size='small' /></TableCell>
                        <TableCell align='right'>
                          <IconButton size='small'><i className='ri-edit-line' /></IconButton>
                          <IconButton size='small'><i className='ri-delete-bin-line' /></IconButton>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant='h5' gutterBottom>
                  Lists
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant='subtitle2' gutterBottom>Simple List</Typography>
                    <List>
                      <ListItem>
                        <ListItemText primary='Single-line item' />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary='Single-line item' secondary='Secondary text' />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><i className='ri-check-line' /></ListItemIcon>
                        <ListItemText primary='With icon' />
                      </ListItem>
                    </List>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant='subtitle2' gutterBottom>Avatar List</Typography>
                    <List>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar>A</Avatar>
                        </ListItemAvatar>
                        <ListItemText primary='Alex Williams' secondary='Jan 9, 2024' />
                      </ListItem>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar>B</Avatar>
                        </ListItemAvatar>
                        <ListItemText primary='Brooklyn Simmons' secondary='Jan 8, 2024' />
                      </ListItem>
                    </List>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant='h5' gutterBottom>
                  Accordion
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Accordion expanded={expanded === 'panel1'} onChange={handleAccordionChange('panel1')}>
                  <AccordionSummary expandIcon={<i className='ri-arrow-down-s-line' />}>
                    <Typography>Accordion 1</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                      sit amet blandit leo lobortis eget.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                <Accordion expanded={expanded === 'panel2'} onChange={handleAccordionChange('panel2')}>
                  <AccordionSummary expandIcon={<i className='ri-arrow-down-s-line' />}>
                    <Typography>Accordion 2</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                      sit amet blandit leo lobortis eget.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                <Accordion expanded={expanded === 'panel3'} onChange={handleAccordionChange('panel3')}>
                  <AccordionSummary expandIcon={<i className='ri-arrow-down-s-line' />}>
                    <Typography>Accordion 3</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                      sit amet blandit leo lobortis eget.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </CardContent>
            </Card>
          </Grid>
        </>
      )}

      {/* Tab 3: Feedback */}
      {tabValue === 3 && (
        <>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant='h5' gutterBottom>
                  Alerts
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Box display='flex' flexDirection='column' gap={2}>
                  <Alert severity='success'>This is a success alert</Alert>
                  <Alert severity='info'>This is an info alert</Alert>
                  <Alert severity='warning'>This is a warning alert</Alert>
                  <Alert severity='error'>This is an error alert</Alert>
                  <Alert severity='success' variant='outlined'>Outlined success alert</Alert>
                  <Alert severity='info' variant='filled'>Filled info alert</Alert>
                  <Alert severity='warning' onClose={() => {}}>
                    <AlertTitle>Warning</AlertTitle>
                    This is a warning alert with title and close button
                  </Alert>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant='h5' gutterBottom>
                  Progress
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Box display='flex' flexDirection='column' gap={3}>
                  <Box>
                    <Typography variant='body2' gutterBottom>Linear Progress</Typography>
                    <LinearProgress />
                  </Box>
                  <Box>
                    <Typography variant='body2' gutterBottom>Determinate</Typography>
                    <LinearProgress variant='determinate' value={75} />
                  </Box>
                  <Box>
                    <Typography variant='body2' gutterBottom>Buffer</Typography>
                    <LinearProgress variant='buffer' value={60} valueBuffer={80} />
                  </Box>
                  <Box>
                    <Typography variant='body2' gutterBottom>Colors</Typography>
                    <LinearProgress color='secondary' sx={{ mb: 1 }} />
                    <LinearProgress color='success' sx={{ mb: 1 }} />
                    <LinearProgress color='warning' />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant='h5' gutterBottom>
                  Circular Progress
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Box display='flex' gap={4} flexWrap='wrap' alignItems='center'>
                  <CircularProgress />
                  <CircularProgress variant='determinate' value={75} />
                  <CircularProgress color='secondary' />
                  <CircularProgress color='success' />
                  <CircularProgress color='warning' />
                  <CircularProgress size={60} />
                  <CircularProgress size={20} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant='h5' gutterBottom>
                  Dialog & Snackbar
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Box display='flex' gap={2}>
                  <Button variant='contained' onClick={() => setOpenDialog(true)}>
                    Open Dialog
                  </Button>
                  <Button variant='contained' onClick={() => setOpenSnackbar(true)}>
                    Open Snackbar
                  </Button>
                </Box>

                <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                  <DialogTitle>Dialog Title</DialogTitle>
                  <DialogContent>
                    <Typography>
                      This is a dialog example. You can put any content here.
                    </Typography>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button variant='contained' onClick={() => setOpenDialog(false)}>Confirm</Button>
                  </DialogActions>
                </Dialog>

                <Snackbar
                  open={openSnackbar}
                  autoHideDuration={3000}
                  onClose={() => setOpenSnackbar(false)}
                  message='This is a snackbar message'
                />
              </CardContent>
            </Card>
          </Grid>
        </>
      )}

      {/* Tab 4: Navigation */}
      {tabValue === 4 && (
        <>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant='h5' gutterBottom>
                  Breadcrumbs
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Box display='flex' flexDirection='column' gap={2}>
                  <Breadcrumbs>
                    <MuiLink href='/'>Home</MuiLink>
                    <MuiLink href='/docs'>Documentation</MuiLink>
                    <Typography color='text.primary'>Current Page</Typography>
                  </Breadcrumbs>
                  <Breadcrumbs separator='›'>
                    <MuiLink href='/'>Home</MuiLink>
                    <MuiLink href='/docs'>Documentation</MuiLink>
                    <Typography color='text.primary'>Current Page</Typography>
                  </Breadcrumbs>
                  <Breadcrumbs separator={<i className='ri-arrow-right-s-line' />}>
                    <MuiLink href='/'>Home</MuiLink>
                    <MuiLink href='/docs'>Documentation</MuiLink>
                    <Typography color='text.primary'>Current Page</Typography>
                  </Breadcrumbs>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant='h5' gutterBottom>
                  Stepper
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Stepper activeStep={1}>
                  <Step>
                    <StepLabel>Select campaign settings</StepLabel>
                  </Step>
                  <Step>
                    <StepLabel>Create an ad group</StepLabel>
                  </Step>
                  <Step>
                    <StepLabel>Create an ad</StepLabel>
                  </Step>
                </Stepper>
              </CardContent>
            </Card>
          </Grid>
        </>
      )}

      {/* Tab 5: Custom Components */}
      {tabValue === 5 && (
        <>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant='h5' gutterBottom>
                  Status Badge
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Box display='flex' gap={2} flexWrap='wrap'>
                  <StatusBadge status='new' />
                  <StatusBadge status='active' />
                  <StatusBadge status='pending' />
                  <StatusBadge status='in-progress' />
                  <StatusBadge status='completed' />
                  <StatusBadge status='approved' />
                  <StatusBadge status='rejected' />
                  <StatusBadge status='passed' />
                  <StatusBadge status='failed' />
                  <StatusBadge status='on-hold' />
                  <StatusBadge status='cancelled' />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant='h5' gutterBottom>
                  Timeline Activity
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <TimelineActivity activities={mockActivities} maxItems={5} />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant='h5' gutterBottom>
                  Document Upload
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <DocumentUpload
                  accept='.pdf,.doc,.docx'
                  maxSize={10}
                  onUpload={(files) => console.log('Uploaded:', files)}
                />
              </CardContent>
            </Card>
          </Grid>
        </>
      )}
    </Grid>
  )
}

export default DocsPage
