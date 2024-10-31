import * as React from 'react';
import CommonText from '@components/commons/CommonText';
import {useSelector} from 'react-redux';
import numeral from 'numeral';

function Price({style, children, decimals = 2, ...rest}) {
    const {currency} = useSelector(state => state.CurrencyReducer);
    const exchangeValue = children * currency.value;
    const format = `0,0.[${'0'.repeat(decimals)}]`;
    const number = numeral(exchangeValue).format(format);
    return (
        <CommonText style={style} {...rest}>
            {number}
            {currency.symbol}
        </CommonText>
    );
}

export default Price;
