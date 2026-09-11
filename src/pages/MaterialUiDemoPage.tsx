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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button as MuiButton,
  Typography,
  Divider,
} from '@mui/material'
import { DataGrid, type GridColDef, type GridRenderCellParams, type GridRowParams } from '@mui/x-data-grid'
import { muiTheme } from '../theme/muiTheme'
import { dummyCompanies } from '../data/dummyCompanies'
import type { Company, CompanyStatus } from '../types/company'

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

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.75 }}>
      <Typography variant="body2" sx={{ color: '#a29fb0' }}>{label}</Typography>
      <Typography variant="body2" sx={{ color: '#f1f0f5', fontWeight: 500 }}>{value || '-'}</Typography>
    </Box>
  )
}

export default function MaterialUiDemoPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<CompanyStatus | 'All'>('All')
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)

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
        <h2 className="text-xl font-semibold text-sap-text">Company Directory</h2>
        <p className="text-sm text-sap-text-muted">
          Company records with sortable, filterable data grid view.
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
            onRowClick={(params: GridRowParams) => setSelectedCompany(params.row as Company)}
            sx={{
              border: '1px solid #332755',
              borderRadius: 2,
              backgroundColor: '#1c1030',
              '& .MuiDataGrid-row': { cursor: 'pointer' },
            }}
          />
        </Paper>

        <Dialog
          open={Boolean(selectedCompany)}
          onClose={() => setSelectedCompany(null)}
          maxWidth="sm"
          fullWidth
          slotProps={{ paper: { sx: { backgroundColor: '#1c1030', border: '1px solid #332755', borderRadius: 3 } } }}
        >
          {selectedCompany && (
            <>
              <DialogTitle sx={{ color: '#f1f0f5', fontWeight: 700 }}>
                {selectedCompany.companyName}
                <Typography variant="body2" sx={{ color: '#a29fb0', mt: 0.5 }}>
                  {selectedCompany.legalCompanyName}
                </Typography>
              </DialogTitle>
              <DialogContent dividers sx={{ borderColor: '#332755' }}>
                <DetailRow label="Company Code" value={selectedCompany.companyCode} />
                <DetailRow label="Entity Type" value={selectedCompany.legalEntityType} />
                <DetailRow label="Industry" value={selectedCompany.industry} />
                <DetailRow label="Registration Number" value={selectedCompany.registrationNumber} />
                <DetailRow label="Tax ID" value={selectedCompany.taxId} />
                <Divider sx={{ my: 1.5, borderColor: '#332755' }} />
                <DetailRow label="Contact Person" value={selectedCompany.primaryContactPerson} />
                <DetailRow label="Email" value={selectedCompany.email} />
                <DetailRow label="Mobile" value={selectedCompany.mobile} />
                <DetailRow label="Website" value={selectedCompany.website} />
                <Divider sx={{ my: 1.5, borderColor: '#332755' }} />
                <DetailRow
                  label="Address"
                  value={`${selectedCompany.addressLine1}, ${selectedCompany.city}, ${selectedCompany.state}, ${selectedCompany.country}`}
                />
                <DetailRow label="Currency" value={selectedCompany.defaultCurrency} />
                <DetailRow label="Time Zone" value={selectedCompany.timeZone} />
              </DialogContent>
              <DialogActions>
                <MuiButton onClick={() => setSelectedCompany(null)}>Close</MuiButton>
              </DialogActions>
            </>
          )}
        </Dialog>
      </ThemeProvider>
    </div>
  )
}
