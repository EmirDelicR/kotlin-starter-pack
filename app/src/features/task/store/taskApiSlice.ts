import { ITEMS_PER_PAGE } from '@/constants/api';
import baseApi from '@/store/services/baseApiSetup';

export interface Task {
  userId: string;
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

interface ApiTaskResponse {
  data: Task[];
  message: string;
  status: number;
}

interface PaginatedData {
  items: Task[];
  numberOfPages: number;
  totalCount: number;
}

interface ApiPaginatedTaskResponse {
  data: PaginatedData;
  message: string;
  status: number;
}

interface StatisticData {
  total: number;
  done: number;
  open: number;
}

interface ApiTaskStatisticsResponse {
  data: StatisticData;
  message: string;
  status: number;
}

const baseApiWithTag = baseApi.enhanceEndpoints({ addTagTypes: ['Task'] });

const taskSlice = baseApiWithTag.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query<Task[], null>({
      query: () => '/tasks',
      transformResponse: (res: ApiTaskResponse) => res.data,
      providesTags: ['Task']
    }),

    getTasksStatistics: builder.query<StatisticData, { userId: string }>({
      query: ({ userId }) => `/tasks/${userId}/statistics`,
      transformResponse: (res: ApiTaskStatisticsResponse) => res.data,
      providesTags: ['Task']
    }),

    getPaginatedTasks: builder.query<
      PaginatedData,
      { userId: string; page?: number; pageSize?: number; isMobile?: boolean }
    >({
      query: ({
        userId,
        page = 1,
        pageSize = ITEMS_PER_PAGE,
        isMobile = false
      }) =>
        `/tasks/paginated/${userId}?page=${page}&pageSize=${pageSize}&isMobile=${isMobile}`,
      transformResponse: (res: ApiPaginatedTaskResponse) => res.data,
      providesTags: ['Task']
    }),

    addTask: builder.mutation({
      query: (task: Partial<Task>) => ({
        url: '/tasks',
        method: 'POST',
        body: task
      }),
      invalidatesTags: ['Task']
    }),

    updateTask: builder.mutation({
      query: (task: Task) => ({
        url: `/tasks/${task.id}`,
        method: 'PUT',
        body: task
      }),
      invalidatesTags: ['Task']
    }),

    deleteTask: builder.mutation({
      query: ({ taskId, userId }: { taskId: string; userId: string }) => ({
        url: `/tasks/${taskId}`,
        method: 'DELETE',
        body: {
          userId
        }
      }),
      invalidatesTags: ['Task']
    })
  })
});

export const {
  useGetTasksStatisticsQuery,
  useGetPaginatedTasksQuery,
  useAddTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation
} = taskSlice;
