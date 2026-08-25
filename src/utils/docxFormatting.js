export const formatAddress = (obj) => {
  if (!obj) return [];
  const lines = [obj.name, obj.address];
  const cityStateZip = `${obj.city || ''}${obj.city && obj.state ? ', ' : ''}${obj.state || ''} ${obj.zip || ''}`.trim();
  if (cityStateZip) lines.push(cityStateZip);
  return lines.filter(Boolean);
};
