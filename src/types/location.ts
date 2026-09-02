export type LocationStatus = 'Active' | 'Inactive'
export type LocationType = 'Office' | 'Plant' | 'Warehouse' | 'Store' | 'Campus'
export type WeekDay = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'

export interface Location {
  id: string
  name: string
  code: string
  companyId: string
  companyName: string
  branchId: string
  branchName: string
  businessUnitId: string
  businessUnitName: string
  departmentId: string
  departmentName: string
  locationType: LocationType
  locationManager: string
  contactEmail: string
  contactNumber: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  country: string
  postalCode: string
  latitude: string
  longitude: string
  timeZone: string
  workingCalendar: string
  weeklyHolidays: WeekDay[]
  maximumCapacity: string
  description: string
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
  companyId: string
  branchId: string
  businessUnitId: string
  departmentId: string
  locationType: LocationType
  locationManager: string
  contactEmail: string
  contactNumber: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  country: string
  postalCode: string
  latitude: string
  longitude: string
  timeZone: string
  workingCalendar: string
  weeklyHolidays: WeekDay[]
  maximumCapacity: string
  description: string
  status: LocationStatus
}

export interface UpdateLocationInput {
  name: string
  code: string
  companyId: string
  branchId: string
  businessUnitId: string
  departmentId: string
  locationType: LocationType
  locationManager: string
  contactEmail: string
  contactNumber: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  country: string
  postalCode: string
  latitude: string
  longitude: string
  timeZone: string
  workingCalendar: string
  weeklyHolidays: WeekDay[]
  maximumCapacity: string
  description: string
}

export const LOCATION_TYPE_OPTIONS: LocationType[] = ['Office', 'Plant', 'Warehouse', 'Store', 'Campus']
export const WEEK_DAY_OPTIONS: WeekDay[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
export const TIME_ZONE_OPTIONS = [
  'Asia/Kolkata',
  'America/New_York',
  'Europe/London',
  'Australia/Sydney',
  'Asia/Singapore',
] as const
export const WORKING_CALENDAR_OPTIONS = ['Standard 5-Day', '6-Day Working', '24x7 Operations'] as const
