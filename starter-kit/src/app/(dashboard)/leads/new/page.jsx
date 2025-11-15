'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

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
  Alert,
  Snackbar
} from '@mui/material'

export default function NewLeadPage() {
  const router = useRouter()
  const [showSuccess, setShowSuccess] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState([])

  const [formData, setFormData] = useState({
    address: '',
    city: '',
    state: 'WA',
    zipCode: '',
    purchasePrice: '',
    listPrice: '',
    propertyType: 'Single Family',
    lotSize: '',
    agentName: '',
    agentEmail: '',
    agentPhone: '',
    agentCompany: '',
    notes: ''
  })

  const [errors, setErrors] = useState({})

  const handleSubmit = e => {
    e.preventDefault()

    // Basic validation
    const newErrors = {}

    if (!formData.address) newErrors.address = 'Address is required'
    if (!formData.city) newErrors.city = 'City is required'
    if (!formData.zipCode) newErrors.zipCode = 'Zip code is required'
    if (!formData.purchasePrice) newErrors.purchasePrice = 'Purchase price is required'
    if (!formData.agentName) newErrors.agentName = 'Agent name is required'
    if (!formData.agentEmail) newErrors.agentEmail = 'Agent email is required'

    if (formData.agentEmail && !formData.agentEmail.includes('@')) {
      newErrors.agentEmail = 'Valid email is required'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      
return
    }

    // Handle form submission
    console.log('Form submitted:', formData)
    console.log('Files:', selectedFiles)
    setShowSuccess(true)

    setTimeout(() => {
      router.push('/leads')
    }, 1500)
  }

  const handleChange = field => e => {
    setFormData({ ...formData, [field]: e.target.value })


    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' })
    }
  }

  const handleFileChange = e => {
    const files = Array.from(e.target.files || [])

    setSelectedFiles(prev => [...prev, ...files])
  }

  const removeFile = index => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div>
      {/* Success Message */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" onClose={() => setShowSuccess(false)}>
          Lead submitted successfully! Redirecting...
        </Alert>
      </Snackbar>

      {/* Page Header */}
      <Box className="mb-6">
        <Box className="flex items-center gap-2 mb-2">
          <Button
            variant="text"
            size="small"
            startIcon={<i className="ri-arrow-left-line" />}
            onClick={() => router.back()}
          >
            Back to Leads
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
                      error={!!errors.address}
                      helperText={errors.address}
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
                      error={!!errors.city}
                      helperText={errors.city}
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
                      error={!!errors.zipCode}
                      helperText={errors.zipCode}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Purchase Price"
                      placeholder="2500000"
                      value={formData.purchasePrice}
                      onChange={handleChange('purchasePrice')}
                      error={!!errors.purchasePrice}
                      helperText={errors.purchasePrice}
                      required
                      InputProps={{
                        startAdornment: <span className="mr-2">$</span>
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="List Price"
                      placeholder="2750000"
                      value={formData.listPrice}
                      onChange={handleChange('listPrice')}
                      InputProps={{
                        startAdornment: <span className="mr-2">$</span>
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Property Type</InputLabel>
                      <Select
                        value={formData.propertyType}
                        onChange={handleChange('propertyType')}
                        label="Property Type"
                      >
                        <MenuItem value="Single Family">Single Family</MenuItem>
                        <MenuItem value="Multi-Family">Multi-Family</MenuItem>
                        <MenuItem value="Townhome">Townhome</MenuItem>
                        <MenuItem value="Condo">Condo</MenuItem>
                        <MenuItem value="Land">Land</MenuItem>
                        <MenuItem value="Commercial">Commercial</MenuItem>
                      </Select>
                    </FormControl>
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
                  Agent Contact Information
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Agent Name"
                      placeholder="John Doe"
                      value={formData.agentName}
                      onChange={handleChange('agentName')}
                      error={!!errors.agentName}
                      helperText={errors.agentName}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Company"
                      placeholder="Premier Realty"
                      value={formData.agentCompany}
                      onChange={handleChange('agentCompany')}
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
                      error={!!errors.agentEmail}
                      helperText={errors.agentEmail}
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

            <Card className="mt-4">
              <CardContent>
                <Typography variant="h6" className="font-semibold mb-4">
                  Attachments
                </Typography>
                <Typography variant="body2" color="text.secondary" className="mb-3">
                  Upload photos, documents, or any supporting materials
                </Typography>
                <Box className="mb-3">
                  <Button variant="outlined" component="label" startIcon={<i className="ri-upload-line" />}>
                    Choose Files
                    <input type="file" hidden multiple onChange={handleFileChange} accept="image/*,.pdf,.doc,.docx" />
                  </Button>
                </Box>
                {selectedFiles.length > 0 && (
                  <Box className="space-y-2">
                    {selectedFiles.map((file, index) => (
                      <Box
                        key={index}
                        className="flex items-center justify-between p-3 border border-gray-300 rounded"
                      >
                        <Box className="flex items-center gap-2">
                          <i className="ri-file-line text-xl text-gray-500" />
                          <Box>
                            <Typography variant="body2">{file.name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {(file.size / 1024).toFixed(1)} KB
                            </Typography>
                          </Box>
                        </Box>
                        <Button size="small" color="error" onClick={() => removeFile(index)}>
                          <i className="ri-close-line" />
                        </Button>
                      </Box>
                    ))}
                  </Box>
                )}
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
                    <Box component="ul" className="text-sm space-y-1 pl-4">
                      <li>Lead is automatically assigned to acquisitions team</li>
                      <li>You will receive a confirmation email</li>
                      <li>Initial review within 24 hours</li>
                      <li>Status updates via email notifications</li>
                    </Box>
                  </Box>
                  <Divider />
                  <Box>
                    <Typography variant="body2" className="font-medium mb-2">
                      Required Information
                    </Typography>
                    <Box component="ul" className="text-sm space-y-1 pl-4">
                      <li>Property address and location details</li>
                      <li>Purchase and list price</li>
                      <li>Agent contact information</li>
                    </Box>
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
                  <Divider />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Active Leads This Month
                    </Typography>
                    <Typography variant="h6" className="font-bold">
                      47
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Form Actions */}
        <Box className="flex justify-end gap-3 mt-6">
          <Button variant="outlined" onClick={() => router.back()} size="large">
            Cancel
          </Button>
          <Button type="submit" variant="contained" startIcon={<i className="ri-send-plane-line" />} size="large">
            Submit Lead
          </Button>
        </Box>
      </form>
    </div>
  )
}
