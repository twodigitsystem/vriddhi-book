export interface StateWithGST {
  label: string;
  value: string;
  gstCode: string;
}

export const statesWithGST: StateWithGST[] = [
  { label: 'Andaman and Nicobar Islands', value: 'andaman-and-nicobar-islands', gstCode: '35' },
  { label: 'Andhra Pradesh', value: 'andhra-pradesh', gstCode: '37' },
  { label: 'Arunachal Pradesh', value: 'arunachal-pradesh', gstCode: '12' },
  { label: 'Assam', value: 'assam', gstCode: '18' },
  { label: 'Bihar', value: 'bihar', gstCode: '10' },
  { label: 'Chandigarh', value: 'chandigarh', gstCode: '04' },
  { label: 'Chhattisgarh', value: 'chhattisgarh', gstCode: '22' },
  { label: 'Dadra and Nagar Haveli and Daman and Diu', value: 'dadra-and-nagar-haveli-and-daman-and-diu', gstCode: '26' },
  { label: 'Delhi', value: 'delhi', gstCode: '07' },
  { label: 'Goa', value: 'goa', gstCode: '30' },
  { label: 'Gujarat', value: 'gujarat', gstCode: '24' },
  { label: 'Haryana', value: 'haryana', gstCode: '06' },
  { label: 'Himachal Pradesh', value: 'himachal-pradesh', gstCode: '02' },
  { label: 'Jammu and Kashmir', value: 'jammu-and-kashmir', gstCode: '01' },
  { label: 'Jharkhand', value: 'jharkhand', gstCode: '20' },
  { label: 'Karnataka', value: 'karnataka', gstCode: '29' },
  { label: 'Kerala', value: 'kerala', gstCode: '32' },
  { label: 'Ladakh', value: 'ladakh', gstCode: '38' },
  { label: 'Lakshadweep', value: 'lakshadweep', gstCode: '31' },
  { label: 'Madhya Pradesh', value: 'madhya-pradesh', gstCode: '23' },
  { label: 'Maharashtra', value: 'maharashtra', gstCode: '27' },
  { label: 'Manipur', value: 'manipur', gstCode: '14' },
  { label: 'Meghalaya', value: 'meghalaya', gstCode: '17' },
  { label: 'Mizoram', value: 'mizoram', gstCode: '15' },
  { label: 'Nagaland', value: 'nagaland', gstCode: '13' },
  { label: 'Odisha', value: 'odisha', gstCode: '21' },
  { label: 'Puducherry', value: 'puducherry', gstCode: '34' },
  { label: 'Punjab', value: 'punjab', gstCode: '03' },
  { label: 'Rajasthan', value: 'rajasthan', gstCode: '08' },
  { label: 'Sikkim', value: 'sikkim', gstCode: '11' },
  { label: 'Tamil Nadu', value: 'tamil-nadu', gstCode: '33' },
  { label: 'Telangana', value: 'telangana', gstCode: '36' },
  { label: 'Tripura', value: 'tripura', gstCode: '16' },
  { label: 'Uttar Pradesh', value: 'uttar-pradesh', gstCode: '09' },
  { label: 'Uttarakhand', value: 'uttarakhand', gstCode: '05' },
  { label: 'West Bengal', value: 'west-bengal', gstCode: '19' },
  { label: 'Other Territory', value: 'other-territory', gstCode: '97' },
  { label: 'Centre Jurisdiction', value: 'centre-jurisdiction', gstCode: '99' }
];

// For backward compatibility
export const indianStates = statesWithGST.map(state => state.label) as readonly string[];