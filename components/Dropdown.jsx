import Select from 'react-select';

const options = [
  { value: 'pending', label: 'Pending', color: '#fef3c7', textColor: '#92400e' },
  { value: 'processing', label: 'Processing', color: '#dbeafe', textColor: '#1e40af' },
  { value: 'completed', label: 'Completed', color: '#dcfce7', textColor: '#166534' },
  { value: 'cancelled', label: 'Cancelled', color: '#fee2e2', textColor: '#991b1b' },
];

const customStyles = {
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.data.color,
    color: state.data.textColor,
    padding: '8px 12px',
  }),
  singleValue: (provided, state) => {
    const selectedOption = options.find(opt => opt.value === state.selectProps.value);
    return {
      ...provided,
      backgroundColor: selectedOption?.color,
      color: selectedOption?.textColor,
      padding: '4px 8px',
      borderRadius: '6px',
    };
  },
  control: (provided) => ({
    ...provided,
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    boxShadow: 'none',
    '&:hover': {
      borderColor: '#cbd5e0',
    },
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  }),
};

const Dropdown = ({ value, onChange }) => (
  <Select
    options={options}
    value={options.find(opt => opt.value === value)}
    onChange={(selectedOption) => onChange(selectedOption.value)}
    styles={customStyles}
  />
);

export default Dropdown;