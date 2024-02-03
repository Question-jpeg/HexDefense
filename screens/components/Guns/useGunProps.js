
import React, { useContext, useRef } from 'react'
import { Animated } from 'react-native';
import { FieldContext } from '../../../utils/fieldContext';

export default function useGunProps() {
    const selectionAnimatedValue = useRef(new Animated.Value(0)).current;
    const rotateAnimatedValue = useRef(new Animated.Value(0)).current;
    const { entitiesRef } = useContext(FieldContext);
    const gunRef = useRef();
    const intervalRef = useRef();

    return {selectionAnimatedValue, rotateAnimatedValue, entitiesRef, gunRef, intervalRef}

}
