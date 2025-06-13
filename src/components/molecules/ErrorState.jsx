import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';

const ErrorState = ({ title, message, onRetry }) => {
  return (
    &lt;div className="p-6 max-w-7xl mx-auto">
      &lt;div className="bg-white rounded-lg p-12 text-center shadow-sm">
        &lt;ApperIcon name="AlertCircle" className="w-12 h-12 text-red-500 mx-auto mb-4" />
        &lt;Heading level={3} className="text-lg font-semibold text-gray-900 mb-2">{title}&lt;/Heading>
        &lt;Text variant="p" className="text-gray-600 mb-4">{message}&lt;/Text>
        &lt;Button variant="primary" onClick={onRetry}>
          Try Again
        &lt;/Button>
      &lt;/div>
    &lt;/div>
  );
};

export default ErrorState;