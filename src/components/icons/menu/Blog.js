import * as React from 'react';
import CommonImage from '@components/commons/CommonImage';

const Blog = ({size, isFocused}) => {
    const defaultSize = size || 24;
    const source = isFocused
        ? require('@assets/images/bottombar/blog_active.png')
        : require('@assets/images/bottombar/blog_inactive.png');
    return (
        <CommonImage
            source={source}
            style={{width: defaultSize, height: defaultSize}}
        />
    );
};

export default Blog;
