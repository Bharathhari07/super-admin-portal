import { dummyKpis, dummyHealth, dummyAnalytics, dummyActivities } from '../data/dummyDashboard'
import { simulateDelay } from './mockClient'
import type { DashboardKpis, PlatformHealth, DashboardAnalytics, RecentActivity } from '../types/dashboard'

// GET /api/dashboard/stats
export async function fetchDashboardKpis(): Promise<DashboardKpis> {
  return simulateDelay(dummyKpis)
}

// GET /api/dashboard/health
export async function fetchPlatformHealth(): Promise<PlatformHealth> {
  return simulateDelay(dummyHealth)
}

// GET /api/dashboard/analytics
export async function fetchDashboardAnalytics(): Promise<DashboardAnalytics> {
  return simulateDelay(dummyAnalytics)
}

// GET /api/dashboard/activities
export async function fetchRecentActivities(): Promise<RecentActivity[]> {
  return simulateDelay(dummyActivities)
}