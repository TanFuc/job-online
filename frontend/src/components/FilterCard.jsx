import React, { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";

const filterData = [
    {
        filterType: "location",
        title: "Vị trí",
        array: ["Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Cần Thơ", "Hải Phòng"]
    },
    {
        filterType: "field",
        title: "Lĩnh vực",
        array: [
            "Frontend Developer", "Backend Developer", "Full Stack Developer",
            "DevOps Engineer", "Data Analyst", "Mobile App Developer",
            "Software Tester (QA/QC)", "AI/ML Engineer", "IT Support Specialist"
        ]
    }
];

const FilterCard = () => {
    const [selectedValues, setSelectedValues] = useState({ location: "", field: "" });
    const dispatch = useDispatch();

    const changeHandler = (value, type) => {
        const updatedValues = { ...selectedValues, [type]: value };
        setSelectedValues(updatedValues);
    };

    const resetFilters = () => {
        setSelectedValues({ location: "", field: "" });
    };

    useEffect(() => {
        dispatch(setSearchedQuery(selectedValues));
    }, [selectedValues, dispatch]);

    return (
        <div className="w-full bg-white p-4 rounded-md shadow-md">
            <h1 className="font-semibold text-xl text-gray-800 mb-4">Lọc công việc</h1>
            {
                filterData.map((data, index) => (
                    <RadioGroup
                        key={index}
                        value={selectedValues[data.filterType]}
                        onValueChange={(value) => changeHandler(value, data.filterType)}
                        className="mb-4"
                    >
                        <h2 className="font-medium text-lg text-gray-700 mb-2">{data.title}</h2>
                        {
                            data.array.map((item, idx) => {
                                const itemId = `id${index}-${idx}`;
                                return (
                                    <div key={itemId} className="flex items-center space-x-3 mb-2">
                                        <RadioGroupItem
                                            value={item}
                                            id={itemId}
                                            className="hover:bg-indigo-100 rounded-full transition-colors"
                                        />
                                        <Label
                                            htmlFor={itemId}
                                            className="text-sm text-gray-600 cursor-pointer hover:text-indigo-600"
                                        >
                                            {item}
                                        </Label>
                                    </div>
                                );
                            })
                        }
                    </RadioGroup>
                ))
            }

            {/* Nút Xóa bộ lọc */}
            <Button
                onClick={resetFilters}
                className="w-full mt-4 bg-red-500 text-white hover:bg-red-600 transition-all"
            >
                Xóa bộ lọc
            </Button>
        </div>
    );
};

export default FilterCard;
