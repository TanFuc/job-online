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
import { setLoading, setUser } from '@/redux/authSlice';
import { Loader2 } from 'lucide-react';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Schema validation với Yup
const loginSchema = yup.object().shape({
    email: yup.string().email("Email không hợp lệ").required("Email không được để trống"),
    password: yup.string().required("Mật khẩu không được để trống"),
    role: yup.string().oneOf(['student', 'recruiter'], "Vai trò không hợp lệ"),
});

const Login = () => {
    const { loading, user } = useSelector((store) => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
            role: 'student',
        }
    });

    const onSubmit = async (data) => {
        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/login`, data, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Đã có lỗi xảy ra");
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
            <div className='flex items-center justify-center max-w-7xl mx-auto'>
                <form onSubmit={handleSubmit(onSubmit)} className='w-full sm:w-96 border border-gray-300 rounded-lg p-8 my-10 shadow-xl bg-white'>
                    <h1 className='font-bold text-2xl mb-6 text-gray-800 text-center'>Đăng nhập</h1>

                    {/* Email input */}
                    <div className='my-4'>
                        <Label>Email</Label>
                        <Input
                            type="email"
                            {...register("email")}
                            placeholder="tanphuc@gmail.com"
                            className="w-full p-3 border rounded-md border-gray-300 focus:ring-2 focus:ring-purple-400"
                        />
                        {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
                    </div>

                    {/* Password input */}
                    <div className='my-4'>
                        <Label>Mật khẩu</Label>
                        <Input
                            type="password"
                            {...register("password")}
                            placeholder="********"
                            className="w-full p-3 border rounded-md border-gray-300 focus:ring-2 focus:ring-purple-400"
                        />
                        {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
                    </div>

                    {/* Role selection */}
                    <div className='my-4'>
                        <RadioGroup className="flex items-center gap-4">
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="radio"
                                    value="student"
                                    {...register("role")}
                                    checked={watch("role") === "student"}
                                    className="cursor-pointer"
                                />
                                <Label>Ứng viên</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="radio"
                                    value="recruiter"
                                    {...register("role")}
                                    checked={watch("role") === "recruiter"}
                                    className="cursor-pointer"
                                />
                                <Label>Nhà tuyển dụng</Label>
                            </div>
                        </RadioGroup>
                        {errors.role && <p className="text-red-600 text-sm mt-1">{errors.role.message}</p>}
                    </div>

                    {/* Submit button */}
                    {loading ? (
                        <Button className="w-full my-4 flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white">
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Vui lòng chờ
                        </Button>
                    ) : (
                        <Button type="submit" className="w-full my-4 bg-purple-600 hover:bg-purple-700 text-white">
                            Đăng nhập
                        </Button>
                    )}

                    {/* Signup link */}
                    <div className='text-center'>
                        <span className='text-sm'>
                            Chưa có tài khoản? <Link to="/signup" className='text-[#7209b7] hover:underline'>Đăng ký</Link>
                        </span>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
