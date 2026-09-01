export type LocationStatus = 'Active' | 'Inactive'
export type LocationType = 'Head Office' | 'Regional Office' | 'Warehouse' | 'Retail Store' | 'Data Center' | 'Remote Site'

export interface Location {
  id: string
  name: string
  code: string
  branchId: string
  branchName: string
  locationType: LocationType
  address: string
  city: string
  state: string
  country: string
  postalCode: string
  latitude: string
  longitude: string
  status: LocationStatus
  createdAt: string
}

export interface LocationListResponse {
  data: Location[]
  total: number
  page: number
  pageSize: number
}

export interface LocationQueryParams {
  search?: string
  status?: LocationStatus | 'All'
  branchId?: string | 'All'
  locationType?: LocationType | 'All'
  sortBy?: 'name' | 'createdAt'
  sortDir?: 'asc' | 'desc'
  page?: number
  pageSize?: number
}

export interface CreateLocationInput {
  name: string
  code: string
  branchId: string
  locationType: LocationType
  address: string
  city: string
  state: string
  country: string
  postalCode: string
  latitude: string
  longitude: string
  status: LocationStatus
}

export interface UpdateLocationInput {
  name: string
  code: string
  branchId: string
  locationType: LocationType
  address: string
  city: string
  state: string
  country: string
  postalCode: string
  latitude: string
  longitude: string
}

export const LOCATION_TYPE_OPTIONS: LocationType[] = [
  'Head Office',
  'Regional Office',
  'Warehouse',
  'Retail Store',
  'Data Center',
  'Remote Site',
]
