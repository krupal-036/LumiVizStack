export interface ApiResponse<T = any> {
  code: number;
  data: T | null;
}

export const responseHandler = <T>(code: number, data: T | null = null): ApiResponse<T> => {
  return {
    code,
    data,
  };
};
