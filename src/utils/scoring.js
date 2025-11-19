exports.calculate = (lead) => {
  // Simple deterministic score: if source is Referral => Hot, Website => Warm, else Cold
  if (!lead) return 'Cold';
  if (lead.source === 'Referral') return 'Hot';
  if (lead.source === 'Website') return 'Warm';
  return 'Cold';
};
