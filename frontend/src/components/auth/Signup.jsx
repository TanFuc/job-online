import React, { useEffect } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { RadioGroup } from '../ui/radio-group';
import { Button } from '../ui/button';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '@/redux/authSlice';
import { Loader2 } from 'lucide-react';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

// Schema validation với Yup
const schema = Yup.object().shape({
    fullname: Yup.string().required('Họ và tên không được để trống'),
    email: Yup.string().email('Email không hợp lệ').required('Email không được để trống'),
    phoneNumber: Yup.string()
        .matches(/^[0-9]{10,11}$/, 'Số điện thoại phải từ 10-11 số')
        .required('Số điện thoại không được để trống'),
    password: Yup.string().min(6, 'Mật khẩu phải ít nhất 6 ký tự').required('Mật khẩu không được để trống'),
    role: Yup.string().oneOf(['student', 'recruiter'], 'Vui lòng chọn vai trò').required('Vai trò là bắt buộc'),
    file: Yup
        .mixed()
        .test('required', 'Ảnh đại diện là bắt buộc', (value) => value && value.length > 0)
        .test('fileType', 'Chỉ chấp nhận ảnh (jpg, jpeg, png)', (value) => {
            return value && ['image/jpeg', 'image/png', 'image/jpg'].includes(value[0]?.type);
        })
});

const Signup = () => {
    const { loading, user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append("fullname", data.fullname);
        formData.append("email", data.email);
        formData.append("phoneNumber", data.phoneNumber);
        formData.append("password", data.password);
        formData.append("role", data.role);
        formData.append("file", data.file[0]);

        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
                headers: { 'Content-Type': "multipart/form-data" },
                withCredentials: true,
            });
            if (res.data.success) {
                navigate("/login");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'Lỗi đăng ký');
        } finally {
            dispatch(setLoading(false));
        }
    };

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    return (
        <div className="bg-gray-50 min-h-screen">
            <Navbar />
            <div className='flex items-center justify-center max-w-7xl mx-auto p-4'>
                <form onSubmit={handleSubmit(onSubmit)} className='w-full md:w-1/2 lg:w-1/3 bg-white p-8 rounded-lg shadow-lg'>
                    <h1 className='font-bold text-2xl mb-6 text-center text-[#7209b7]'>Đăng ký</h1>

                    {/* Fullname */}
                    <div className='my-3'>
                        <Label>Họ và Tên</Label>
                        <Input {...register("fullname")} placeholder="Nguyễn Văn Tèo" />
                        {errors.fullname && <p className="text-red-500 text-sm mt-1">{errors.fullname.message}</p>}
                    </div>

                    {/* Email */}
                    <div className='my-3'>
                        <Label>Email</Label>
                        <Input {...register("email")} placeholder="teonguyen@gmail.com" />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                    </div>

                    {/* Phone Number */}
                    <div className='my-3'>
                        <Label>Số điện thoại</Label>
                        <Input {...register("phoneNumber")} placeholder="8080808080" />
                        {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>}
                    </div>

                    {/* Password */}
                    <div className='my-3'>
                        <Label>Mật khẩu</Label>
                        <Input type="password" {...register("password")} placeholder="********" />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                    </div>

                    {/* Role */}
                    <div className='my-3'>
                        <Label>Vai trò</Label>
                        <RadioGroup className="flex items-center gap-4">
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="radio"
                                    value="student"
                                    {...register("role")}
                                    checked={watch('role') === 'student'}
                                />
                                <Label>Sinh viên</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="radio"
                                    value="recruiter"
                                    {...register("role")}
                                    checked={watch('role') === 'recruiter'}
                                />
                                <Label>Nhà tuyển dụng</Label>
                            </div>
                        </RadioGroup>
                        {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>}
                    </div>

                    {/* Avatar Upload */}
                    <div className='my-3'>
                        <Label>Ảnh đại diện</Label>
                        <Input type="file" accept="image/*" {...register("file")} />
                        {errors.file && <p className="text-red-500 text-sm mt-1">{errors.file.message}</p>}
                    </div>

                    {/* Submit Button */}
                    {
                        loading
                            ? <Button className="w-full my-4 bg-purple-600 text-white hover:bg-purple-700"><Loader2 className='mr-2 h-4 w-4 animate-spin' /> Vui lòng chờ </Button>
                            : <Button type="submit" className="w-full my-4 bg-purple-600 text-white hover:bg-purple-700">Đăng ký</Button>
                    }

                    <div className='text-center mt-4'>
                        <span className='text-sm'>Đã có tài khoản? <Link to="/login" className='text-[#7209b7] hover:underline'>Đăng nhập</Link></span>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;
