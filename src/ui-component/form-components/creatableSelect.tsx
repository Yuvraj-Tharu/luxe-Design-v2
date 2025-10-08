// import { useField } from 'formik';
// import CreatableSelect from 'react-select/creatable';
// import { OptionType } from 'types/entities';

// const CreatableSelectField = ({ name, options, placeholder }: { name: string; options: any[]; placeholder: string }) => {
//     const [field, meta, helpers] = useField(name);

//     return (
//         <CreatableSelect
//             hideSelectedOptions
//             options={options}
//             isClearable // ✅ Enables clearing
//             styles={{
//                 menu: (base) => ({ ...base, zIndex: 10 })
//             }}
//             className={`${meta.touched && meta.error ? 'border-red-500' : ''} w-full`}
//             placeholder={placeholder}
//             onChange={(newValue) => {
//                 helpers.setValue(newValue ? (newValue as OptionType).value : ''); // ✅ Clears when empty
//             }}
//             value={
//                 field.value
//                     ? { value: field.value, label: field.value } // ✅ Ensures value appears
//                     : null
//             }
//             onBlur={() => helpers.setTouched(true)}
//         />
//     );
// };

// export default CreatableSelectField;
