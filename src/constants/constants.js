const countryCode =
    [
        '+20','+966','+971','+967','+964','+965','+963','+962','+961','+960',
        '+95','+94','+93','+92','+91','+90','+88','+86','+85','+84','+83',
        '+82','+81','+80','+7','+6','+5','+4','+3','+2','+1'
    ];
const countryId = [
    'EG', 'SA', 'AE', 'YE', 'IQ', 'KW', 'SY', 'JO', 'LB', 'MV',
    'MM', 'LK', 'AF', 'PK', 'IN', 'TR', 'BD', 'CN', 'HK', 'VN', 'KP',
    'KR', 'JP', 'MN', 'RU', 'MY', 'PH', 'DE', 'FR', 'DZ', 'US'
];

const countryFlag = countryId.map(
    code => `https://flagcdn.com/w40/${code.toLowerCase()}.png`
);

export const countries = countryCode.map((code, i) => ({
    code,
    id: countryId[i],
    flag: countryFlag[i]
}));