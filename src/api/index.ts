import { request } from '@/utils/Request'
import type {
  ApiResponse,
  PageResult,
  SecurityUser,
  UserRecordDTO,
  UserQueryDTO,
  CreateUserDTO,
  UpdateUserDTO,
  LoginDTO,
  LoginResponseDTO,
  LaborProjectRecordDTO,
  CreateLaborProjectDTO,
  UpdateLaborProjectDTO,
  AllocateLaborRequestDTO,
  BatchAllocateLaborResultDTO,
  LaborAllocationLogRecordDTO,
  LaborAllocationLogQueryDTO,
} from '@/types/api'

// ==================== 用户相关API ====================

/**
 * 查询用户列表
 */
export const getUserList = (data: UserQueryDTO) => {
  return request.post<ApiResponse<PageResult<UserRecordDTO>>>('/users/query', data)
}

/**
 * 创建用户
 */
export const createUser = (data: CreateUserDTO) => {
  return request.post<ApiResponse<number>>('/users/create', data)
}

/**
 * 更新用户
 */
export const updateUser = (data: UpdateUserDTO) => {
  return request.put<ApiResponse<void>>('/users/update', data)
}

/**
 * 删除用户（逻辑删除）
 */
export const deleteUser = (id: number) => {
  return request.post<ApiResponse<void>>(`/users/${id}`)
}

// ==================== 登录相关API ====================

/**
 * 用户登录
 */
export const login = (data: LoginDTO) => {
  return request.post<ApiResponse<LoginResponseDTO>>('/login', data)
}

/**
 * 获取当前用户信息
 */
export const getCurrentUser = () => {
  return request.get<ApiResponse<SecurityUser>>('/test/current-user')
}

// ==================== 劳动项目相关API ====================

/**
 * 查询劳动项目列表
 */
export const getLaborProjectList = () => {
  return request.post<ApiResponse<LaborProjectRecordDTO[]>>('/labor-projects/query')
}

/**
 * 创建劳动项目
 */
export const createLaborProject = (data: CreateLaborProjectDTO) => {
  return request.post<ApiResponse<number>>('/labor-projects/create', data)
}

/**
 * 更新劳动项目
 */
export const updateLaborProject = (data: UpdateLaborProjectDTO) => {
  return request.put<ApiResponse<void>>('/labor-projects/update', data)
}

/**
 * 删除劳动项目
 */
export const deleteLaborProject = (id: number) => {
  return request.delete<ApiResponse<void>>(`/labor-projects/${id}`)
}

// ==================== 劳动分配相关API ====================

/**
 * 分配劳动
 */
export const allocateLabor = (data: AllocateLaborRequestDTO) => {
  return request.post<ApiResponse<BatchAllocateLaborResultDTO>>('/labor-allocations/allocate', data)
}

/**
 * 查询劳动分配日志列表
 */
export const getLaborAllocationLogs = (data: LaborAllocationLogQueryDTO) => {
  return request.post<ApiResponse<PageResult<LaborAllocationLogRecordDTO>>>('/labor-allocations/logs', data)
}
