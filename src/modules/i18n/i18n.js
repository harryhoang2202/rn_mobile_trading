import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import english from './languages/en.json';
import chinese from './languages/cn.json';
import french from './languages/fr.json';
import taiwanese from './languages/tw.json';
import indian from './languages/in.json';
import indo from './languages/indo.json';
import japanese from './languages/jp.json';
import korean from './languages/kr.json';
import malai from './languages/ma.json';
import vietnamese from './languages/vi.json';

const numeral = require('numeral');
const numberFormatter = (value, format) => numeral(value).format(format);
i18n.use(initReactI18next)
    .init({
        compatibilityJSON: 'v3',
        lng: 'en',
        fallbackLng: 'en',
        resources: {
            en: english,
            cn: chinese,
            tw: taiwanese,
            in: indian,
            indo: indo,
            jp: japanese,
            fr: french,
            kr: korean,
            ma: malai,
            vi: vietnamese,
        },
        react: {
            useSuspense: false,
        },
        interpolation: {
            format: (value, format) => numberFormatter(value, format),
        },
    })
    .then(r => {});
export default i18n;
