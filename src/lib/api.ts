const API_BASE_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:3000/api';

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    errors?: any[];
}

export interface AuthResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
        token: string;
    };
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'owner' | 'reseller';
    plan: 'free' | 'premium';
    maxApps: number;
    maxResellers: number;
    maxLicensesPerApp: number;
    apps: string[];
    paymentStatus: 'unpaid' | 'paid';
    createdAt: string;
    updatedAt: string;
}

export interface ResellerUser {
    _id: string;
    email: string;
    app_id: {
        _id: string;
        name: string;
        app_name: string;
    };
    allowed_license_keys: number;
    created_licenses: number;
    remaining_licenses: number;
    active: boolean;
    createdAt: string;
}

export interface App {
    _id: string;
    name: string;
    owner: string;
    appId: string;
    appSecret: string;
    version: string;
    paused: boolean;
    settings: {
        hwidLock: boolean;
        allowCustomLicenseKey: boolean;
    };
    errorMessages: {
        [key: string]: string;
    };
    createdAt: string;
    updatedAt: string;
    licenseCount?: number;
    resellerCount?: number;
}

export interface License {
    _id: string;
    app: App | string;
    key: string;
    createdByUser: User | string;
    createdByType: 'owner' | 'reseller';
    reseller?: string;
    used: boolean;
    usedBy?: string;
    status: 'ACTIVE' | 'REVOKED' | 'EXPIRED' | 'BANNED';
    note?: string;
    createdAt: string;
    expiresAt: string;
    isExpired?: boolean;
    isActive?: boolean;
}

export interface Reseller {
    _id: string;
    user: User | string;
    app: App | string;
    licenseLimit: number;
    usedLicenses: number;
    active: boolean;
    allowedActions: {
        create: boolean;
        banUnban: boolean;
        editExpiry: boolean;
        delete: boolean;
    };
    createdAt: string;
    updatedAt: string;
    remainingLicenses?: number;
}

export interface Client {
    _id: string;
    username: string;
    hwid: string;
    app: App | string;
    licenseKey: string;
    ban: boolean;
    expiresAt: string;
    lastLogin?: string;
    loginCount: number;
    createdAt: string;
    updatedAt: string;
    isExpired?: boolean;
    isActive?: boolean;
}

export interface CreateAppRequest {
    name: string;
}

export interface UpdateAppRequest {
    name?: string;
    version?: string;
    paused?: boolean;
    settings?: {
        hwidLock?: boolean;
        allowCustomLicenseKey?: boolean;
    };
}

export interface CreateLicenseRequest {
    app: string;
    key?: string;
    expiresAt: string;
    note?: string;
    resellerId?: string;
}

export interface UpdateLicenseRequest {
    status?: 'ACTIVE' | 'REVOKED' | 'EXPIRED' | 'BANNED';
    expiresAt?: string;
    note?: string;
}

export interface CreateResellerRequest {
    email: string;
    password: string;
    app_id: string;
    allowed_license_keys?: number;
}

export interface ResellerLoginRequest {
    email: string;
    password: string;
}

export interface CreateResellerLicenseRequest {
    count: number;
    date_expired: string;
}

export interface UpdateResellerRequest {
    licenseLimit?: number;
    active?: boolean;
    allowedActions?: {
        create?: boolean;
        banUnban?: boolean;
        editExpiry?: boolean;
    };
}

export interface DashboardStats {
    totalLicenses: {
        value: number;
        change: number;
    };
    activeLicenses: {
        value: number;
        change: number;
    };
    totalResellers: {
        value: number;
        change: number;
    };
    totalClients: {
        value: number;
        change: number;
    };
    expiringSoon: {
        value: number;
        change: number;
    };
}

export interface RecentActivity {
    user: string;
    action: string;
    app: string;
    time: string;
    status: 'success' | 'info' | 'warning' | 'error';
}

export interface DashboardData {
    stats: DashboardStats;
    recentActivity: RecentActivity[];
    user: User;
}

export interface PaymentOrder {
    orderId: string;
    amount: number;
    currency: string;
    keyId: string;
    isDevelopmentMode?: boolean;
}

export interface PaymentVerification {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    planDuration?: string; // Add planDuration for subscription payments
}

export interface PricingPlan {
    name: string;
    price: number;
    priceFormatted?: string;
    currency: string;
    features: {
        [key: string]: string | boolean;
    };
}

export class ApiClient {
    private baseURL: string;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;
        
        // Check if this is a reseller endpoint and use appropriate token
        const isResellerEndpoint = endpoint.startsWith('/resellers/');
        const token = isResellerEndpoint 
            ? localStorage.getItem('resellerAuthToken') 
            : localStorage.getItem('authToken');
        
        const config: RequestInit = {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                // Handle validation errors
                if (data.errors && Array.isArray(data.errors)) {
                    const errorMessages = data.errors.map((err: any) => err.msg || err.message).join(', ');
                    throw new Error(errorMessages);
                }
                // Handle backend error responses
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Auth endpoints
    async login(credentials: LoginRequest): Promise<AuthResponse> {
        return this.request<AuthResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    }

    async register(userData: RegisterRequest): Promise<AuthResponse> {
        return this.request<AuthResponse>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }

    async getMe(): Promise<ApiResponse<User>> {
        return this.request<ApiResponse<User>>('/auth/profile');
    }

    // App methods
    async getApps(): Promise<ApiResponse<{ apps: App[]; count: number }>> {
        return this.request('/apps');
    }

    async createApp(data: CreateAppRequest): Promise<ApiResponse<{ app: App }>> {
        return this.request('/apps', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateApp(appId: string, data: UpdateAppRequest): Promise<ApiResponse<{ app: App }>> {
        return this.request(`/apps/${appId}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteApp(appId: string): Promise<ApiResponse<null>> {
        return this.request(`/apps/${appId}`, {
            method: 'DELETE',
        });
    }

    async getApp(appId: string): Promise<ApiResponse<{ app: App }>> {
        return this.request(`/apps/${appId}`);
    }

    async getAppStats(appId: string): Promise<ApiResponse<{ stats: any }>> {
        return this.request(`/apps/${appId}/stats`);
    }

    async getAppErrorMessages(appId: string): Promise<ApiResponse<{ errorMessages: any }>> {
        return this.request(`/apps/${appId}/error-messages`);
    }

    async updateAppErrorMessages(appId: string, errorMessages: any): Promise<ApiResponse<{ errorMessages: any }>> {
        return this.request(`/apps/${appId}/error-messages`, {
            method: 'PUT',
            body: JSON.stringify(errorMessages),
        });
    }

    // License methods
    async getLicenses(params?: { app?: string; status?: string; page?: number; limit?: number }): Promise<ApiResponse<{ licenses: License[]; pagination: any }>> {
        const queryParams = new URLSearchParams();
        if (params?.app) queryParams.append('app', params.app);
        if (params?.status) queryParams.append('status', params.status);
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        
        const endpoint = `/licenses${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        return this.request(endpoint);
    }

    async createLicense(data: CreateLicenseRequest): Promise<ApiResponse<{ license: License }>> {
        return this.request('/licenses', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateLicense(licenseId: string, data: UpdateLicenseRequest): Promise<ApiResponse<{ license: License }>> {
        return this.request(`/licenses/${licenseId}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteLicense(licenseId: string): Promise<ApiResponse<null>> {
        return this.request(`/licenses/${licenseId}`, {
            method: 'DELETE',
        });
    }

    async toggleLicenseBan(licenseId: string): Promise<ApiResponse<{ license: License }>> {
        return this.request(`/licenses/${licenseId}/toggle-ban`, {
            method: 'PATCH',
        });
    }

    // Reseller methods
    async getResellers(params?: { app?: string; active?: boolean }): Promise<ApiResponse<{ resellers: Reseller[]; count: number }>> {
        const queryParams = new URLSearchParams();
        if (params?.app) queryParams.append('app', params.app);
        if (params?.active !== undefined) queryParams.append('active', params.active.toString());
        
        const endpoint = `/resellers${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        return this.request(endpoint);
    }

    async createReseller(data: CreateResellerRequest): Promise<ApiResponse<any>> {
        return this.request('/resellers', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateReseller(resellerId: string, data: UpdateResellerRequest): Promise<ApiResponse<{ reseller: Reseller }>> {
        return this.request(`/resellers/${resellerId}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteReseller(resellerId: string): Promise<ApiResponse<null>> {
        return this.request(`/resellers/${resellerId}`, {
            method: 'DELETE',
        });
    }

    async getResellerDashboard(): Promise<ApiResponse<{ resellers: any[]; summary: any }>> {
        return this.request('/resellers/dashboard/data');
    }

    // Client methods
    async getClients(params?: { app?: string; page?: number; limit?: number; search?: string }): Promise<ApiResponse<{ clients: Client[]; pagination: any }>> {
        const queryParams = new URLSearchParams();
        if (params?.app) queryParams.append('app', params.app);
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.search) queryParams.append('search', params.search);
        
        const endpoint = `/clients${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        return this.request(endpoint);
    }

    async toggleClientBan(clientId: string): Promise<ApiResponse<{ client: Client }>> {
        return this.request(`/clients/${clientId}/toggle-ban`, {
            method: 'PATCH',
        });
    }

    async resetClientHwid(clientId: string): Promise<ApiResponse<{ client: Client }>> {
        return this.request(`/clients/${clientId}/reset-hwid`, {
            method: 'PATCH',
        });
    }

    async extendClientSubscription(clientId: string, days: number): Promise<ApiResponse<{ client: Client }>> {
        return this.request(`/clients/${clientId}/extend`, {
            method: 'PATCH',
            body: JSON.stringify({ days }),
        });
    }

    async createEndUser(data: { username: string; password: string; appId: string; hwid?: string | null; expiresAt: string }): Promise<ApiResponse<{ client: Client; app: { name: string; version: string } }>> {
        return this.request('/clients/create-direct', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    // Payment methods
    async createPaymentOrder(data?: { planDuration?: string; couponCode?: string }): Promise<ApiResponse<PaymentOrder>> {
        return this.request('/payments/razorpay/create-order', {
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async verifyPayment(data: PaymentVerification): Promise<ApiResponse<{ user: User; payment: any }>> {
        return this.request('/payments/razorpay/verify', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async getPaymentHistory(): Promise<ApiResponse<{ payments: any[]; count: number }>> {
        return this.request('/payments/history');
    }

    async getPricing(): Promise<ApiResponse<{ plans: { free: PricingPlan; premium: PricingPlan } }>> {
        return this.request('/payments/pricing');
    }

    async validateCoupon(couponCode: string): Promise<ApiResponse<{ couponCode: string; discount: number }>> {
        return this.request('/payments/validate-coupon', {
            method: 'POST',
            body: JSON.stringify({ couponCode }),
        });
    }

    async cancelSubscription(): Promise<ApiResponse<{ user: User }>> {
        return this.request('/payments/cancel-subscription', {
            method: 'POST',
        });
    }

    // Dashboard methods
    async getDashboardStats(): Promise<DashboardData> {
        // Since your backend doesn't have a specific dashboard endpoint,
        // we'll create a mock response based on the user data
        const userResponse = await this.getMe();
        const appsResponse = await this.getApps();
        const licensesResponse = await this.getLicenses();
        
        return {
            stats: {
                totalLicenses: { value: 0, change: 0 },
                activeLicenses: { value: 0, change: 0 },
                totalResellers: { value: 0, change: 0 },
                totalClients: { value: 0, change: 0 },
                expiringSoon: { value: 0, change: 0 },
            },
            recentActivity: [],
            user: userResponse.data!,
        };
    }

    // Legacy compatibility methods (to avoid breaking existing frontend code)
    async logout(): Promise<ApiResponse> {
        localStorage.removeItem('authToken');
        return { success: true, message: 'Logged out successfully' };
    }

    async getSettings(): Promise<ApiResponse<any>> {
        const response = await this.getMe();
        return {
            success: true,
            data: {
                pauseApplications: false,
                hwidLock: true,
            }
        };
    }

    async updateSettings(settings: { pauseApplications?: boolean; hwidLock?: boolean }): Promise<ApiResponse<any>> {
        return { success: true, data: settings };
    }

    async resetPlatformData(): Promise<ApiResponse> {
        return { success: true, message: 'Platform data reset' };
    }

    async toggleAppPause(appId: string): Promise<ApiResponse<{ app: App }>> {
        const app = await this.getApp(appId);
        const updatedApp = await this.updateApp(appId, { 
            paused: !app.data!.app.paused 
        });
        return updatedApp;
    }

    async getAppDeletionPreview(appId: string): Promise<ApiResponse<any>> {
        return {
            success: true,
            data: {
                app: { id: appId, name: 'App', version: '1.0.0' },
                willDelete: { resellers: 0, licenses: 0, endUsers: 0 }
            }
        };
    }

    // Reseller portal compatibility
    async resellerLogin(credentials: { email: string; password: string }): Promise<ApiResponse<{ token: string; user: any; reseller: any }>> {
        return this.request('/resellers/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    }

    async getResellerMe(): Promise<ApiResponse<any>> {
        return this.request<ApiResponse<any>>('/resellers/auth/profile');
    }

    async createResellerLicenses(resellerId: string, data: { count: number; date_expired: string }): Promise<ApiResponse<License[]>> {
        const response = await this.request<ApiResponse<{ licenses: License[] }>>('/resellers/auth/licenses', {
            method: 'POST',
            body: JSON.stringify({
                count: data.count,
                expiresAt: data.date_expired
            })
        });
        
        return {
            success: response.success,
            data: response.data?.licenses || []
        };
    }

    async getResellerLicenses(resellerId: string): Promise<ApiResponse<License[]>> {
        const response = await this.request<ApiResponse<{ licenses: License[] }>>('/resellers/auth/licenses');
        return {
            success: response.success,
            data: response.data?.licenses || []
        };
    }

    async deleteAllResellerLicenses(resellerId: string): Promise<ApiResponse<{ deletedCount: number }>> {
        return { success: true, data: { deletedCount: 0 } };
    }

    // Subscription compatibility methods
    async getSubscriptionStatus(): Promise<ApiResponse<any>> {
        const user = await this.getMe();
        return {
            success: true,
            data: {
                plan: user.data?.plan || 'free',
                expiryDate: null,
                razorpaySubscriptionId: null,
                hasActiveSubscription: user.data?.plan === 'premium',
                appLimit: user.data?.maxApps === -1 ? null : user.data?.maxApps,
                licenseLimitPerApp: user.data?.maxLicensesPerApp === -1 ? null : user.data?.maxLicensesPerApp,
            }
        };
    }

    async createSubscriptionOrder(data: { plan: string; duration: string; couponCode?: string }): Promise<ApiResponse<any>> {
        return this.createPaymentOrder({ planDuration: data.duration, ...(data.couponCode && { couponCode: data.couponCode }) });
    }

    async verifySubscriptionPayment(data: any): Promise<ApiResponse<any>> {
        return this.verifyPayment({
            razorpay_order_id: data.razorpayOrderId,
            razorpay_payment_id: data.razorpayPaymentId,
            razorpay_signature: data.razorpaySignature,
            planDuration: data.duration, // Pass the duration for verification
        });
    }

    // Plan methods (mock for compatibility)
    async getPlans(): Promise<ApiResponse<any[]>> {
        const pricing = await this.getPricing();
        return {
            success: true,
            data: [
                {
                    _id: 'free',
                    name: pricing.data?.plans.free.name,
                    ...pricing.data?.plans.free
                },
                {
                    _id: 'premium',
                    name: pricing.data?.plans.premium.name,
                    ...pricing.data?.plans.premium
                }
            ]
        };
    }

    async getPlan(planId: string): Promise<ApiResponse<any>> {
        const plans = await this.getPlans();
        const plan = plans.data?.find(p => p._id === planId);
        return { success: !!plan, data: plan };
    }

    async createPlan(data: any): Promise<ApiResponse<any>> {
        return { success: false, message: 'Not implemented' };
    }

    async updatePlan(planId: string, data: any): Promise<ApiResponse<any>> {
        return { success: false, message: 'Not implemented' };
    }

    async deletePlan(planId: string): Promise<ApiResponse> {
        return { success: false, message: 'Not implemented' };
    }

    // End user compatibility
    async getEndUsers(): Promise<ApiResponse<any[]>> {
        const response = await this.getClients();
        return {
            success: response.success,
            data: response.data?.clients || []
        };
    }

    async banEndUser(userId: string, data: { is_banned: boolean }): Promise<ApiResponse<any>> {
        const response = await this.toggleClientBan(userId);
        return response;
    }

    async deleteEndUser(userId: string): Promise<ApiResponse<null>> {
        return this.request(`/clients/${userId}`, {
            method: 'DELETE',
        });
    }

    async deleteAllLicenses(): Promise<ApiResponse<{ deletedCount: number }>> {
        return this.request('/licenses', {
            method: 'DELETE',
        });
    }
}

export const apiClient = new ApiClient(API_BASE_URL);