import React, { useEffect, useState } from 'react';
import Navbar from './shared/Navbar';
import FilterCard from './FilterCard';
import Job from './Job';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

const Jobs = () => {
    const { allJobs, searchedQuery } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState([]);

    useEffect(() => {
        // Đảm bảo searchedQuery là chuỗi
        const query = String(searchedQuery || '').toLowerCase();

        if (query.trim()) {
            const filteredJobs = allJobs.filter((job) => {
                const title = String(job?.title || '').toLowerCase();
                const description = String(job?.description || '').toLowerCase();
                const location = String(job?.location || '').toLowerCase();

                return (
                    title.includes(query) ||
                    description.includes(query) ||
                    location.includes(query)
                );
            });

            setFilterJobs(filteredJobs);
        } else {
            // Nếu không có query thì hiển thị toàn bộ job
            setFilterJobs(allJobs);
        }
    }, [allJobs, searchedQuery]);

    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto mt-5'>
                <div className='flex gap-5'>
                    <div className='w-[20%]'>
                        <FilterCard />
                    </div>
                    {filterJobs.length <= 0 ? (
                        <span>Job not found</span>
                    ) : (
                        <div className='flex-1 h-[88vh] overflow-y-auto pb-5'>
                            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                                {filterJobs.map((job) => (
                                    <motion.div
                                        key={job?._id}
                                        initial={{ opacity: 0, x: 100 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -100 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Job job={job} />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Jobs;
