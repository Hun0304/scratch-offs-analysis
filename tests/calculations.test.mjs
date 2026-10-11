import test from 'node:test';
import assert from 'node:assert/strict';
import { calculate, compareBudget, randomNumbers } from '../src/calculations.js';
const defaults={a:'03',b:'43',c:'91',rate:'30',k:'3',count:'30',min:'0',max:'99'};
test('30% uses a 0.03 step, matches Python and generates all 30 rows',()=>{
 const result=calculate(defaults);
 assert.equal(result.total,137);assert.equal(result.step,'0.03');assert.equal(result.selected.value,'53.43');assert.deepEqual(result.selected.candidates,[53,54]);assert.equal(result.rows.length,30);
});
test('rate and step change together; arbitrary precision input stays exact',()=>{
 const result=calculate({...defaults,rate:'33'});
 assert.equal(result.step,'0.033');assert.equal(result.selected.value,'58.773');
 assert.equal(calculate({...defaults,rate:'30.123456'}).step,'0.030123456');
});
test('invalid input, fractional N, backwards bounds and invalid percentages fail',()=>{
 for(const replacement of [{a:'1.5'},{rate:'101'},{rate:'NaN'},{k:'0'},{k:'2.5'},{count:'1001'},{min:'99',max:'0'}])assert.throws(()=>calculate({...defaults,...replacement}));
});
test('exact integer candidates are deduplicated, bounds filter without wrapping',()=>{
 assert.deepEqual(calculate({...defaults,rate:'0'}).selected.candidates,[0]);
 assert.deepEqual(calculate({...defaults,min:'54',max:'54'}).selected.candidates,[54]);
 assert.deepEqual(calculate({...defaults,k:'30'}).selected.candidates,[]);
});
test('budget respects the spending limit and supports a custom price',()=>{
 assert.deepEqual(compareBudget('1000',[300])[0],{price:300,quantity:3,cost:900,remaining:100});
 assert.throws(()=>compareBudget('1000',[0]));
});
test('random picks never repeat or leave range and impossible requests fail',()=>{
 let value=0;const mock={getRandomValues(buffer){buffer[0]=value++;return buffer;}};
 assert.deepEqual(randomNumbers('10','14','5',mock),[10,11,12,13,14]);
 assert.throws(()=>randomNumbers('0','1','3',mock));
 assert.throws(()=>randomNumbers('2','1','1',mock));
});
