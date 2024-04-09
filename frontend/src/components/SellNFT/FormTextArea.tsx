import React from "react";

type formTextAreaProps = {
    labelName: string;
    placeholder: string;
    value: string;
    handleChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

const FormTextArea = ({
    labelName,
    placeholder,
    value,
    handleChange,
}: formTextAreaProps) => {
    return (
        <label className="flex-1 w-full flex flex-col">
            {labelName && (
                <span className="font-epilogue font-semibold text-[16px] leading-[22px] text-[#1e0c6e] mb-[10px]">
                    {labelName}
                </span>
            )}

            <textarea
                required
                value={value}
                onChange={handleChange}
                rows={10}
                placeholder={placeholder}
                className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[3px] border-[#1e0c6e] bg-transparent font-epilogue text-black text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px]"
            />
        </label>
    );
};

export default FormTextArea;
