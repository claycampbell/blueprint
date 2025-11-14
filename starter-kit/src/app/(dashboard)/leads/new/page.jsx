'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Alert
} from '@mui/material'
import { useRouter } from 'next/navigation'

export default function NewLeadPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    state: 'WA',
    zipCode: '',
    price: '',
    lotSize: '',
    agentName: '',
    agentEmail: '',
    agentPhone: '',
    notes: ''
  })

  const handleSubmit = e => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
    router.push('/leads')
  }

  const handleChange = field => e => {
    setFormData({ ...formData, [field]: e.target.value })
  }

  return (
    <div>
      {/* Page Header */}
      <Box className="mb-6">
        <Box className="flex items-center gap-2 mb-2">
          <Button
            variant="text"
            size="small"
            startIcon={<i className="ri-arrow-left-line" />}
            onClick={() => router.back()}
          >
            Back
          </Button>
        </Box>
        <Typography variant="h4" className="font-bold mb-2">
          Submit New Lead
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Enter property details and agent information
        </Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={4}>
          {/* Property Information */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" className="font-semibold mb-4">
                  Property Information
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Property Address"
                      placeholder="1234 Main Street"
                      value={formData.address}
                      onChange={handleChange('address')}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="City"
                      placeholder="Seattle"
                      value={formData.city}
                      onChange={handleChange('city')}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <FormControl fullWidth required>
                      <InputLabel>State</InputLabel>
                      <Select value={formData.state} onChange={handleChange('state')} label="State">
                        <MenuItem value="WA">Washington</MenuItem>
                        <MenuItem value="AZ">Arizona</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="Zip Code"
                      placeholder="98101"
                      value={formData.zipCode}
                      onChange={handleChange('zipCode')}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Asking Price"
                      placeholder="$2,500,000"
                      value={formData.price}
                      onChange={handleChange('price')}
                      required
                      InputProps={{
                        startAdornment: <span className="mr-2">$</span>
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Lot Size (sq ft)"
                      placeholder="10,000"
                      value={formData.lotSize}
                      onChange={handleChange('lotSize')}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Additional Notes"
                      placeholder="Any additional property details..."
                      value={formData.notes}
                      onChange={handleChange('notes')}
                      multiline
                      rows={4}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardContent>
                <Typography variant="h6" className="font-semibold mb-4">
                  Agent Information
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Agent Name"
                      placeholder="John Doe"
                      value={formData.agentName}
                      onChange={handleChange('agentName')}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Agent Email"
                      type="email"
                      placeholder="agent@realestate.com"
                      value={formData.agentEmail}
                      onChange={handleChange('agentEmail')}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Agent Phone"
                      placeholder="(206) 555-1234"
                      value={formData.agentPhone}
                      onChange={handleChange('agentPhone')}
                      required
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Sidebar - Tips */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" className="font-semibold mb-3">
                  Submission Tips
                </Typography>
                <Box className="space-y-3">
                  <Alert severity="info" className="text-sm">
                    <Typography variant="body2" className="font-medium mb-1">
                      AI Scoring
                    </Typography>
                    <Typography variant="caption">
                      Our AI will automatically score this lead based on location, price, and market conditions.
                    </Typography>
                  </Alert>
                  <Divider />
                  <Box>
                    <Typography variant="body2" className="font-medium mb-2">
                      What Happens Next?
                    </Typography>
                    <ul className="text-sm space-y-1 pl-4">
                      <li>Lead is automatically assigned to acquisitions team</li>
                      <li>You'll receive a confirmation email</li>
                      <li>Initial review within 24 hours</li>
                      <li>Status updates via email notifications</li>
                    </ul>
                  </Box>
                  <Divider />
                  <Box>
                    <Typography variant="body2" className="font-medium mb-2">
                      Required Documents
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      You can upload additional documents (photos, surveys, etc.) after submission.
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardContent>
                <Typography variant="h6" className="font-semibold mb-3">
                  Quick Stats
                </Typography>
                <Box className="space-y-3">
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Avg. Response Time
                    </Typography>
                    <Typography variant="h6" className="font-bold">
                      4 hours
                    </Typography>
                  </Box>
                  <Divider />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Approval Rate
                    </Typography>
                    <Typography variant="h6" className="font-bold">
                      68%
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Form Actions */}
        <Box className="flex justify-end gap-3 mt-6">
          <Button variant="outlined" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" startIcon={<i className="ri-send-plane-line" />}>
            Submit Lead
          </Button>
        </Box>
      </form>
    </div>
  )
}
