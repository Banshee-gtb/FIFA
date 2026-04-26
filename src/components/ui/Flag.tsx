interface FlagProps {
  code: string; // ISO 3166-1 alpha-2
  size?: number;
  className?: string;
}

// Map team names / codes to ISO alpha-2 country codes
export const TEAM_FLAG_CODES: Record<string, string> = {
  // CONCACAF
  'USA': 'us',
  'Mexico': 'mx',
  'Canada': 'ca',
  'Costa Rica': 'cr',
  'Panama': 'pa',
  'Honduras': 'hn',
  // UEFA
  'Argentina': 'ar',
  'Brazil': 'br',
  'France': 'fr',
  'Spain': 'es',
  'England': 'gb-eng',
  'Germany': 'de',
  'Portugal': 'pt',
  'Netherlands': 'nl',
  'Italy': 'it',
  'Belgium': 'be',
  'Croatia': 'hr',
  'Switzerland': 'ch',
  'Denmark': 'dk',
  'Turkey': 'tr',
  'Austria': 'at',
  'Ukraine': 'ua',
  'Serbia': 'rs',
  'Poland': 'pl',
  'Greece': 'gr',
  'Czech Republic': 'cz',
  'Slovakia': 'sk',
  // AFC
  'Japan': 'jp',
  'South Korea': 'kr',
  'Saudi Arabia': 'sa',
  'Australia': 'au',
  'Iran': 'ir',
  'China PR': 'cn',
  'Indonesia': 'id',
  // CAF
  'Morocco': 'ma',
  'Senegal': 'sn',
  'Ghana': 'gh',
  'Nigeria': 'ng',
  'Egypt': 'eg',
  'Cameroon': 'cm',
  // CONMEBOL
  'Uruguay': 'uy',
  'Colombia': 'co',
  'Ecuador': 'ec',
  'Chile': 'cl',
  'Paraguay': 'py',
  'Venezuela': 've',
  // OFC
  'New Zealand': 'nz',
  // TBD
  'TBD': '',
};

export default function Flag({ code, size = 32, className = '' }: FlagProps) {
  if (!code) {
    return (
      <div
        className={`inline-flex items-center justify-center bg-gray-200 rounded ${className}`}
        style={{ width: size * 1.4, height: size * 0.85, fontSize: size * 0.45 }}
      >
        <span className="text-gray-400 font-bold">?</span>
      </div>
    );
  }

  return (
    <img
      src={`https://flagcdn.com/w${size >= 48 ? '80' : '40'}/${code.toLowerCase()}.png`}
      srcSet={`https://flagcdn.com/w${size >= 48 ? '160' : '80'}/${code.toLowerCase()}.png 2x`}
      width={size * 1.4}
      height={size * 0.85}
      alt={code}
      className={`object-cover rounded shadow-sm ${className}`}
      loading="lazy"
      onError={(e) => {
        (e.target as HTMLImageElement).style.display = 'none';
      }}
    />
  );
}

export function TeamFlag({ teamName, size = 32, className = '' }: { teamName: string; size?: number; className?: string }) {
  const code = TEAM_FLAG_CODES[teamName] ?? '';
  return <Flag code={code} size={size} className={className} />;
}
