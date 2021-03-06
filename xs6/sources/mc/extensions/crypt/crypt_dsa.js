/*
 *     Copyright (C) 2010-2015 Marvell International Ltd.
 *     Copyright (C) 2002-2010 Kinoma, Inc.
 *
 *     Licensed under the Apache License, Version 2.0 (the "License");
 *     you may not use this file except in compliance with the License.
 *     You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *     Unless required by applicable law or agreed to in writing, software
 *     distributed under the License is distributed on an "AS IS" BASIS,
 *     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *     See the License for the specific language governing permissions and
 *     limitations under the License.
 */
import Crypt from "crypt";

export default class DSA {
	constructor(key, priv) {
		this.x = priv ? key.x : key.y;
		this.g = key.g;
		this.z = new Arith.Z();
		this.p = new Arith.Module(this.z, key.p);
		this.q = new Arith.Module(this.z, key.q);
	};
	_sign(H) {
		// r = (g^k mod p) mod q
		// s = (SHA_1(M) + xr)/k mod q
		var p = this.p;
		var q = this.q;
		var g = this.g;
		var x = this.x;
		var k = this.randint(q.m, this.z);
		var r = q.mod(p.exp(g, k));
		var H = new Arith.Integer(H);
		var s = q.mul(q.mulinv(k), q.add(H, q.mul(x, r)));
		var sig = new Object;
		sig.r = r;
		sig.s = s;
		return sig;
	};
	sign(H) {
		var sig = this._sign(H);
		var os = new ArrayBuffer();
		return os.concat(Crypt.PKCS1.I2OSP(sig.r, 20), Crypt.PKCS1.I2OSP(sig.s, 20));
	};
	_verify(H, r, s) {
		// w = 1/s mod q
		// u1 = (SHA_1(M) * w) mod q
		// u2 = rw mod q
		// v = (g^u1 * y^u2 mod p) mod q
		var p = this.p;
		var q = this.q;
		var g = this.g;
		var y = this.x;		// as the public key
		var w = q.mulinv(s);
		var h = new Arith.Integer(H);
		var u1 = q.mul(h, w);
		var u2 = q.mul(r, w);
		var v = q.mod(p.exp2(g, u1, y, u2));
		return this.comp(v, r) == 0;
	};
	verify(H, sig) {
		// "20" is specified in the xmldsig-core spec.
		var r = Crypt.PKCS1.OS2IP(sig.slice(0, 20));
		var s = Crypt.PKCS1.OS2IP(sig.slice(20, 40));
		return(this._verify(H, r, s));
	};
};
