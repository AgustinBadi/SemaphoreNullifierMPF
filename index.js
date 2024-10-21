import { Trie, Store } from '@aiken-lang/merkle-patricia-forestry';
import blake2b from 'blake2b';
import * as buffer from 'node:buffer';
import util from 'node:util';


 const DIGEST_LENGTH = 32; // Number of bytes of the diggest function

// This would result in a blake2b_256() function
 function digest(msg) {
  return Buffer.from(
    blake2b(DIGEST_LENGTH)
      .update(msg)
      .digest()
  );
}

// Create a new db
const trie = new Trie(new Store('db'));
// contruct a bigInt from the nullifier value.
var nullifier = BigInt("18357242067865281585448401029732015934400637534018503292192114001988596022544");
console.log(nullifier);
// If number is too big, we need to calculate how many bytes are needed to store it.
const byteLength = Math.ceil(nullifier.toString(16).length / 2); // Length calculation.

// Create the buffer
var buffer_0 = Buffer.alloc(byteLength);

// Fill Buffer_0 with the nullifier value
let i = 0;
while (nullifier > 0) {
  buffer_0[i++] = Number(nullifier & BigInt(0xff)); // We storage the bytes into the buffer from low to high (Little Endian)
  nullifier >>= BigInt(8); // We shift the number to the right to extract the next byte  
}

console.log(buffer_0);  // Show the nullifer value stored on the buffer with bytes.
console.log(digest(buffer_0)); // A blake2b_256 diggest of the nullifier.
await trie.insert(digest(buffer_0), buffer_0); // Insert key and value into the trie
console.log(trie.hash) // Log the root hash of the tree.

//console.log(trie);
//console.log(util.inspect(trie, { showHidden: true, depth: null, colors: true }));

// Create and log the proof of the inserted value.
const proofTangerine = await trie.prove(digest(buffer_0));
console.log(util.inspect(proofTangerine.toAiken(), { showHidden: true, depth: null, colors: true }));