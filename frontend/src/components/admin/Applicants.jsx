import React, { useEffect, useCallback } from 'react';
import Navbar from '../shared/Navbar';
import ApplicantsTable from './ApplicantsTable';
import axios from 'axios';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAllApplicants } from '@/redux/applicationSlice';

const Applicants = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const { applicants } = useSelector(store => store.application);

    const fetchAllApplicants = useCallback(async () => {
        try {
            const res = await axios.get(`${APPLICATION_API_END_POINT}/${params.id}/applicants`, { withCredentials: true });
            dispatch(setAllApplicants(res.data.job));
        } catch (error) {
            console.error("Lỗi khi lấy danh sách ứng viên:", error.response?.data?.message || error.message);
        }
    }, [params.id, dispatch]);

    useEffect(() => {
        fetchAllApplicants();
    }, [fetchAllApplicants]);

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
                <h1 className="font-bold text-2xl text-gray-800 my-6">
                    {applicants?.applications?.length || 0} Ứng viên
                </h1>
                <ApplicantsTable />
            </div>
        </div>
    );
};

export default Applicants;
