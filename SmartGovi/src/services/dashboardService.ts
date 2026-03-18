import { transactionService } from './transactionService';
import { DashboardSummary, DateRange, DateRangeType } from '../types';
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subMonths,
  format,
} from 'date-fns';

class DashboardService {
  // Get date range based on filter type
  getDateRange(rangeType: DateRangeType, customStart?: Date, customEnd?: Date): DateRange {
    const now = new Date();
    
    switch (rangeType) {
      case 'today':
        return {
          startDate: startOfDay(now),
          endDate: endOfDay(now),
          label: 'Today',
        };
      
      case 'week':
        return {
          startDate: startOfWeek(now, { weekStartsOn: 1 }), // Monday
          endDate: endOfWeek(now, { weekStartsOn: 1 }),
          label: 'This Week',
        };
      
      case 'month':
        return {
          startDate: startOfMonth(now),
          endDate: endOfMonth(now),
          label: format(now, 'MMMM yyyy'),
        };
      
      case '3months':
        const threeMonthsAgo = subMonths(now, 3);
        return {
          startDate: startOfMonth(threeMonthsAgo),
          endDate: endOfMonth(now),
          label: `Last 3 Months (${format(threeMonthsAgo, 'MMM')} - ${format(now, 'MMM yyyy')})`,
        };
      
      case 'custom':
        if (customStart && customEnd) {
          return {
            startDate: startOfDay(customStart),
            endDate: endOfDay(customEnd),
            label: `${format(customStart, 'MMM d')} - ${format(customEnd, 'MMM d, yyyy')}`,
          };
        }
        // Fallback to month if custom dates not provided
        return this.getDateRange('month');
      
      default:
        return this.getDateRange('month');
    }
  }

  // Get dashboard data for a specific range
  async getDashboardData(
    userId: string,
    rangeType: DateRangeType,
    customStart?: Date,
    customEnd?: Date
  ): Promise<{
    summary: DashboardSummary;
    recentTransactions: any[];
    dateRange: DateRange;
  }> {
    try {
      const dateRange = this.getDateRange(rangeType, customStart, customEnd);
      
      // Get summary for the period
      const summary = await transactionService.getDashboardSummary(
        userId,
        dateRange.startDate,
        dateRange.endDate
      );

      // Get recent transactions (last 5)
      const recentTransactions = await transactionService.getRecentTransactions(userId, 5);

      return {
        summary,
        recentTransactions,
        dateRange,
      };
    } catch (error) {
      console.error('Error getting dashboard data:', error);
      throw error;
    }
  }

  // Format currency
  formatCurrency(amount: number): string {
    return `Rs ${amount.toLocaleString('en-LK')}`;
  }

  // Format date for display
  formatDate(date: Date): string {
    const today = startOfDay(new Date());
    const yesterday = startOfDay(new Date());
    yesterday.setDate(yesterday.getDate() - 1);

    if (startOfDay(date).getTime() === today.getTime()) {
      return 'Today';
    } else if (startOfDay(date).getTime() === yesterday.getTime()) {
      return 'Yesterday';
    } else {
      return format(date, 'MMM d, yyyy');
    }
  }
}

export const dashboardService = new DashboardService();