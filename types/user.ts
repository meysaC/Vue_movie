export interface User {
    id: string;
    userName: string;
    normalizedUserName: string;
    email: string | null;
    normalizedEmail: string | null;
    emailConfirmed: boolean;
    emailConfirmationToken?: string;
    passwordHash: string | null;
    securityStamp: string;
    concurrencyStamp: string; //??
    twoFactorEnabled: boolean;
    lockoutEnd?: string;
    lockoutEnabled: boolean;
    accessFailedCount: number;

    //kendi eklediklerimi de yazabilirim...
    // sentMessages?: number;
    // receivedMessages?: number;
}

export interface SimpleUser {
    id: string;
    userName: string;
    email: string | null;
}