import React, { useEffect, useState } from 'react';
import Navbar from './shared/Navbar';
import FilterCard from './FilterCard';
import Job from './Job';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

const Jobs = () => {
    const { allJobs, searchedQuery } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState(allJobs);

    useEffect(() => {
        if (searchedQuery && (searchedQuery.location || searchedQuery.field)) {
            const filteredJobs = allJobs.filter((job) => {
                const locationMatch = searchedQuery.location
                    ? job.location.toLowerCase().includes(searchedQuery.location.toLowerCase())
                    : true;

                const fieldMatch = searchedQuery.field
                    ? job.title.toLowerCase().includes(searchedQuery.field.toLowerCase())
                    : true;

                return locationMatch && fieldMatch;
            });
            setFilterJobs(filteredJobs);
        } else {
            setFilterJobs(allJobs);
        }
    }, [allJobs, searchedQuery]);

    return (
        <div>
            <Navbar />
            <div className="max-w-7xl mx-auto mt-5 flex gap-5 min-h-screen">
                {/* Bộ lọc công việc */}
                <div className="w-[20%] min-h-screen">
                    <FilterCard />
                </div>

                {/* Danh sách công việc */}
                <div className="flex-1 overflow-hidden">
                    {
                        filterJobs.length <= 0 ? (
                            <span>Không tìm thấy công việc</span>
                        ) : (
                            <div className="h-full overflow-y-auto pb-5">
                                <div className="grid grid-cols-3 gap-4">
                                    {
                                        filterJobs.map((job) => (
                                            <motion.div
                                                initial={{ opacity: 0, x: 100 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -100 }}
                                                transition={{ duration: 0.3 }}
                                                key={job?._id}
                                            >
                                                <Job job={job} />
                                            </motion.div>
                                        ))
                                    }
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
};

export default Jobs;
