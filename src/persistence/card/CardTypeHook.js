import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import _ from 'lodash';

const useCardTypeDetailHook = cardTypeId => {
    const {cardTypes} = useSelector(state => state.CardReducer);
    const [cardType, setCardType] = useState({});
    useEffect(() => {
        const findCardType = _.find(cardTypes, {id: cardTypeId});
        setCardType(findCardType);
        return () => {
            // Clean-up logic
        };
    }, [cardTypes]); // Only re-run the effect if 'value' changes

    return {cardType};
};
export default useCardTypeDetailHook;
