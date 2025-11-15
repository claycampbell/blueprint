'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Timeline from '@mui/lab/Timeline'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import Chip from '@mui/material/Chip'

// Third-party Imports
import classnames from 'classnames'

/**
 * TimelineActivity Component
 *
 * A reusable timeline/activity feed component for displaying chronological events
 * with expandable details.
 *
 * @param {Array} activities - Array of activity objects with format:
 *   [{
 *     id: string,
 *     type: string,
 *     title: string,
 *     description: string,
 *     timestamp: Date|string,
 *     user: { name: string, avatar: string },
 *     details: string (optional),
 *     metadata: object (optional)
 *   }]
 * @param {String} variant - Timeline variant ('default', 'compact')
 * @param {Boolean} showOppositeContent - Show timestamps on opposite side
 * @param {Object} customEventIcons - Custom icon configuration for event types
 * @param {Object} customEventColors - Custom color configuration for event types
 * @param {String} className - Additional CSS classes
 */

// Default event type configurations
const DEFAULT_EVENT_ICONS = {
  created: 'ri-add-circle-line',
  updated: 'ri-edit-line',
  deleted: 'ri-delete-bin-line',
  comment: 'ri-chat-3-line',
  upload: 'ri-upload-line',
  download: 'ri-download-line',
  approved: 'ri-check-circle-line',
  rejected: 'ri-close-circle-line',
  submitted: 'ri-send-plane-line',
  assigned: 'ri-user-add-line',
  completed: 'ri-checkbox-circle-line',
  reminder: 'ri-alarm-line',
  email: 'ri-mail-line',
  call: 'ri-phone-line',
  meeting: 'ri-calendar-event-line',
  default: 'ri-information-line'
}

const DEFAULT_EVENT_COLORS = {
  created: 'success',
  updated: 'info',
  deleted: 'error',
  comment: 'primary',
  upload: 'info',
  download: 'default',
  approved: 'success',
  rejected: 'error',
  submitted: 'warning',
  assigned: 'primary',
  completed: 'success',
  reminder: 'warning',
  email: 'info',
  call: 'secondary',
  meeting: 'primary',
  default: 'default'
}

const TimelineActivity = ({
  activities = [],
  variant = 'default',
  showOppositeContent = true,
  customEventIcons = {},
  customEventColors = {},
  className
}) => {
  // States
  const [expandedItems, setExpandedItems] = useState({})

  // Merge custom configurations with defaults
  const eventIcons = { ...DEFAULT_EVENT_ICONS, ...customEventIcons }
  const eventColors = { ...DEFAULT_EVENT_COLORS, ...customEventColors }

  // Toggle expanded state
  const toggleExpanded = (activityId) => {
    setExpandedItems(prev => ({
      ...prev,
      [activityId]: !prev[activityId]
    }))
  }

  // Get icon for event type
  const getEventIcon = (type) => {
    return eventIcons[type] || eventIcons.default
  }

  // Get color for event type
  const getEventColor = (type) => {
    return eventColors[type] || eventColors.default
  }

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)

    // Less than a minute
    if (diffInSeconds < 60) {
      return 'Just now'
    }

    // Less than an hour
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)

      
return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`
    }

    // Less than a day
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)

      
return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
    }

    // Less than a week
    if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400)

      
return `${days} ${days === 1 ? 'day' : 'days'} ago`
    }

    // Show full date
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Render metadata chips
  const renderMetadata = (metadata) => {
    if (!metadata) return null

    return (
      <Box className="flex flex-wrap gap-2 mt-2">
        {Object.entries(metadata).map(([key, value]) => (
          <Chip
            key={key}
            label={`${key}: ${value}`}
            size="small"
            variant="outlined"
          />
        ))}
      </Box>
    )
  }

  if (activities.length === 0) {
    return (
      <Paper className={classnames('p-8 text-center', className)}>
        <i className="ri-history-line text-4xl text-textSecondary" />
        <Typography variant="body2" color="text.secondary" className="mt-2">
          No activity yet
        </Typography>
      </Paper>
    )
  }

  return (
    <Paper className={classnames('overflow-hidden', className)}>
      <Timeline position={showOppositeContent ? 'alternate' : 'right'}>
        {activities.map((activity, index) => {
          const isExpanded = expandedItems[activity.id]
          const hasDetails = Boolean(activity.details)
          const icon = getEventIcon(activity.type)
          const color = getEventColor(activity.type)

          return (
            <TimelineItem key={activity.id || index}>
              {showOppositeContent && (
                <TimelineOppositeContent color="text.secondary" className="py-4">
                  <Typography variant="caption">
                    {formatTimestamp(activity.timestamp)}
                  </Typography>
                </TimelineOppositeContent>
              )}

              <TimelineSeparator>
                <TimelineDot color={color}>
                  <i className={classnames(icon, 'text-lg')} />
                </TimelineDot>
                {index < activities.length - 1 && <TimelineConnector />}
              </TimelineSeparator>

              <TimelineContent className="py-4">
                <Paper elevation={3} className="p-4">
                  {/* Header */}
                  <Box className="flex items-start justify-between gap-2">
                    <Box className="flex items-center gap-2 flex-1">
                      {activity.user && (
                        <Avatar
                          src={activity.user.avatar}
                          alt={activity.user.name}
                          className="bs-8 is-8"
                        >
                          {activity.user.name?.charAt(0).toUpperCase()}
                        </Avatar>
                      )}
                      <Box className="flex-1">
                        <Typography variant="subtitle2" color="text.primary">
                          {activity.title}
                        </Typography>
                        {activity.user && (
                          <Typography variant="caption" color="text.secondary">
                            {activity.user.name}
                          </Typography>
                        )}
                      </Box>
                    </Box>

                    {hasDetails && (
                      <IconButton
                        size="small"
                        onClick={() => toggleExpanded(activity.id)}
                      >
                        <i
                          className={classnames(
                            isExpanded ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'
                          )}
                        />
                      </IconButton>
                    )}
                  </Box>

                  {/* Description */}
                  {activity.description && (
                    <Typography variant="body2" color="text.secondary" className="mt-2">
                      {activity.description}
                    </Typography>
                  )}

                  {/* Timestamp (shown inline if not using opposite content) */}
                  {!showOppositeContent && (
                    <Typography variant="caption" color="text.secondary" className="mt-2 block">
                      {formatTimestamp(activity.timestamp)}
                    </Typography>
                  )}

                  {/* Metadata */}
                  {activity.metadata && renderMetadata(activity.metadata)}

                  {/* Expandable Details */}
                  {hasDetails && (
                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                      <Box className="mt-3 pt-3 border-t">
                        <Typography variant="body2" color="text.primary">
                          {activity.details}
                        </Typography>
                      </Box>
                    </Collapse>
                  )}
                </Paper>
              </TimelineContent>
            </TimelineItem>
          )
        })}
      </Timeline>
    </Paper>
  )
}

export default TimelineActivity
