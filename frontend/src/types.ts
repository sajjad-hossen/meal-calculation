
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

export interface UserAccount {
    id: number;
    name: string;
    email: string | null;
    role: string;
    status: string;
    isCalculationMember: boolean;
}

export interface MessSummaryDto {
    id: number;
    name: string;
    uniqueCode: string;
    managerEmail: string | null;
    createdAt: string;
    memberCount: number;
    lastPaidMonth: string | null;
}

export interface AdminSummaryDto {
    totalMesses: number;
    totalMembers: number;
    messes: MessSummaryDto[];
}

export interface PaymentRequestDto {
    id: number;
    messId: number;
    messName: string;
    managerEmail: string;
    transactionId: string;
    note: string | null;
    status: string;
    createdAt: string;
}

export interface SystemSettingsDto {
    id: number;
    process: string | null;
    bkashNumber: string | null;
    nagadNumber: string | null;
    whatsappNumber: string | null;
}
