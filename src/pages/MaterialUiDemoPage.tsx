import { useMemo, useState } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Paper,
} from '@mui/material'
import { DataGrid, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid'
import { muiTheme } from '../theme/muiTheme'
import { dummyCompanies } from '../data/dummyCompanies'
import type { CompanyStatus } from '../types/company'

function statusColor(status: CompanyStatus): 'success' | 'default' | 'warning' {
  if (status === 'Active') return 'success'
  if (status === 'Draft') return 'warning'
  return 'default'
}

const columns: GridColDef[] = [
  { field: 'companyName', headerName: 'Company Name', flex: 1.4, minWidth: 160 },
  { field: 'companyCode', headerName: 'Code', width: 110 },
  { field: 'legalEntityType', headerName: 'Entity Type', width: 160 },
  { field: 'industry', headerName: 'Industry', width: 170 },
  {
    field: 'location',
    headerName: 'Location',
    width: 170,
    valueGetter: (_value, row) => `${row.city}, ${row.country}`,
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 130,
    renderCell: (params: GridRenderCellParams) => (
      <Chip label={params.value as string} color={statusColor(params.value as CompanyStatus)} size="small" variant="outlined" />
    ),
  },
  { field: 'createdAt', headerName: 'Created', width: 130 },
]

export default function MaterialUiDemoPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<CompanyStatus | 'All'>('All')

  const rows = useMemo(() => {
    return dummyCompanies
      .filter((c) => statusFilter === 'All' || c.status === statusFilter)
      .filter((c) => {
        const term = search.trim().toLowerCase()
        if (!term) return true
        return c.companyName.toLowerCase().includes(term) || c.companyCode.toLowerCase().includes(term)
      })
  }, [search, statusFilter])

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-sap-text">Company Directory (Material UI)</h2>
        <p className="text-sm text-sap-text-muted">
          Company Setup data rendered with MUI DataGrid and form components, inside the existing Tailwind layout.
        </p>
      </div>

      <ThemeProvider theme={muiTheme}>
        <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #332755', backgroundColor: '#1c1030' }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2.5 }}>
            <TextField
              size="small"
              label="Search companies"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ minWidth: 240 }}
            />
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel id="status-filter-label">Status</InputLabel>
              <Select
                labelId="status-filter-label"
                label="Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as CompanyStatus | 'All')}
              >
                <MenuItem value="All">All Statuses</MenuItem>
                <MenuItem value="Draft">Draft</MenuItem>
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
            pageSizeOptions={[5, 10]}
            disableRowSelectionOnClick
            autoHeight
            sx={{
              border: '1px solid #332755',
              borderRadius: 2,
              backgroundColor: '#1c1030',
            }}
          />
        </Paper>
      </ThemeProvider>

      <div className="rounded-xl border border-sap-border bg-sap-surface p-4 text-sm text-sap-text-muted">
        <p className="mb-1 font-semibold text-sap-text">MUI + Tailwind coexistence notes</p>
        <p>
          Both libraries work in the same project without conflict as long as MUI's <code>CssBaseline</code> component
          is not added globally - that component resets base HTML element styles the same way Tailwind's own preflight
          does, and applying both at once causes one to override the other unpredictably. Scoping the MUI
          <code>ThemeProvider</code> to just the components that need it (as done on this page) avoids that entirely:
          Tailwind continues to control page layout and spacing, MUI handles its own components' internal styling, and
          neither touches the other's DOM.
        </p>
      </div>
    </div>
  )
}
