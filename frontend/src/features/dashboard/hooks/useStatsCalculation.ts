import { useMemo } from 'react';
import { useContextsQuery } from './useContextsQuery';
import { useAttributesQuery } from './useAttributesQuery';
import { usePrivacyMatrixQuery } from './usePrivacyMatrixQuery';

export interface DashboardStats {
  activeContexts: {
    current: number;
    change: number;
    trend: string;
  };
  profileAttributes: {
    current: number;
    change: number;
    trend: string;
  };
  hiddenFields: {
    current: number;
    total: number;
    percentage: number;
  };
  privacyScore: {
    score: number;
    level: 'Excellent' | 'Good' | 'Fair' | 'Poor';
    color: 'emerald' | 'blue' | 'yellow' | 'red';
  };
}

export const useStatsCalculation = (): {
  stats: DashboardStats;
  isLoading: boolean;
  error: string | null;
} => {
  const { data: contexts, isLoading: contextsLoading, error: contextsError } = useContextsQuery();
  const { data: attributes, isLoading: attributesLoading, error: attributesError } = useAttributesQuery();
  const { data: matrixData, isLoading: matrixLoading, error: matrixError } = usePrivacyMatrixQuery();

  const isLoading = contextsLoading || attributesLoading || matrixLoading;
  const error = contextsError?.message || attributesError?.message || matrixError?.message || null;

  const stats = useMemo((): DashboardStats => {
    // Default values when data is not available
    const defaultStats: DashboardStats = {
      activeContexts: { current: 0, change: 0, trend: "No data" },
      profileAttributes: { current: 0, change: 0, trend: "No data" },
      hiddenFields: { current: 0, total: 0, percentage: 0 },
      privacyScore: { score: 100, level: 'Excellent', color: 'blue' }
    };

    

    if (!contexts || !attributes?.length || !matrixData) {
      return defaultStats;
    }

    // Get current month boundaries
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-11
    
    // Start of current month (e.g., August 1st 00:00:00)
    const monthStart = new Date(currentYear, currentMonth, 1, 0, 0, 0, 0);
    // End of current month (e.g., August 31st 23:59:59)
    const monthEnd = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999);

    // Calculate active contexts
    const activeContextsCount = contexts.length;
    const contextsCreatedThisMonth = contexts.filter(context => {
      const createdAt = new Date(context.created_at);
      const isInCurrentMonth = createdAt >= monthStart && createdAt <= monthEnd;
      
      return isInCurrentMonth;
    }).length;

    // Calculate profile attributes
    const profileAttributesCount = attributes.length;
    const attributesCreatedThisMonth = attributes.filter(attribute => {
      const createdAt = new Date(attribute.created_at);
      const isInCurrentMonth = createdAt >= monthStart && createdAt <= monthEnd;
      
      // Debug logging (remove in production)
      console.log('Attribute:', attribute.name, {
        createdAt: createdAt.toISOString(),
        monthStart: monthStart.toISOString(),
        monthEnd: monthEnd.toISOString(),
        isInCurrentMonth
      });
      
      return isInCurrentMonth;
    }).length;

    // Calculate total possible fields and active fields
    const totalPossibleFields = activeContextsCount * profileAttributesCount;
    
    // Count active fields from the privacy matrix
    let activeFields = 0;
    if (matrixData.matrix) {
      matrixData.matrix.forEach(row => {
        Object.values(row.contexts).forEach(isActive => {
          if (isActive) activeFields++;
        });
      });
    }

    const hiddenFields = totalPossibleFields - activeFields;
    const hiddenFieldsPercentage = totalPossibleFields > 0 ? (hiddenFields / totalPossibleFields) * 100 : 0;

    // Calculate privacy score
    // Privacy score = (hidden fields / total possible fields) * 100
    const privacyScore = hiddenFieldsPercentage;
    
    let privacyLevel: 'Excellent' | 'Good' | 'Fair' | 'Poor' = 'Poor';
    let privacyColor: 'emerald' | 'blue' | 'yellow' | 'red' = 'red';

    if (privacyScore >= 80) {
      privacyLevel = 'Excellent';
      privacyColor = 'emerald';
    } else if (privacyScore >= 60) {
      privacyLevel = 'Good';
      privacyColor = 'blue';
    } else if (privacyScore >= 40) {
      privacyLevel = 'Fair';
      privacyColor = 'yellow';
    } else {
      privacyLevel = 'Poor';
      privacyColor = 'red';
    }

    // Generate trend text based on actual counts
    const contextTrend = contextsCreatedThisMonth > 0 
      ? `+${contextsCreatedThisMonth} this month`
      : contextsCreatedThisMonth === 0 
        ? "+0 this month" 
        : "No change";

    const attributeTrend = attributesCreatedThisMonth > 0 
      ? `+${attributesCreatedThisMonth} this month`
      : attributesCreatedThisMonth === 0 
        ? "+0 this month" 
        : "No change";

    return {
      activeContexts: {
        current: activeContextsCount,
        change: contextsCreatedThisMonth,
        trend: contextTrend
      },
      profileAttributes: {
        current: profileAttributesCount,
        change: attributesCreatedThisMonth,
        trend: attributeTrend
      },
      hiddenFields: {
        current: hiddenFields,
        total: totalPossibleFields,
        percentage: hiddenFieldsPercentage
      },
      privacyScore: {
        score: Math.round(privacyScore),
        level: privacyLevel,
        color: privacyColor
      }
    };
  }, [contexts, attributes, matrixData]);

  return {
    stats,
    isLoading,
    error
  };
};
