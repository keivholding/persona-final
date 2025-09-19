import { useMemo } from "react";
import { type PrivacyMatrixData } from "../../../types/privacyMatrix";

export interface ContextUIStats {
  totalAttributes: number;
  visibleAttributes: number;
  hiddenAttributes: number;
  visibilityPercentage: number;
  privacyScore: number; // 0-100, higher = more private (more hidden)
}

export const useContextStats = (matrixData: PrivacyMatrixData | null, contextId: string): ContextUIStats => {
  return useMemo(() => {
    if (!matrixData || !matrixData.matrix.length) {
      return {
        totalAttributes: 0,
        visibleAttributes: 0,
        hiddenAttributes: 0,
        visibilityPercentage: 0,
        privacyScore: 100, // If no data, assume fully private
      };
    }

    const totalAttributes = matrixData.matrix.length;
    const visibleAttributes = matrixData.matrix.filter(row => row.contexts[contextId] === true).length;
    const hiddenAttributes = totalAttributes - visibleAttributes;
    const visibilityPercentage = totalAttributes > 0 ? Math.round((visibleAttributes / totalAttributes) * 100) : 0;
    const privacyScore = totalAttributes > 0 ? Math.round((hiddenAttributes / totalAttributes) * 100) : 100;

    return {
      totalAttributes,
      visibleAttributes,
      hiddenAttributes,
      visibilityPercentage,
      privacyScore,
    };
  }, [matrixData, contextId]);
};
