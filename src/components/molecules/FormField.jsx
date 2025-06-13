import Label from '@/components/atoms/Label';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Textarea from '@/components/atoms/Textarea';

const FormField = ({ label, id, type = 'text', required = false, children, ...props }) => {
  const renderControl = () => {
    switch (type) {
      case 'select':
        return <Select id={id} {...props}>{children}</Select>;
      case 'textarea':
        return <Textarea id={id} {...props} />;
      case 'range':
        return (
          &lt;>
            &lt;Input type="range" id={id} {...props} />
            &lt;div className="text-center text-sm text-gray-600 mt-1">
              {props.value}%
            &lt;/div>
          &lt;/>
        );
      default:
        return <Input type={type} id={id} {...props} />;
    }
  };

  return (
    &lt;div>
      &lt;Label htmlFor={id}>
        {label} {required && &lt;span className="text-red-500">*&lt;/span>}
      &lt;/Label>
      {renderControl()}
    &lt;/div>
  );
};

export default FormField;