export interface ApiResponse<T = any> {
    success: boolean;
    code: number;
    data: T | null;
}

export const responseHandler = <T>(
    code: number, 
    data: T | null = null
): ApiResponse<T> => {
    return {
        success: code >= 200 && code < 300,
        code,
        data
    };
};
