// 🔧 SPHERE DISPLAY FIX
// Add this helper component to properly display spheres

// Helper function to format sphere data for display
export function formatSphereData(spheres: any): string {
  if (!spheres) return 'No spheres';
  
  // If it's an array (multiple combinations)
  if (Array.isArray(spheres)) {
    return spheres.map((combo, index) => {
      const sphereStr = Object.entries(combo)
        .map(([sphere, level]) => `${sphere} ${level}`)
        .join(', ');
      return spheres.length > 1 ? `Option ${index + 1}: ${sphereStr}` : sphereStr;
    }).join(' OR ');
  }
  
  // If it's an object (single combination)
  if (typeof spheres === 'object') {
    return Object.entries(spheres)
      .map(([sphere, level]) => `${sphere} ${level}`)
      .join(', ');
  }
  
  return 'Invalid sphere data';
}

// Component to display spheres properly
export function SphereDisplay({ spheres }: { spheres: any }) {
  const formatted = formatSphereData(spheres);
  
  // If multiple combinations, show with OR
  if (formatted.includes(' OR ')) {
    const options = formatted.split(' OR ');
    return (
      <div className="space-y-1">
        {options.map((option, index) => (
          <div key={index} className="text-sm">
            {option}
          </div>
        ))}
      </div>
    );
  }
  
  // Single combination
  return <span>{formatted}</span>;
}

// Usage in your rote card/display:
/*
// BEFORE (causes error):
<div>Spheres: {rote.spheres}</div>

// AFTER (works correctly):
<div>Spheres: <SphereDisplay spheres={rote.spheres} /></div>

// OR just use the function:
<div>Spheres: {formatSphereData(rote.spheres)}</div>
*/
