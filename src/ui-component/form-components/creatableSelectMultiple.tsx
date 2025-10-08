// import { useField } from 'formik';
// import CreatableSelect from 'react-select/creatable';
// import { OptionType } from 'views/Blogs/BlogAddDialogBody';

// const CreatableSelectFieldMultiple = ({ name, options, placeholder }: { name: string; options: any[]; placeholder: string }) => {
//     const [field, meta, helpers] = useField(name);

//     return (
//         <CreatableSelect
//             isMulti // ✅ Enables multi-select
//             hideSelectedOptions
//             options={options}
//             isClearable
//             styles={{
//                 menu: (base) => ({ ...base, zIndex: 10 })
//             }}
//             className={`${meta.touched && meta.error ? 'border-red-500' : ''} w-full`}
//             placeholder={placeholder}
//             onChange={(newValue) => {
//                 helpers.setValue(newValue ? newValue.map((item: OptionType) => item.value) : []); // ✅ Handles array of values
//             }}
//             value={field.value ? field.value.map((val: string) => ({ value: val, label: val })) : []} // ✅ Ensures array appears correctly
//             onBlur={() => helpers.setTouched(true)}
//         />
//     );
// };

// export default CreatableSelectFieldMultiple;
