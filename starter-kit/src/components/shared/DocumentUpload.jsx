'use client'

// React Imports
import { useState, useRef, useCallback } from 'react'

// MUI Imports
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction'
import LinearProgress from '@mui/material/LinearProgress'
import Divider from '@mui/material/Divider'
import Alert from '@mui/material/Alert'

// Third-party Imports
import classnames from 'classnames'

/**
 * DocumentUpload Component
 *
 * A reusable document upload component with drag-and-drop, file preview,
 * and document management capabilities.
 *
 * @param {Function} onUpload - Callback when files are uploaded (files) => Promise
 * @param {Function} onDelete - Callback when a file is deleted (fileId) => Promise
 * @param {Function} onDownload - Callback when a file is downloaded (fileId) => void
 * @param {Array} existingFiles - Array of existing files with format: [{ id, name, url, type, size, uploadedAt }]
 * @param {Array} acceptedFileTypes - Accepted file MIME types (e.g., ['application/pdf', 'image/*'])
 * @param {Number} maxFileSize - Maximum file size in bytes (default: 10MB)
 * @param {Boolean} multiple - Allow multiple file uploads
 * @param {String} className - Additional CSS classes
 */
const DocumentUpload = ({
  onUpload,
  onDelete,
  onDownload,
  existingFiles = [],
  acceptedFileTypes = ['application/pdf', 'image/*', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  maxFileSize = 10 * 1024 * 1024, // 10MB
  multiple = true,
  className
}) => {
  // States
  const [files, setFiles] = useState(existingFiles)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState(null)

  // Refs
  const fileInputRef = useRef(null)

  // Get file icon based on type
  const getFileIcon = (fileType) => {
    if (!fileType) return 'ri-file-line'

    if (fileType.startsWith('image/')) return 'ri-image-line'
    if (fileType.includes('pdf')) return 'ri-file-pdf-line'
    if (fileType.includes('word') || fileType.includes('document')) return 'ri-file-word-line'
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return 'ri-file-excel-line'
    if (fileType.includes('powerpoint') || fileType.includes('presentation')) return 'ri-file-ppt-line'
    if (fileType.includes('zip') || fileType.includes('compressed')) return 'ri-file-zip-line'

    return 'ri-file-line'
  }

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown size'
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  // Validate file
  const validateFile = (file) => {
    // Check file size
    if (file.size > maxFileSize) {
      return `File size exceeds maximum allowed size of ${formatFileSize(maxFileSize)}`
    }

    // Check file type if acceptedFileTypes is specified
    if (acceptedFileTypes && acceptedFileTypes.length > 0) {
      const isAccepted = acceptedFileTypes.some(type => {
        if (type.endsWith('/*')) {
          return file.type.startsWith(type.replace('/*', ''))
        }

        
return file.type === type
      })

      if (!isAccepted) {
        return `File type ${file.type} is not accepted`
      }
    }

    return null
  }

  // Handle file upload
  const handleFileUpload = useCallback(async (fileList) => {
    setError(null)
    const newFiles = Array.from(fileList)

    // Validate all files first
    for (const file of newFiles) {
      const validationError = validateFile(file)

      if (validationError) {
        setError(validationError)
        
return
      }
    }

    if (onUpload) {
      try {
        setUploading(true)
        setUploadProgress(0)

        // Simulate upload progress (replace with actual upload logic)
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval)
              
return 90
            }

            
return prev + 10
          })
        }, 200)

        // Call the upload callback
        const uploadedFiles = await onUpload(newFiles)

        clearInterval(progressInterval)
        setUploadProgress(100)

        // Add uploaded files to the list
        if (uploadedFiles) {
          setFiles(prev => [...prev, ...uploadedFiles])
        }

        // Reset progress after a short delay
        setTimeout(() => {
          setUploadProgress(0)
          setUploading(false)
        }, 500)
      } catch (err) {
        setError(err.message || 'Upload failed')
        setUploading(false)
        setUploadProgress(0)
      }
    }
  }, [onUpload, maxFileSize, acceptedFileTypes])

  // Handle drag events
  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  // Handle drop
  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files)
    }
  }, [handleFileUpload])

  // Handle file input change
  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files)
    }
  }

  // Handle delete
  const handleDelete = async (fileId) => {
    if (onDelete) {
      try {
        await onDelete(fileId)
        setFiles(prev => prev.filter(f => f.id !== fileId))
      } catch (err) {
        setError(err.message || 'Delete failed')
      }
    }
  }

  // Handle download
  const handleDownload = (file) => {
    if (onDownload) {
      onDownload(file.id)
    } else if (file.url) {
      // Default download behavior
      const link = document.createElement('a')

      link.href = file.url
      link.download = file.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <Box className={classnames('flex flex-col gap-4', className)}>
      {/* Upload Area */}
      <Paper
        className={classnames(
          'border-2 border-dashed p-8 text-center cursor-pointer transition-colors',
          {
            'border-primary bg-primary/10': dragActive,
            'border-gray-300 hover:border-primary/50': !dragActive
          }
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={acceptedFileTypes.join(',')}
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
        />

        <Box className="flex flex-col items-center gap-2">
          <i className="ri-upload-cloud-2-line text-4xl text-textSecondary" />
          <Typography variant="h6" color="text.primary">
            {dragActive ? 'Drop files here' : 'Drag and drop files here'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            or click to browse
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {acceptedFileTypes.length > 0 && `Accepted: ${acceptedFileTypes.join(', ')} | `}
            Max size: {formatFileSize(maxFileSize)}
          </Typography>
        </Box>
      </Paper>

      {/* Upload Progress */}
      {uploading && (
        <Box className="w-full">
          <LinearProgress variant="determinate" value={uploadProgress} />
          <Typography variant="caption" color="text.secondary" className="mt-1">
            Uploading... {uploadProgress}%
          </Typography>
        </Box>
      )}

      {/* Error Alert */}
      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* File List */}
      {files.length > 0 && (
        <Paper className="overflow-hidden">
          <Box className="p-4">
            <Typography variant="h6">
              Uploaded Files ({files.length})
            </Typography>
          </Box>
          <Divider />
          <List>
            {files.map((file, index) => (
              <div key={file.id || index}>
                <ListItem>
                  <ListItemIcon>
                    <i className={classnames(getFileIcon(file.type), 'text-2xl')} />
                  </ListItemIcon>
                  <ListItemText
                    primary={file.name}
                    secondary={
                      <span>
                        {formatFileSize(file.size)}
                        {file.uploadedAt && ` • Uploaded ${new Date(file.uploadedAt).toLocaleDateString()}`}
                      </span>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="download"
                      onClick={() => handleDownload(file)}
                      className="me-2"
                    >
                      <i className="ri-download-line" />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDelete(file.id)}
                      color="error"
                    >
                      <i className="ri-delete-bin-line" />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < files.length - 1 && <Divider />}
              </div>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  )
}

export default DocumentUpload
