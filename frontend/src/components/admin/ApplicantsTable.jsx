import React, { useCallback } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MoreHorizontal } from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import axios from 'axios';

const shortlistingStatus = ["Accepted", "Rejected"];

const ApplicantsTable = () => {
    const { applicants } = useSelector(store => store.application);

    const statusHandler = useCallback(async (status, id) => {
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, { status });
            if (res.data.success) {
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Có lỗi xảy ra");
        }
    }, []);

    return (
        <div className="p-4 bg-white shadow-md rounded-lg">
            <Table>
                <TableCaption className="text-gray-500">Danh sách các ứng viên gần đây</TableCaption>
                <TableHeader>
                    <TableRow className="bg-gray-100">
                        <TableHead className="font-semibold">Tên đầy đủ</TableHead>
                        <TableHead className="font-semibold">Email</TableHead>
                        <TableHead className="font-semibold">Số điện thoại</TableHead>
                        <TableHead className="font-semibold">Sơ yếu lý lịch</TableHead>
                        <TableHead className="font-semibold">Ngày ứng tuyển</TableHead>
                        <TableHead className="text-right font-semibold">Hành động</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {applicants?.applications?.length > 0 ? (
                        applicants.applications.map((item) => (
                            <TableRow key={item._id} className="hover:bg-gray-50">
                                <TableCell>{item.applicant.fullname}</TableCell>
                                <TableCell>{item.applicant.email}</TableCell>
                                <TableCell>{item.applicant.phoneNumber}</TableCell>
                                <TableCell>
                                    {item.applicant.profile?.resume ? (
                                        <a 
                                            className="text-purple-600 hover:underline" 
                                            href={item.applicant.profile.resume} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                        >
                                            {item.applicant.profile.resumeOriginalName}
                                        </a>
                                    ) : (
                                        <span className="text-gray-400">Chưa có</span>
                                    )}
                                </TableCell>
                                <TableCell>{item.applicant.createdAt.split("T")[0]}</TableCell>
                                <TableCell className="text-right">
                                    <Popover>
                                        <PopoverTrigger className="p-2 rounded-md hover:bg-gray-200 transition">
                                            <MoreHorizontal />
                                        </PopoverTrigger>
                                        <PopoverContent className="w-32 bg-white shadow-md rounded-md">
                                            {shortlistingStatus.map((status) => (
                                                <div 
                                                    key={status} 
                                                    onClick={() => statusHandler(status, item._id)}
                                                    className="p-2 hover:bg-gray-100 cursor-pointer rounded-md"
                                                >
                                                    {status}
                                                </div>
                                            ))}
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan="6" className="text-center text-gray-500 py-4">
                                Không có ứng viên nào
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default ApplicantsTable;
