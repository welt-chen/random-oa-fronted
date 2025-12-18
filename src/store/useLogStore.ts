import { create } from 'zustand'
import { getLaborAllocationLogs } from '@/api'
import type { LaborAllocationLogRecordDTO, LaborAllocationLogQueryDTO } from '@/types/api'

export interface LogItem {
  id: number
  timestamp: string
  type: 'info' | 'success' | 'error' | 'warning'
  message: string
  operatorName?: string
  operationType?: string
  rawAllocationResult?: string
}

interface LogState {
  logs: LogItem[]
  loading: boolean
  total: number
  pageNum: number
  pageSize: number
  fetchLogs: (params?: LaborAllocationLogQueryDTO) => Promise<void>
  addLog: (type: 'info' | 'success' | 'error' | 'warning', message: string) => void
  setPage: (pageNum: number, pageSize: number) => void
}

export const useLogStore = create<LogState>()((set, get) => ({
  logs: [],
  loading: false,
  total: 0,
  pageNum: 0,
  pageSize: 5,
  
  fetchLogs: async (params?: LaborAllocationLogQueryDTO) => {
    const { pageNum, pageSize } = get()
    const queryParams: LaborAllocationLogQueryDTO = {
      pageNum: params?.pageNum || pageNum,
      pageSize: params?.pageSize || pageSize,
      ...params
    }
    
    if (get().loading) {
      const currentParams = get()
      if (currentParams.pageNum === queryParams.pageNum && currentParams.pageSize === queryParams.pageSize) {
        return
      }
    }
    
    set({ loading: true })
    try {
      const response = await getLaborAllocationLogs(queryParams)
      // 检查响应状态
      if (response && response.status === 0 && response.result) {
        const { records, total } = response.result
        const logs: LogItem[] = records.map((log: LaborAllocationLogRecordDTO) => {
          let allocationSummary = ''
          let projectDetails = ''
          try {
            const allocationData = JSON.parse(log.allocationResult)
            if (Array.isArray(allocationData) && allocationData.length > 0) {
              const project = allocationData[0]
              
              // 兼容两种格式的数据解析
              let allocatedCount = 0
              let projectName = '未知项目'
              
              // 处理完整格式（有allocatedEmployees数组）
              if (project.allocatedEmployees && Array.isArray(project.allocatedEmployees)) {
                allocatedCount = project.allocatedEmployees.length
                projectName = project.projectName || project.projectDescription || '项目'
              }
              // 处理简化格式（有allocatedEmployeeIds数组）
              else if (project.allocatedEmployeeIds && Array.isArray(project.allocatedEmployeeIds)) {
                allocatedCount = project.allocatedEmployeeIds.length
                projectName = project.projectName || project.projectDescription || '项目'
              }
              
              const requiredLabor = project.requiredLaborValue || project.totalLaborValue || 0
              const difference = project.difference || 0
              
              allocationSummary = `${projectName} - 需求: ${requiredLabor}劳力值, 分配: ${allocatedCount}人, 差异: ${difference}`
              
              // 构建详细的项目信息
              projectDetails = JSON.stringify(allocationData, null, 2)
            }
          } catch (error) {
            console.error('解析分配结果失败:', error)
            allocationSummary = '劳动分配完成'
            projectDetails = log.allocationResult
          }
          
          return {
            id: log.id,
            timestamp: log.requestTime,
            type: 'info',
            message: allocationSummary,
            operatorName: log.operatorName,
            operationType: '劳动分配',
            rawAllocationResult: projectDetails || log.allocationResult
          }
        })
        
        set({ 
          logs, 
          total: total || 0,
          pageNum: queryParams.pageNum || 0,
          pageSize: queryParams.pageSize || 5,
          loading: false 
        })
      } else {
        console.error('API响应格式错误:', response)
        set({ 
          logs: [], 
          total: 0,
          loading: false 
        })
      }
    } catch (error) {
      console.error('获取日志失败:', error)
      set({ 
        logs: [],
        total: 0,
        loading: false 
      })
    }
  },
  
  addLog: (type, message) => {
    const newLog: LogItem = {
      id: Date.now(),
      timestamp: new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }),
      type,
      message,
    }
    set((state) => ({
      logs: [newLog, ...state.logs]
    }))
  },
  
  setPage: (pageNum: number, pageSize: number) => {
    set({ pageNum, pageSize })
  }
}))