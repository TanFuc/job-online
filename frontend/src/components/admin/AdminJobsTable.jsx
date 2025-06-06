import React, { useEffect, useState } from 'react'
import {
    Table, TableBody, TableCaption, TableCell,
    TableHead, TableHeader, TableRow
} from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Edit2, Eye, MoreHorizontal, Trash } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { JOB_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { deleteJobById } from '@/redux/jobSlice'

const AdminJobsTable = () => {
    const { allAdminJobs, searchJobByText } = useSelector(state => state.job)
    const [filteredJobs, setFilteredJobs] = useState(allAdminJobs)
    const [deletingJobId, setDeletingJobId] = useState(null) // lưu job đang xóa
    const navigate = useNavigate()
    const dispatch = useDispatch()

    // Lọc job khi searchJobByText thay đổi
    useEffect(() => {
        const filtered = allAdminJobs.filter(job => {
            if (!searchJobByText) return true
            return job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) ||
                job?.company?.name?.toLowerCase().includes(searchJobByText.toLowerCase())
        })
        setFilteredJobs(filtered)
    }, [allAdminJobs, searchJobByText])

    // Xử lý xóa job
    const deleteJobHandler = async (jobId) => {
        const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa công việc này?")
        if (!confirmDelete) return

        setDeletingJobId(jobId)
        try {
            const res = await axios.delete(`${JOB_API_END_POINT}/delete/${jobId}`, { withCredentials: true })
            if (res.data.success) {
                toast.success(res.data.message)
                dispatch(deleteJobById(jobId))
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Xóa công việc thất bại!")
        } finally {
            setDeletingJobId(null)
        }
    }

    return (
        <div className="overflow-x-auto">
            <Table>
                <TableCaption>Danh sách các công việc bạn đã đăng gần đây</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-1/4">Tên công ty</TableHead>
                        <TableHead className="w-1/4">Vị trí</TableHead>
                        <TableHead className="w-1/4">Ngày đăng</TableHead>
                        <TableHead className="w-1/4 text-right">Hành động</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredJobs.map(job => (
                        <TableRow key={job._id}>
                            <TableCell>{job?.company?.name}</TableCell>
                            <TableCell>{job?.title}</TableCell>
                            <TableCell>{job?.createdAt.split("T")[0]}</TableCell>
                            <TableCell className="text-right cursor-pointer">
                                <Popover>
                                    <PopoverTrigger>
                                        <MoreHorizontal />
                                    </PopoverTrigger>
                                    <PopoverContent className="w-32">
                                        <div
                                            onClick={() => navigate(`/admin/jobs/${job._id}`)}
                                            className="flex items-center gap-2 w-full cursor-pointer hover:bg-gray-100 p-2 rounded"
                                        >
                                            <Edit2 className="w-4" />
                                            <span>Sửa</span>
                                        </div>
                                        <div
                                            onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                                            className="flex items-center gap-2 w-full mt-1 cursor-pointer hover:bg-gray-100 p-2 rounded"
                                        >
                                            <Eye className="w-4" />
                                            <span>Ứng viên</span>
                                        </div>
                                        <div
                                            onClick={() => deletingJobId !== job._id && deleteJobHandler(job._id)}
                                            className={`flex items-center gap-2 w-full mt-1 p-2 rounded text-red-600 hover:bg-gray-100 ${deletingJobId === job._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            <Trash className="w-4" />
                                            <span>{deletingJobId === job._id ? "Đang xóa..." : "Xóa"}</span>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default AdminJobsTable

