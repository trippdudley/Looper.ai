interface Attribute {
  attribute: string;
  category: string;
  sources: string[];
  freshness: string;
  monetizationRelevance: string;
}

interface DataCatalogTableProps {
  attributes: Attribute[];
}

const relevanceColors: Record<string, string> = {
  high: 'text-accent-light',
  medium: 'text-warm-amber',
  low: 'text-gray-400',
};

export default function DataCatalogTable({ attributes }: DataCatalogTableProps) {
  return (
    <div className="bg-card-dark rounded-2xl overflow-hidden border border-border-dark">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-dark">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Attribute
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Category
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Sources
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Freshness
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Monetization
              </th>
            </tr>
          </thead>
          <tbody>
            {attributes.map((attr, i) => {
              const relColor = relevanceColors[attr.monetizationRelevance.toLowerCase()] || 'text-gray-400';
              return (
                <tr
                  key={i}
                  className="border-b border-border-dark last:border-b-0 hover:bg-border-dark/30 transition-colors"
                >
                  <td className="px-4 py-3 text-white font-medium">{attr.attribute}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-border-dark text-gray-300 px-2 py-0.5 rounded-full">
                      {attr.category}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {attr.sources.map((s) => (
                        <span key={s} className="text-xs text-gray-400">
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">{attr.freshness}</td>
                  <td className={`px-4 py-3 text-xs font-semibold uppercase ${relColor}`}>
                    {attr.monetizationRelevance}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
