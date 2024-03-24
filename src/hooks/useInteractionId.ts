import { useCallback } from 'react';
import { useSharedValue } from 'react-native-reanimated';

export const useInteractionId = () => {
  const interactionId = useSharedValue('');

  const getInteractionId = useCallback(() => {
    'worklet';
    return interactionId.value;
  }, [interactionId]);

  const updateInteractionId = useCallback(() => {
    interactionId.value = `${new Date().valueOf()}`;
  }, [interactionId]);

  return { getInteractionId, updateInteractionId };
};
