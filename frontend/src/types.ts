
export interface UserSummaryDto {
    userId: number;
    name: string;
    totalDeposit: number;
    totalMeal: number;
    mealCost: number;
    balance: number;
}

export interface SummaryDto {
    totalMembers: number;
    totalDeposit: number;
    totalMeal: number;
    totalCost: number;
    mealRate: number;
    userSummaries: UserSummaryDto[];
}
