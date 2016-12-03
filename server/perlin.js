import {config} from '../config'

var CONSTANT = 2147483647,
    DIFF = 0.4999,
    PERLIN_SIZER = 2
//     c = document.getElementById('myCanvas'),
//     ctx = c.getContext('2d'),
//     imgData = ctx.createImageData(c.width, c.height),
//     x, y, i, p, d = [], t, PRNG, primes, perlin, map;
//
PRNG = Math.round(Math.random() * CONSTANT);
// perlin = new Perlin(
// 	Math.ceil(20), // width
//   Math.ceil(20), // height
//   PRNG, // seed
//   0.30, // persistence
//   2, // octaves
//   15 // zoom
// );
//
// map = perlin.build(true);

function buildArray (w, h, v) {
    var a = new Array(h),
        v = v || 0,
        x, y;

    for (y = 0; y < h; y++) {
        a[y] = new Array(w);

        for (x = 0; x < w; x++) {
            a[y][x] = v;
        }
    }

    return a;
}

function cosineInterpolate (a, b, x) {
    var ft = x * Math.PI,
        f = (1 - Math.cos(ft)) * 0.5;

    return a * (1 - f) + b * f;
}

function PM_PRNG(seed) {
    this.seed = seed || 1;
}

PM_PRNG.prototype.gen = function () {
    this.seed = (this.seed * 16807) % CONSTANT;
    return this.seed;
};

PM_PRNG.prototype.nextInt = function () {
    return this.gen();
};

PM_PRNG.prototype.nextDouble = function () {
    return (this.gen() / CONSTANT);
};

PM_PRNG.prototype.nextIntRange = function (min, max) {
    var dbl = this.nextDouble();
    min = min - DIFF;
    max = max - DIFF;
    return Math.round(min + ((max - min) * dbl));
};

PM_PRNG.prototype.nextDoubleRange = function (min, max) {
    var dbl = this.nextDouble();
    return min + ((max - min) * this.nextDouble());
};

PM_PRNG.prototype.nextPrime = function () {
    var n, i, prime = false;

    while (true) {
        n = this.nextIntRange(57, 9973);

        if (millerRabinPrimeTest(n)) { return n; }
    }
};

PM_PRNG.prototype.noise2D = function (prime) {
    if (!prime) { prime = this.nextPrime(); }

    return function (x, y) {
        var n = Math.floor(x) + Math.floor(y) * prime,
            nn;
        n = (n >> 13) ^ n;
        nn = (n * (n * n * 60493 + 19990303) + 1376312589) & 0x7fffffff;
        return 1.0 - (nn / 1073741824.0);
    }
}

function divMod(a, b) {
    return [Math.floor(a / b), a % b];
}

function powerMod(a, b, m) {
    if (b < -1) {
        return Math.pow(a, b) % m;
    }
    if (b === 0) {
        return 1 % m;
    }
    if (b >= 1) {
        var result = 1;
        while (b > 0) {
            if ((b % 2) === 1) {
                result = (result * a) % m;
            }

            a = (a * a) % m;
            b = b >> 1;
        }
        return result;
    }

    if (b === -1) return modInverse(a, m);
    if (b < 1) {
        return powerMod(a, Math.pow(b, -1), m);
    }
}

function egcd(a, b) {
    var x = (+b && +a) ? 1 : 0,
        y = b ? 0 : 1,
        u = (+b && +a) ? 0 : 1,
        v = b ? 1 : 0;

    b = (+b && +a) ? +b : 0;
    a = b ? a : 1;

    while (b) {
        var dm = divMod(a, b),
            q = dm[0],
            r = dm[1];

        var m = x - u * q,
            n = y - v * q;

        a = b;
        b = r;
        x = u;
        y = v;
        u = m;
        v = n;
    }

    return [a, x, y];
};

function modInverse(a, m) {
    var r = egcd(a, m);
    return r[1] % m;
};

function millerRabinPrimeTest(n, k) {
    if (arguments.length === 1) {
        k = 20;
    }
    if (n === 2) {
        return true;
    }
    if (n <= 1 || n % 2 === 0) {
        return false;
    }

    var s = 0,
        d = n - 1,
        dm, quotient, remainder;

    while (true) {
        dm = divMod(d, 2);
        quotient = dm[0];
        remainder = dm[1];

        if (remainder === 1) {
            break;
        }
        s += 1;
        d = quotient;
    }

    var tryComposite = function (a) {
        if (powerMod(a, d, n) === 1) return false;

        for (var i = 0; i < s; i++) {
            if (powerMod(a, Math.pow(2, i) * d, n) === n - 1) { return false; }
        }

        return true;
    }

    for (var i = 0; i < k; i++) {
        var a = 2 + Math.floor(Math.random() * (n - 2 - 2));
        if (tryComposite(a)) return false;
    }

    return true;
};

export function Perlin (w, h, s, p, o, z) {
    this.width = w;
    this.height = h;
    this.seed = s;
    this.persistence = p;
    this.octaves = o;
    this.zoom = z;

    this.PRNG = new PM_PRNG(s);
    this.noise = this.PRNG.noise2D(this.PRNG.nextPrime());
    this.map = buildArray(w, h);
}

Perlin.prototype.smooth = function (x, y) {
    var corners, sides, center;

    corners = (this.noise(x - 1, y - 1) + this.noise(x + 1, y - 1) + this.noise(x - 1, y + 1) + this.noise(x + 1, y + 1)) / 16;
    sides = (this.noise(x - 1, y) + this.noise(x + 1, y) + this.noise(x, y - 1) + this.noise(x, y + 1)) / 8;
    center = this.noise(x, y) / 4;

    return corners + sides + center;
};

Perlin.prototype.interpolate = function (x, y) {
    var integer_X = Math.floor(x),
        fractional_X = x - integer_X,
        integer_Y = Math.floor(y),
        fractional_Y = y - integer_Y,

        v1 = this.smooth(integer_X, integer_Y),
        v2 = this.smooth(integer_X + 1, integer_Y),
        v3 = this.smooth(integer_X, integer_Y + 1),
        v4 = this.smooth(integer_X + 1, integer_Y + 1),

        i1 = cosineInterpolate(v1, v2, fractional_X),
        i2 = cosineInterpolate(v3, v4, fractional_X);

    return cosineInterpolate(i1, i2, fractional_Y);
};

Perlin.prototype.calculate = function (x, y, octave) {
    var total = 0,
        o = octave,
        p = this.persistence,
        frequency, amplitude;

    frequency = Math.pow(2, o);
    amplitude = Math.pow(p, o);
    return this.interpolate(x * frequency, y * frequency) * amplitude;
};

Perlin.prototype.build = function (normalize) {
    var w = this.width,
        h = this.height,
        o = this.octaves,
        z = this.zoom,
        i, x, y;

    for (i = 0; i < o - 1; i++) {
        if (i > 0) { this.noise = this.PRNG.noise2D(this.PRNG.nextPrime()); }

        for (y = 0; y < h; y++) {
            for (x = 0; x < w; x++) {
                this.map[y][x] += this.calculate(x / z, y / z, i);
            }
        }
    }

    if (!normalize) { return this.out; }

    return this.normalize();
};

Perlin.prototype.calculateTotalAmplitude = function() {
    var p = this.persistence,
        i, amp, totalAmp = 0;

    for (i = 0; i < this.octaves - 1; i++) {
        amp = Math.pow(p, i);
        totalAmp += amp;
    }

    return totalAmp;
};

Perlin.prototype.normalize = function () {
    var out = Array.prototype.slice.call(this.map),
        t = this.calculateTotalAmplitude(),
        w = this.width,
        h = this.height,
        x, y;

    for (y = 0; y < h; y++) {
        for (x = 0; x < w; x++) {
            out[y][x] = this.map[y][x] / t;
        }
    }

    return out;
};

// console.log('map', map)
// for (y = 0; y < imgData.height; y++) {
//     for (x = 0; x < imgData.width; x++) {
//         i = ((y * c.width) + x) * 4;
//         t = map[Math.floor(y / 5)][Math.floor(x / 5)];
//         p = Math.abs(t * 256);
//
//         imgData.data[i] = p;
//         imgData.data[i + 1] = p;
//         imgData.data[i + 2] = p;
//         imgData.data[i + 3] = 255;
//     }
// }
//
// ctx.putImageData(imgData, 0, 0);
