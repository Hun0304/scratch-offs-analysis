const SCALE = 1000000n;
const DEN = SCALE * 1000n;
export function integer(value, name, min = 0, max = 999999) {
  if (!/^\d+$/.test(String(value).trim())) throw new Error(name + '請輸入整數。');
  const n = Number(value);
  if (!Number.isSafeInteger(n) || n < min || n > max) throw new Error(name + '須介於 ' + min + '～' + max + '。');
  return n;
}
export function decimalText(numerator, denominator) {
  const fraction = (numerator % denominator).toString().padStart(denominator.toString().length - 1, '0').replace(/0+$/, '');
  return String(numerator / denominator) + (fraction ? '.' + fraction : '');
}
export function parsePercent(value) {
  const text = String(value).trim();
  if (!/^\d+(\.\d{1,6})?$/.test(text)) throw new Error('中獎率請輸入 0～100，最多六位小數。');
  const [whole, fraction = ''] = text.split('.');
  const p = BigInt(whole) * SCALE + BigInt(fraction.padEnd(6, '0'));
  if (p > 100n * SCALE) throw new Error('中獎率須介於 0%～100%。');
  return p;
}
export function calculate(form) {
  const a = integer(form.a, 'A'), b = integer(form.b, 'B'), c = integer(form.c, 'C');
  const total = a + b + c, p = parsePercent(form.rate);
  const k = integer(form.k, '倍數 N', 1, 10000), count = integer(form.count, '批次次數', 1, 1000);
  const min = integer(form.min, '票號下限'), max = integer(form.max, '票號上限');
  if (min > max) throw new Error('票號下限不能大於上限。');
  const row = n => {
    const coefficient = p * BigInt(10 + n), numerator = BigInt(total) * coefficient;
    const floor = Number(numerator / DEN), ceil = Number((numerator + DEN - 1n) / DEN);
    return { n, coefficient: decimalText(coefficient, DEN), value: decimalText(numerator, DEN), rounded: [...new Set([floor, ceil])], candidates: [...new Set([floor, ceil])].filter(x => x >= min && x <= max) };
  };
  const rows = Array.from({length: count}, (_,i) => row(i+1));
  return { a,b,c,total,k,count,min,max,rate:decimalText(p,SCALE*100n),percent:decimalText(p,SCALE),step:decimalText(p,DEN),selected:row(k),rows,unique:[...new Set(rows.flatMap(x=>x.candidates))].sort((x,y)=>x-y) };
}
export function compareBudget(budget, prices) {
  const available = integer(budget, '預算', 0, 10000000);
  return prices.map(price => { const amount=integer(price,'每張價格',1,10000000),quantity=Math.floor(available/amount); return {price:amount,quantity,cost:quantity*amount,remaining:available-quantity*amount}; });
}
export function randomNumbers(minimum, maximum, amount, random = crypto) {
  const min=integer(minimum,'票號下限'),max=integer(maximum,'票號上限'),count=integer(amount,'挑選數量',1,1000);
  const size=max-min+1;
  if(size<=0)throw new Error('票號下限不能大於上限。');
  if(count>size)throw new Error('挑選數量不能超過範圍內的票號數量。');
  const selected=new Set(),cap=Math.floor(4294967296/size)*size,buffer=new Uint32Array(1);
  while(selected.size<count){random.getRandomValues(buffer);if(buffer[0]<cap)selected.add(min+buffer[0]%size);}
  return [...selected].sort((a,b)=>a-b);
}
