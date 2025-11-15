'use client'

// React Imports
import { useState, useMemo } from 'react'

// MUI Imports
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TablePagination from '@mui/material/TablePagination'
import TableSortLabel from '@mui/material/TableSortLabel'
import Paper from '@mui/material/Paper'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

// Third-party Imports
import classnames from 'classnames'

/**
 * DataTable Component
 *
 * A reusable data table component with sorting, filtering, pagination, and row selection.
 *
 * @param {Array} columns - Column configuration array with format:
 *   [{ id: 'name', label: 'Name', sortable: true, filterable: true, renderCell: (value, row) => JSX }]
 * @param {Array} data - Data array to display
 * @param {Boolean} selectable - Enable row selection with checkboxes
 * @param {Function} onSelectionChange - Callback when selection changes (selectedIds) => void
 * @param {String} defaultSortBy - Default column to sort by
 * @param {String} defaultSortOrder - Default sort order ('asc' or 'desc')
 * @param {Number} defaultRowsPerPage - Default rows per page
 * @param {Array} rowsPerPageOptions - Options for rows per page dropdown
 * @param {String} className - Additional CSS classes
 */
const DataTable = ({
  columns = [],
  data = [],
  selectable = false,
  onSelectionChange,
  defaultSortBy = '',
  defaultSortOrder = 'asc',
  defaultRowsPerPage = 10,
  rowsPerPageOptions = [5, 10, 25, 50],
  className
}) => {
  // States
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage)
  const [orderBy, setOrderBy] = useState(defaultSortBy)
  const [order, setOrder] = useState(defaultSortOrder)
  const [selected, setSelected] = useState([])
  const [filters, setFilters] = useState({})

  // Handle sort request
  const handleRequestSort = (columnId) => {
    const isAsc = orderBy === columnId && order === 'asc'

    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(columnId)
  }

  // Handle select all click
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = filteredAndSortedData.map((row, index) => row.id || index)

      setSelected(newSelected)
      onSelectionChange && onSelectionChange(newSelected)
    } else {
      setSelected([])
      onSelectionChange && onSelectionChange([])
    }
  }

  // Handle row click
  const handleRowClick = (event, id) => {
    const selectedIndex = selected.indexOf(id)
    let newSelected = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      )
    }

    setSelected(newSelected)
    onSelectionChange && onSelectionChange(newSelected)
  }

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  // Handle filter change
  const handleFilterChange = (columnId, value) => {
    setFilters(prev => ({
      ...prev,
      [columnId]: value
    }))
    setPage(0) // Reset to first page when filtering
  }

  // Check if row is selected
  const isSelected = (id) => selected.indexOf(id) !== -1

  // Sort and filter data
  const filteredAndSortedData = useMemo(() => {
    let processedData = [...data]

    // Apply filters
    Object.keys(filters).forEach(columnId => {
      const filterValue = filters[columnId]

      if (filterValue) {
        processedData = processedData.filter(row => {
          const cellValue = row[columnId]

          if (cellValue === null || cellValue === undefined) return false
          
return String(cellValue).toLowerCase().includes(String(filterValue).toLowerCase())
        })
      }
    })

    // Apply sorting
    if (orderBy) {
      processedData.sort((a, b) => {
        const aValue = a[orderBy]
        const bValue = b[orderBy]

        // Handle null/undefined values
        if (aValue === null || aValue === undefined) return 1
        if (bValue === null || bValue === undefined) return -1

        // Compare values
        let comparison = 0

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          comparison = aValue.toLowerCase().localeCompare(bValue.toLowerCase())
        } else if (typeof aValue === 'number' && typeof bValue === 'number') {
          comparison = aValue - bValue
        } else {
          comparison = String(aValue).localeCompare(String(bValue))
        }

        return order === 'desc' ? -comparison : comparison
      })
    }

    return processedData
  }, [data, filters, orderBy, order])

  // Paginated data
  const paginatedData = useMemo(() => {
    return filteredAndSortedData.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    )
  }, [filteredAndSortedData, page, rowsPerPage])

  // Calculate selection state
  const numSelected = selected.length
  const rowCount = filteredAndSortedData.length

  return (
    <Paper className={classnames('overflow-hidden', className)}>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            {/* Filter row */}
            {columns.some(col => col.filterable) && (
              <TableRow>
                {selectable && <TableCell />}
                {columns.map((column) => (
                  <TableCell key={`filter-${column.id}`}>
                    {column.filterable && (
                      <TextField
                        size="small"
                        placeholder={`Filter ${column.label}`}
                        value={filters[column.id] || ''}
                        onChange={(e) => handleFilterChange(column.id, e.target.value)}
                        fullWidth
                      />
                    )}
                  </TableCell>
                ))}
              </TableRow>
            )}
            {/* Header row */}
            <TableRow>
              {selectable && (
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    indeterminate={numSelected > 0 && numSelected < rowCount}
                    checked={rowCount > 0 && numSelected === rowCount}
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
              )}
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || 'left'}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.sortable !== false ? (
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
                      onClick={() => handleRequestSort(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (selectable ? 1 : 0)} align="center">
                  <Box className="py-8">
                    <Typography variant="body2" color="text.secondary">
                      No data available
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, index) => {
                const rowId = row.id || index
                const isItemSelected = isSelected(rowId)

                return (
                  <TableRow
                    hover
                    key={rowId}
                    selected={isItemSelected}
                    onClick={selectable ? (event) => handleRowClick(event, rowId) : undefined}
                    className={selectable ? 'cursor-pointer' : ''}
                  >
                    {selectable && (
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                        />
                      </TableCell>
                    )}
                    {columns.map((column) => {
                      const value = row[column.id]

                      
return (
                        <TableCell key={column.id} align={column.align || 'left'}>
                          {column.renderCell ? column.renderCell(value, row) : value}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={rowsPerPageOptions}
        component="div"
        count={filteredAndSortedData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  )
}

export default DataTable
