import type { ImageZoomUseGesturesProps } from '../types';
export declare const useGestures: ({ center, minScale, maxScale, minPanPointers, maxPanPointers, isPanEnabled, isPinchEnabled, onInteractionStart, onInteractionEnd, onPinchStart, onPinchEnd, onPanStart, onPanEnd, }: ImageZoomUseGesturesProps) => {
    gestures: import("react-native-gesture-handler/lib/typescript/handlers/gestures/gestureComposition").SimultaneousGesture;
    animatedStyle: {
        transform: ({
            translateX: number;
            translateY?: undefined;
            scale?: undefined;
        } | {
            translateY: number;
            translateX?: undefined;
            scale?: undefined;
        } | {
            scale: number;
            translateX?: undefined;
            translateY?: undefined;
        })[];
    };
};
//# sourceMappingURL=useGestures.d.ts.map