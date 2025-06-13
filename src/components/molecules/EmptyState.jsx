import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';

const EmptyState = ({ icon, title, description, buttonText, onButtonClick, showButton = true }) => {
  return (
    &lt;div className="bg-white rounded-lg p-12 text-center shadow-sm">
      &lt;ApperIcon name={icon} className="w-12 h-12 text-gray-300 mx-auto mb-4" />
      &lt;Heading level={3} className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      &lt;/Heading>
      &lt;Text variant="p" className="text-gray-600 mb-4">
        {description}
      &lt;/Text>
      {showButton && onButtonClick && (
        &lt;Button variant="primary" onClick={onButtonClick}>
          {buttonText}
        &lt;/Button>
      )}
    &lt;/div>
  );
};

export default EmptyState;