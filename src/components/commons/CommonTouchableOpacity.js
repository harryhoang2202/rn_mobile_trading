import {TouchableOpacity} from 'react-native';
import React from 'react';

function CommonTouchableOpacity({...rest}) {
    const {children} = {...rest};
    return (
        <TouchableOpacity activeOpacity={0.5} {...rest}>
            {children}
        </TouchableOpacity>
    );
}

export default CommonTouchableOpacity;
