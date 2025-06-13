import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    &lt;div className="min-h-screen flex items-center justify-center p-6">
      &lt;motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md mx-auto"
      >
        &lt;div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          &lt;ApperIcon name="Search" className="w-12 h-12 text-primary" />
        &lt;/div>
        
        &lt;Heading level={1} className="text-4xl font-bold text-gray-900 mb-4">404&lt;/Heading>
        &lt;Heading level={2} className="text-xl font-semibold text-gray-700 mb-4">Page Not Found&lt;/Heading>
        &lt;Text variant="p" className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        &lt;/Text>
        
        &lt;div className="space-y-3">
          &lt;Button
            variant="primary"
            onClick={() => navigate('/dashboard')}
            className="w-full px-6 py-3"
          >
            Go to Dashboard
          &lt;/Button>
          &lt;Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="w-full px-6 py-3"
          >
            Go Back
          &lt;/Button>
        &lt;/div>
      &lt;/motion.div>
    &lt;/div>
  );
}

export default NotFoundPage;