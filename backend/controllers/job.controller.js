import { Job } from "../models/job.model.js";

export const postJob = async (req, res) => {
    try {
        const {
            title,
            description,
            requirements,
            salary,
            location,
            jobType,
            experience,
            position,
            companyId
        } = req.body;

        const userId = req.id;

        // Debug log đầu vào
        console.log("Received data:", {
            title,
            description,
            requirements,
            salary,
            location,
            jobType,
            experience,
            position,
            companyId,
            userId
        });

        if (
            !title ||
            !description ||
            !requirements ||
            salary === undefined ||
            !location ||
            !jobType ||
            !experience ||
            position === undefined ||
            !companyId
        ) {
            return res.status(400).json({
                message: "Missing required fields.",
                success: false
            });
        }

        const salaryNumber = Number(salary);
        const positionNumber = Number(position);

        if (isNaN(salaryNumber) || salaryNumber <= 0) {
            return res.status(400).json({
                message: "Invalid salary. It must be a positive number.",
                success: false
            });
        }

        if (isNaN(positionNumber) || positionNumber <= 0) {
            return res.status(400).json({
                message: "Invalid position. It must be a positive number.",
                success: false
            });
        }

        const requirementsArray = requirements.split(",").map(req => req.trim());

        // Debug log dữ liệu trước khi lưu
        console.log("Data to create Job:", {
            title,
            description,
            requirements: requirementsArray,
            salary: salaryNumber,
            location,
            jobType,
            experienceLevel: experience.trim(),
            position: positionNumber,
            company: companyId,
            created_by: userId
        });

        const job = await Job.create({
            title,
            description,
            requirements: requirementsArray,
            salary: salaryNumber,
            location,
            jobType,
            experienceLevel: experience.trim(),
            position: positionNumber,
            company: companyId,
            created_by: userId
        });

        return res.status(201).json({
            message: "New job created successfully.",
            job,
            success: true
        });
    } catch (error) {
        console.error("Error creating job:", error.message);
        return res.status(500).json({
            message: "Server error while creating job.",
            error: error.message,
            success: false
        });
    }
};


// student k liye
export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ]
        };
        const jobs = await Job.find(query).populate({
            path: "company"
        }).sort({ createdAt: -1 });
        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
// student
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path: "applications"
        });
        if (!job) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({ job, success: true });
    } catch (error) {
        console.log(error);
    }
}
// admin kitne job create kra hai abhi tk
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({ created_by: adminId }).populate({
            path: 'company',
            createdAt: -1
        });
        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
// Xóa công việc
export const deleteJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Công việc không tồn tại.",
            });
        }
        await Job.findByIdAndDelete(jobId);
        return res.status(200).json({
            success: true,
            message: "Công việc đã được xóa thành công.",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Xóa công việc thất bại do lỗi server.",
        });
    }
};

// Cập nhật thông tin công việc
export const updateJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body;
        const userId = req.id;

        // Kiểm tra nếu có trường thông tin nào thiếu
        if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
            return res.status(400).json({
                message: "Something is missing.",
                success: false
            });
        }

        // Tìm công việc theo ID và cập nhật
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }

        // Cập nhật các trường thông tin công việc
        job.title = title;
        job.description = description;
        job.requirements = requirements.split(","); // Giả sử requirements là một chuỗi được phân tách bằng dấu phẩy
        job.salary = Number(salary);
        job.location = location;
        job.jobType = jobType;
        job.experienceLevel = experience;
        job.position = position;
        job.company = companyId;
        job.created_by = userId; // Nếu cần, có thể thay đổi người tạo công việc

        // Lưu công việc đã được cập nhật
        await job.save();

        return res.status(200).json({
            message: "Job updated successfully.",
            job,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "An error occurred while updating the job.",
            success: false
        });
    }
};
