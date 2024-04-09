import React from "react";

type formFieldProps = {
    labelName: string;
    placeholder: string;
    inputType: string;
    value: string;
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const FormField = ({
    labelName,
    placeholder,
    inputType,
    value,
    handleChange,
}: formFieldProps) => {
    return (
        <label className="flex-1 w-full flex flex-col">
            {labelName && (
                <span className="font-epilogue font-semibold text-[16px] leading-[22px] text-[#1e0c6e] mb-[10px]">
                    {labelName}
                </span>
            )}
            <input
                required
                value={value}
                onChange={handleChange}
                type={inputType}
                step="0.1"
                placeholder={placeholder}
                className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[3px] border-[#1e0c6e] bg-transparent font-epilogue text-black text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px]"
            />
        </label>
    );
};

export default FormField;
