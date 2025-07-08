import { useAccess } from '../context/AccessContext';
import { useNavigate } from 'react-router-dom';

export const useSubscriptionAccess = () => {
  const { 
    hasAccess, 
    subscription, 
    isSubscriptionActive, 
    getSubscriptionStatusMessage 
  } = useAccess();
  const navigate = useNavigate();

  const checkAccess = () => {
    if (!subscription) {
      return { hasAccess: false, message: "No subscription found" };
    }

    const isActive = isSubscriptionActive(subscription.status);
    const message = getSubscriptionStatusMessage(subscription.status, subscription.type);

    return { hasAccess: isActive, message };
  };

  const requireAccess = (redirectTo: string = '/pricing') => {
    const { hasAccess: currentAccess, message } = checkAccess();
    
    if (!currentAccess) {
      navigate(redirectTo, { 
        state: { 
          subscriptionStatus: subscription?.status,
          subscriptionType: subscription?.type,
          statusMessage: message
        }
      });
      return false;
    }
    
    return true;
  };

  const getSubscriptionInfo = () => {
    if (!subscription) {
      return {
        status: 'not_found',
        type: null,
        isActive: false,
        message: 'No subscription found',
        periodStart: null,
        periodEnd: null
      };
    }

    return {
      status: subscription.status,
      type: subscription.type,
      isActive: isSubscriptionActive(subscription.status),
      message: getSubscriptionStatusMessage(subscription.status, subscription.type),
      periodStart: subscription.current_period_start 
        ? new Date(subscription.current_period_start * 1000) 
        : null,
      periodEnd: subscription.current_period_end 
        ? new Date(subscription.current_period_end * 1000) 
        : null
    };
  };

  return {
    hasAccess,
    subscription,
    checkAccess,
    requireAccess,
    getSubscriptionInfo,
    isSubscriptionActive,
    getSubscriptionStatusMessage
  };
}; 