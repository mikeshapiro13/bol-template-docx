
import { readFileSync } from 'node:fs';

const productCatalogs = JSON.parse(readFileSync('./data/products.json', 'utf8'));

const catalog = productCatalogs['Coca-Cola'];
let hasFailure = false;

if (!catalog) {
    console.error('FAIL: Coca-Cola catalog not found.');
    process.exit(1);
}

console.log(`PASS: Coca-Cola catalog found with ${catalog.length} products.`);

const group1Sample = catalog.find(p => p.code === '115583');
if (group1Sample && group1Sample.casesPerPallet === 104) {
    console.log('PASS: Group 1 product (Coca-Cola) has correct casesPerPallet (104).');
} else {
    console.error('FAIL: Group 1 product verification failed.');
    hasFailure = true;
}

const group2Sample = catalog.find(p => p.code === '101728');
if (group2Sample && group2Sample.casesPerPallet === 54) {
    console.log('PASS: Group 2 product (Powerade) has correct casesPerPallet (54).');
} else {
    console.error('FAIL: Group 2 product verification failed.');
    hasFailure = true;
}

const totalExpected = 33 + 5;
if (catalog.length === totalExpected) {
    console.log(`PASS: Total product count matches expected (${totalExpected}).`);
} else {
    console.error(`FAIL: Expected ${totalExpected} products, found ${catalog.length}.`);
    hasFailure = true;
}

if (hasFailure) {
    process.exit(1);
}
