//https://stackoverflow.com/a/47593316
const xmur3 = function(str: string): Function {
	const length = str.length;
	let i = 0;
	let h = 1779033703 ^ length;

	for (; i < length; i++) {
		h = Math.imul(h ^ str.charCodeAt(i), 3432918353),
		h = h << 13 | h >>> 19;
	}

	return function() {
		h = Math.imul(h ^ h >>> 16, 2246822507);
		h = Math.imul(h ^ h >>> 13, 3266489909);
		return (h ^= h >>> 16) >>> 0;
	};
};

const mulberry32 = function(a: number): Function {
	return function() {
		let t = a += 0x6D2B79F5;
		t = Math.imul(t ^ t >>> 15, t | 1);
		t ^= t + Math.imul(t ^ t >>> 7, t | 61);
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	};
};

const generators: Map<string, Function> = new Map();

export default function(seedId: any): number {
	if (seedId) {
		const seedStr = seedId.toString();
		let generator;

		if (!generators.has(seedStr)) {
			generator = mulberry32(xmur3(seedStr)());
			generators.set(seedStr, generator);
		} else {
			generator = generators.get(seedStr);
		}

		return generator();
	}

	return Math.random();
};