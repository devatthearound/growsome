interface CountryFlagProps {
  countryCode: string;
  className?: string;
}

const CountryFlag: React.FC<CountryFlagProps> = ({ countryCode, className = "w-4 h-3" }) => {
  const getCountryName = (code: string) => {
    const countries: Record<string, string> = {
      'KR': '대한민국',
      'US': '미국', 
      'JP': '일본',
      'CN': '중국',
      'GB': '영국',
      'DE': '독일',
      'FR': '프랑스',
      'CA': '캐나다',
      'AU': '호주',
      'IN': '인도',
      'BR': '브라질',
      'MX': '멕시코',
      'ES': '스페인',
      'IT': '이탈리아',
      'RU': '러시아',
      'TH': '태국',
      'VN': '베트남',
      'ID': '인도네시아',
      'MY': '말레이시아',
      'SG': '싱가포르',
      'PH': '필리핀'
    };
    return countries[code] || code;
  };

  const getEmojiFlag = (countryCode: string) => {
    const flagEmojis: Record<string, string> = {
      'KR': '🇰🇷',
      'US': '🇺🇸',
      'JP': '🇯🇵',
      'CN': '🇨🇳',
      'GB': '🇬🇧',
      'DE': '🇩🇪',
      'FR': '🇫🇷',
      'CA': '🇨🇦',
      'AU': '🇦🇺',
      'IN': '🇮🇳',
      'BR': '🇧🇷',
      'MX': '🇲🇽',
      'ES': '🇪🇸',
      'IT': '🇮🇹',
      'RU': '🇷🇺',
      'TH': '🇹🇭',
      'VN': '🇻🇳',
      'ID': '🇮🇩',
      'MY': '🇲🇾',
      'SG': '🇸🇬',
      'PH': '🇵🇭'
    };
    return flagEmojis[countryCode] || '🏳️';
  };

  return (
    <span 
      className={`inline-flex items-center ${className}`}
      title={getCountryName(countryCode)}
    >
      <span className="text-base mr-1">{getEmojiFlag(countryCode)}</span>
      <span className="text-xs text-gray-600">{countryCode}</span>
    </span>
  );
};

export default CountryFlag;