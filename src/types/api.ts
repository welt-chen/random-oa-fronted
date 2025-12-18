// ==================== 通用响应类型 ====================
export interface ApiResponse<T = unknown> {
  status: number
  msg: string
  result: T
}

// ==================== 分页相关类型 ====================
export interface PageResult<T> {
  pageNum: number
  pageSize: number
  total: number
  totalPages: number
  records: T[]
}

// ==================== 用户相关类型 ====================

// 安全用户信息
export interface SecurityUser {
  uid: number
  username: string
  realName: string
  jobPosition: string
  laborValue: number
  injuryStatus: number
  birthDate: string
  employmentStatus: number
}

// 用户记录DTO
export interface UserRecordDTO {
  id: number
  realName: string
  gender: number
  birthDate: string
  jobPosition: string
  jobPositionName: string
  laborValue: number
  injuryStatus: number
  employmentStatus: number
  createTime: string
}

// 用户查询DTO
export interface UserQueryDTO {
  realName?: string
  jobPosition?: string
  employmentStatus?: number
  startBirthDate?: string
  endBirthDate?: string
  pageNum?: number
  pageSize?: number
}

// 创建用户DTO
export interface CreateUserDTO {
  realName: string
  gender: number
  birthDate: string
  jobPosition: string
  laborValue: number
  injuryStatus: number
}

// 更新用户DTO
export interface UpdateUserDTO {
  id: number
  realName: string
  birthDate: string
  laborValue: number
  injuryStatus: number
  jobPosition: string
}

// ==================== 登录相关类型 ====================

// 登录请求DTO
export interface LoginDTO {
  realName: string
  password: string
}

// 登录响应DTO
export interface LoginResponseDTO {
  token: string
  user: SecurityUser
}

// ==================== 劳动项目相关类型 ====================

// 劳动项目记录DTO
export interface LaborProjectRecordDTO {
  id: number
  projectName: string
  workDescription: string
  requiredLaborValue: number
  status: number
  createTime: string
  updateTime: string
}

// 创建劳动项目DTO
export interface CreateLaborProjectDTO {
  projectName: string
  workDescription: string
  requiredLaborValue: number
}

// 更新劳动项目DTO
export interface UpdateLaborProjectDTO {
  id: number
  projectName: string
  workDescription: string
  requiredLaborValue: number
}

// ==================== 劳动分配相关类型 ====================

// 分配劳动请求DTO
export interface AllocateLaborRequestDTO {
  projectId?: number
}

// 单个项目分配结果DTO
export interface AllocateLaborResultDTO {
  projectId: number
  projectName: string
  projectDescription: string
  requiredLaborValue: number
  allocatedEmployees: AllocatedEmployeeDTO[]
  totalLaborValue: number
  difference: number
}

// 已分配员工信息DTO
export interface AllocatedEmployeeDTO {
  employeeId: number
  employeeName: string
  projectLaborValue: number
  totalLaborValue: number
  allocatedLaborValue: number
}

// 批量分配劳动结果DTO
export interface BatchAllocateLaborResultDTO {
  allocationResults: AllocateLaborResultDTO[]
  totalProjects: number
  allocationTime: string
}

// 劳动分配日志记录DTO
export interface LaborAllocationLogRecordDTO {
  id: number
  requestTime: string
  operatorId: number
  operatorName: string
  projectId: number
  projectName: string
  requiredLaborValue: number
  allocationResult: string
  matchedEmployees: string
  skippedEmployees: string
}

// 劳动分配日志查询DTO
export interface LaborAllocationLogQueryDTO {
  operatorId?: number
  projectId?: number
  pageNum?: number
  pageSize?: number
}
