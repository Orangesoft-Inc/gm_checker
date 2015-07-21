/*
	md5
	Copyright (C) 2007 MITSUNARI Shigeo at Cybozu Labs, Inc.
	license:new BSD license
	how to use
	CBI.md5.calc(<ascii string>);
	CBI.md5.calc(<unicode(UTF16) string>, CBI.md5.BY_UTF16);
	ex. CBI.md5.calc("abc") == "900150983cd24fb0d6963f7d28e17f72";
*/
var CBI = {
	md5: {
		update_Fx : function(Z, len) {
			var aL = this.a_[0], aH = this.a_[1], bL = this.b_[0], bH = this.b_[1],
				cL = this.c_[0], cH = this.c_[1], dL = this.d_[0], dH = this.d_[1];
			var wl0, wl1, wl2, wl3, wl4, wl5, wl6, wl7, wl8, wl9, wla, wlb, wlc, wld, wle, wlf,
				wh0, wh1, wh2, wh3, wh4, wh5, wh6, wh7, wh8, wh9, wha, whb, whc, whd, whe, whf, t;
			if (len == 1) {
				wl0 = Z.charCodeAt( 0) | (Z.charCodeAt( 1) << 8); wh0 = Z.charCodeAt( 2) | (Z.charCodeAt( 3) << 8);
				wl1 = Z.charCodeAt( 4) | (Z.charCodeAt( 5) << 8); wh1 = Z.charCodeAt( 6) | (Z.charCodeAt( 7) << 8);
				wl2 = Z.charCodeAt( 8) | (Z.charCodeAt( 9) << 8); wh2 = Z.charCodeAt(10) | (Z.charCodeAt(11) << 8);
				wl3 = Z.charCodeAt(12) | (Z.charCodeAt(13) << 8); wh3 = Z.charCodeAt(14) | (Z.charCodeAt(15) << 8);
				wl4 = Z.charCodeAt(16) | (Z.charCodeAt(17) << 8); wh4 = Z.charCodeAt(18) | (Z.charCodeAt(19) << 8);
				wl5 = Z.charCodeAt(20) | (Z.charCodeAt(21) << 8); wh5 = Z.charCodeAt(22) | (Z.charCodeAt(23) << 8);
				wl6 = Z.charCodeAt(24) | (Z.charCodeAt(25) << 8); wh6 = Z.charCodeAt(26) | (Z.charCodeAt(27) << 8);
				wl7 = Z.charCodeAt(28) | (Z.charCodeAt(29) << 8); wh7 = Z.charCodeAt(30) | (Z.charCodeAt(31) << 8);
				wl8 = Z.charCodeAt(32) | (Z.charCodeAt(33) << 8); wh8 = Z.charCodeAt(34) | (Z.charCodeAt(35) << 8);
				wl9 = Z.charCodeAt(36) | (Z.charCodeAt(37) << 8); wh9 = Z.charCodeAt(38) | (Z.charCodeAt(39) << 8);
				wla = Z.charCodeAt(40) | (Z.charCodeAt(41) << 8); wha = Z.charCodeAt(42) | (Z.charCodeAt(43) << 8);
				wlb = Z.charCodeAt(44) | (Z.charCodeAt(45) << 8); whb = Z.charCodeAt(46) | (Z.charCodeAt(47) << 8);
				wlc = Z.charCodeAt(48) | (Z.charCodeAt(49) << 8); whc = Z.charCodeAt(50) | (Z.charCodeAt(51) << 8);
				wld = Z.charCodeAt(52) | (Z.charCodeAt(53) << 8); whd = Z.charCodeAt(54) | (Z.charCodeAt(55) << 8);
				wle = Z.charCodeAt(56) | (Z.charCodeAt(57) << 8); whe = Z.charCodeAt(58) | (Z.charCodeAt(59) << 8);
				wlf = Z.charCodeAt(60) | (Z.charCodeAt(61) << 8); whf = Z.charCodeAt(62) | (Z.charCodeAt(63) << 8);
			} else {
				wl0 = Z.charCodeAt( 0); wh0 = Z.charCodeAt( 1);
				wl1 = Z.charCodeAt( 2); wh1 = Z.charCodeAt( 3);
				wl2 = Z.charCodeAt( 4); wh2 = Z.charCodeAt( 5);
				wl3 = Z.charCodeAt( 6); wh3 = Z.charCodeAt( 7);
				wl4 = Z.charCodeAt( 8); wh4 = Z.charCodeAt( 9);
				wl5 = Z.charCodeAt(10); wh5 = Z.charCodeAt(11);
				wl6 = Z.charCodeAt(12); wh6 = Z.charCodeAt(13);
				wl7 = Z.charCodeAt(14); wh7 = Z.charCodeAt(15);
				wl8 = Z.charCodeAt(16); wh8 = Z.charCodeAt(17);
				wl9 = Z.charCodeAt(18); wh9 = Z.charCodeAt(19);
				wla = Z.charCodeAt(20); wha = Z.charCodeAt(21);
				wlb = Z.charCodeAt(22); whb = Z.charCodeAt(23);
				wlc = Z.charCodeAt(24); whc = Z.charCodeAt(25);
				wld = Z.charCodeAt(26); whd = Z.charCodeAt(27);
				wle = Z.charCodeAt(28); whe = Z.charCodeAt(29);
				wlf = Z.charCodeAt(30); whf = Z.charCodeAt(31);
			}

			aL += ((bL & cL) | (~bL & dL)) + wl0 + 0xa478; aH += ((bH & cH) | (~bH & dH)) + wh0 + 0xd76a;
			aH += aL >> 16;
			aL &= 65535; aH &= 65535;
			t = (aH >>  9) | ((aL <<  7) & 65535); aH = (aL >>  9) | ((aH <<  7) & 65535);
			aL = t + bL; aH += bH; if (aL > 65535) { aL &= 65535; aH++; }
			aH &= 65535;
			dL += ((aL & bL) | (~aL & cL)) + wl1 + 0xb756; dH += ((aH & bH) | (~aH & cH)) + wh1 + 0xe8c7;
			dH += dL >> 16;
			dL &= 65535; dH &= 65535;
			t = (dH >>  4) | ((dL << 12) & 65535); dH = (dL >>  4) | ((dH << 12) & 65535);
			dL = t + aL; dH += aH; if (dL > 65535) { dL &= 65535; dH++; }
			dH &= 65535;
			cL += ((dL & aL) | (~dL & bL)) + wl2 + 0x70db; cH += ((dH & aH) | (~dH & bH)) + wh2 + 0x2420;
			cH += cL >> 16;
			cL &= 65535; cH &= 65535;
			t = (cL >> 15) | ((cH <<  1) & 65535); cH = (cH >> 15) | ((cL <<  1) & 65535);
			cL = t + dL; cH += dH; if (cL > 65535) { cL &= 65535; cH++; }
			cH &= 65535;
			bL += ((cL & dL) | (~cL & aL)) + wl3 + 0xceee; bH += ((cH & dH) | (~cH & aH)) + wh3 + 0xc1bd;
			bH += bL >> 16;
			bL &= 65535; bH &= 65535;
			t = (bL >> 10) | ((bH <<  6) & 65535); bH = (bH >> 10) | ((bL <<  6) & 65535);
			bL = t + cL; bH += cH; if (bL > 65535) { bL &= 65535; bH++; }
			bH &= 65535;
			aL += ((bL & cL) | (~bL & dL)) + wl4 + 0x0faf; aH += ((bH & cH) | (~bH & dH)) + wh4 + 0xf57c;
			aH += aL >> 16;
			aL &= 65535; aH &= 65535;
			t = (aH >>  9) | ((aL <<  7) & 65535); aH = (aL >>  9) | ((aH <<  7) & 65535);
			aL = t + bL; aH += bH; if (aL > 65535) { aL &= 65535; aH++; }
			aH &= 65535;
			dL += ((aL & bL) | (~aL & cL)) + wl5 + 0xc62a; dH += ((aH & bH) | (~aH & cH)) + wh5 + 0x4787;
			dH += dL >> 16;
			dL &= 65535; dH &= 65535;
			t = (dH >>  4) | ((dL << 12) & 65535); dH = (dL >>  4) | ((dH << 12) & 65535);
			dL = t + aL; dH += aH; if (dL > 65535) { dL &= 65535; dH++; }
			dH &= 65535;
			cL += ((dL & aL) | (~dL & bL)) + wl6 + 0x4613; cH += ((dH & aH) | (~dH & bH)) + wh6 + 0xa830;
			cH += cL >> 16;
			cL &= 65535; cH &= 65535;
			t = (cL >> 15) | ((cH <<  1) & 65535); cH = (cH >> 15) | ((cL <<  1) & 65535);
			cL = t + dL; cH += dH; if (cL > 65535) { cL &= 65535; cH++; }
			cH &= 65535;
			bL += ((cL & dL) | (~cL & aL)) + wl7 + 0x9501; bH += ((cH & dH) | (~cH & aH)) + wh7 + 0xfd46;
			bH += bL >> 16;
			bL &= 65535; bH &= 65535;
			t = (bL >> 10) | ((bH <<  6) & 65535); bH = (bH >> 10) | ((bL <<  6) & 65535);
			bL = t + cL; bH += cH; if (bL > 65535) { bL &= 65535; bH++; }
			bH &= 65535;
			aL += ((bL & cL) | (~bL & dL)) + wl8 + 0x98d8; aH += ((bH & cH) | (~bH & dH)) + wh8 + 0x6980;
			aH += aL >> 16;
			aL &= 65535; aH &= 65535;
			t = (aH >>  9) | ((aL <<  7) & 65535); aH = (aL >>  9) | ((aH <<  7) & 65535);
			aL = t + bL; aH += bH; if (aL > 65535) { aL &= 65535; aH++; }
			aH &= 65535;
			dL += ((aL & bL) | (~aL & cL)) + wl9 + 0xf7af; dH += ((aH & bH) | (~aH & cH)) + wh9 + 0x8b44;
			dH += dL >> 16;
			dL &= 65535; dH &= 65535;
			t = (dH >>  4) | ((dL << 12) & 65535); dH = (dL >>  4) | ((dH << 12) & 65535);
			dL = t + aL; dH += aH; if (dL > 65535) { dL &= 65535; dH++; }
			dH &= 65535;
			cL += ((dL & aL) | (~dL & bL)) + wla + 0x5bb1; cH += ((dH & aH) | (~dH & bH)) + wha + 0xffff;
			cH += cL >> 16;
			cL &= 65535; cH &= 65535;
			t = (cL >> 15) | ((cH <<  1) & 65535); cH = (cH >> 15) | ((cL <<  1) & 65535);
			cL = t + dL; cH += dH; if (cL > 65535) { cL &= 65535; cH++; }
			cH &= 65535;
			bL += ((cL & dL) | (~cL & aL)) + wlb + 0xd7be; bH += ((cH & dH) | (~cH & aH)) + whb + 0x895c;
			bH += bL >> 16;
			bL &= 65535; bH &= 65535;
			t = (bL >> 10) | ((bH <<  6) & 65535); bH = (bH >> 10) | ((bL <<  6) & 65535);
			bL = t + cL; bH += cH; if (bL > 65535) { bL &= 65535; bH++; }
			bH &= 65535;
			aL += ((bL & cL) | (~bL & dL)) + wlc + 0x1122; aH += ((bH & cH) | (~bH & dH)) + whc + 0x6b90;
			aH += aL >> 16;
			aL &= 65535; aH &= 65535;
			t = (aH >>  9) | ((aL <<  7) & 65535); aH = (aL >>  9) | ((aH <<  7) & 65535);
			aL = t + bL; aH += bH; if (aL > 65535) { aL &= 65535; aH++; }
			aH &= 65535;
			dL += ((aL & bL) | (~aL & cL)) + wld + 0x7193; dH += ((aH & bH) | (~aH & cH)) + whd + 0xfd98;
			dH += dL >> 16;
			dL &= 65535; dH &= 65535;
			t = (dH >>  4) | ((dL << 12) & 65535); dH = (dL >>  4) | ((dH << 12) & 65535);
			dL = t + aL; dH += aH; if (dL > 65535) { dL &= 65535; dH++; }
			dH &= 65535;
			cL += ((dL & aL) | (~dL & bL)) + wle + 0x438e; cH += ((dH & aH) | (~dH & bH)) + whe + 0xa679;
			cH += cL >> 16;
			cL &= 65535; cH &= 65535;
			t = (cL >> 15) | ((cH <<  1) & 65535); cH = (cH >> 15) | ((cL <<  1) & 65535);
			cL = t + dL; cH += dH; if (cL > 65535) { cL &= 65535; cH++; }
			cH &= 65535;
			bL += ((cL & dL) | (~cL & aL)) + wlf + 0x0821; bH += ((cH & dH) | (~cH & aH)) + whf + 0x49b4;
			bH += bL >> 16;
			bL &= 65535; bH &= 65535;
			t = (bL >> 10) | ((bH <<  6) & 65535); bH = (bH >> 10) | ((bL <<  6) & 65535);
			bL = t + cL; bH += cH; if (bL > 65535) { bL &= 65535; bH++; }
			bH &= 65535;
///
			aL += ((bL & dL) | (cL & ~dL)) + wl1 + 0x2562; aH += ((bH & dH) | (cH & ~dH)) + wh1 + 0xf61e;
			aH += aL >> 16;
			aL &= 65535; aH &= 65535;
			t = (aH >> 11) | ((aL <<  5) & 65535); aH = (aL >> 11) | ((aH <<  5) & 65535);
			aL = t + bL; aH += bH; if (aL > 65535) { aL &= 65535; aH++; }
			aH &= 65535;
			dL += ((aL & cL) | (bL & ~cL)) + wl6 + 0xb340; dH += ((aH & cH) | (bH & ~cH)) + wh6 + 0xc040;
			dH += dL >> 16;
			dL &= 65535; dH &= 65535;
			t = (dH >>  7) | ((dL <<  9) & 65535); dH = (dL >>  7) | ((dH <<  9) & 65535);
			dL = t + aL; dH += aH; if (dL > 65535) { dL &= 65535; dH++; }
			dH &= 65535;
			cL += ((dL & bL) | (aL & ~bL)) + wlb + 0x5a51; cH += ((dH & bH) | (aH & ~bH)) + whb + 0x265e;
			cH += cL >> 16;
			cL &= 65535; cH &= 65535;
			t = (cH >>  2) | ((cL << 14) & 65535); cH = (cL >>  2) | ((cH << 14) & 65535);
			cL = t + dL; cH += dH; if (cL > 65535) { cL &= 65535; cH++; }
			cH &= 65535;
			bL += ((cL & aL) | (dL & ~aL)) + wl0 + 0xc7aa; bH += ((cH & aH) | (dH & ~aH)) + wh0 + 0xe9b6;
			bH += bL >> 16;
			bL &= 65535; bH &= 65535;
			t = (bL >> 12) | ((bH <<  4) & 65535); bH = (bH >> 12) | ((bL <<  4) & 65535);
			bL = t + cL; bH += cH; if (bL > 65535) { bL &= 65535; bH++; }
			bH &= 65535;
			aL += ((bL & dL) | (cL & ~dL)) + wl5 + 0x105d; aH += ((bH & dH) | (cH & ~dH)) + wh5 + 0xd62f;
			aH += aL >> 16;
			aL &= 65535; aH &= 65535;
			t = (aH >> 11) | ((aL <<  5) & 65535); aH = (aL >> 11) | ((aH <<  5) & 65535);
			aL = t + bL; aH += bH; if (aL > 65535) { aL &= 65535; aH++; }
			aH &= 65535;
			dL += ((aL & cL) | (bL & ~cL)) + wla + 0x1453; dH += ((aH & cH) | (bH & ~cH)) + wha + 0x0244;
			dH += dL >> 16;
			dL &= 65535; dH &= 65535;
			t = (dH >>  7) | ((dL <<  9) & 65535); dH = (dL >>  7) | ((dH <<  9) & 65535);
			dL = t + aL; dH += aH; if (dL > 65535) { dL &= 65535; dH++; }
			dH &= 65535;
			cL += ((dL & bL) | (aL & ~bL)) + wlf + 0xe681; cH += ((dH & bH) | (aH & ~bH)) + whf + 0xd8a1;
			cH += cL >> 16;
			cL &= 65535; cH &= 65535;
			t = (cH >>  2) | ((cL << 14) & 65535); cH = (cL >>  2) | ((cH << 14) & 65535);
			cL = t + dL; cH += dH; if (cL > 65535) { cL &= 65535; cH++; }
			cH &= 65535;
			bL += ((cL & aL) | (dL & ~aL)) + wl4 + 0xfbc8; bH += ((cH & aH) | (dH & ~aH)) + wh4 + 0xe7d3;
			bH += bL >> 16;
			bL &= 65535; bH &= 65535;
			t = (bL >> 12) | ((bH <<  4) & 65535); bH = (bH >> 12) | ((bL <<  4) & 65535);
			bL = t + cL; bH += cH; if (bL > 65535) { bL &= 65535; bH++; }
			bH &= 65535;
			aL += ((bL & dL) | (cL & ~dL)) + wl9 + 0xcde6; aH += ((bH & dH) | (cH & ~dH)) + wh9 + 0x21e1;
			aH += aL >> 16;
			aL &= 65535; aH &= 65535;
			t = (aH >> 11) | ((aL <<  5) & 65535); aH = (aL >> 11) | ((aH <<  5) & 65535);
			aL = t + bL; aH += bH; if (aL > 65535) { aL &= 65535; aH++; }
			aH &= 65535;
			dL += ((aL & cL) | (bL & ~cL)) + wle + 0x07d6; dH += ((aH & cH) | (bH & ~cH)) + whe + 0xc337;
			dH += dL >> 16;
			dL &= 65535; dH &= 65535;
			t = (dH >>  7) | ((dL <<  9) & 65535); dH = (dL >>  7) | ((dH <<  9) & 65535);
			dL = t + aL; dH += aH; if (dL > 65535) { dL &= 65535; dH++; }
			dH &= 65535;
			cL += ((dL & bL) | (aL & ~bL)) + wl3 + 0x0d87; cH += ((dH & bH) | (aH & ~bH)) + wh3 + 0xf4d5;
			cH += cL >> 16;
			cL &= 65535; cH &= 65535;
			t = (cH >>  2) | ((cL << 14) & 65535); cH = (cL >>  2) | ((cH << 14) & 65535);
			cL = t + dL; cH += dH; if (cL > 65535) { cL &= 65535; cH++; }
			cH &= 65535;
			bL += ((cL & aL) | (dL & ~aL)) + wl8 + 0x14ed; bH += ((cH & aH) | (dH & ~aH)) + wh8 + 0x455a;
			bH += bL >> 16;
			bL &= 65535; bH &= 65535;
			t = (bL >> 12) | ((bH <<  4) & 65535); bH = (bH >> 12) | ((bL <<  4) & 65535);
			bL = t + cL; bH += cH; if (bL > 65535) { bL &= 65535; bH++; }
			bH &= 65535;
			aL += ((bL & dL) | (cL & ~dL)) + wld + 0xe905; aH += ((bH & dH) | (cH & ~dH)) + whd + 0xa9e3;
			aH += aL >> 16;
			aL &= 65535; aH &= 65535;
			t = (aH >> 11) | ((aL <<  5) & 65535); aH = (aL >> 11) | ((aH <<  5) & 65535);
			aL = t + bL; aH += bH; if (aL > 65535) { aL &= 65535; aH++; }
			aH &= 65535;
			dL += ((aL & cL) | (bL & ~cL)) + wl2 + 0xa3f8; dH += ((aH & cH) | (bH & ~cH)) + wh2 + 0xfcef;
			dH += dL >> 16;
			dL &= 65535; dH &= 65535;
			t = (dH >>  7) | ((dL <<  9) & 65535); dH = (dL >>  7) | ((dH <<  9) & 65535);
			dL = t + aL; dH += aH; if (dL > 65535) { dL &= 65535; dH++; }
			dH &= 65535;
			cL += ((dL & bL) | (aL & ~bL)) + wl7 + 0x02d9; cH += ((dH & bH) | (aH & ~bH)) + wh7 + 0x676f;
			cH += cL >> 16;
			cL &= 65535; cH &= 65535;
			t = (cH >>  2) | ((cL << 14) & 65535); cH = (cL >>  2) | ((cH << 14) & 65535);
			cL = t + dL; cH += dH; if (cL > 65535) { cL &= 65535; cH++; }
			cH &= 65535;
			bL += ((cL & aL) | (dL & ~aL)) + wlc + 0x4c8a; bH += ((cH & aH) | (dH & ~aH)) + whc + 0x8d2a;
			bH += bL >> 16;
			bL &= 65535; bH &= 65535;
			t = (bL >> 12) | ((bH <<  4) & 65535); bH = (bH >> 12) | ((bL <<  4) & 65535);
			bL = t + cL; bH += cH; if (bL > 65535) { bL &= 65535; bH++; }
			bH &= 65535;
			aL += ((bL ^ cL) ^ dL) + wl5 + 0x3942; aH += ((bH ^ cH) ^ dH) + wh5 + 0xfffa;
			aH += aL >> 16;
			aL &= 65535; aH &= 65535;
			t = (aH >> 12) | ((aL <<  4) & 65535); aH = (aL >> 12) | ((aH <<  4) & 65535);
			aL = t + bL; aH += bH; if (aL > 65535) { aL &= 65535; aH++; }
			aH &= 65535;
			dL += ((aL ^ bL) ^ cL) + wl8 + 0xf681; dH += ((aH ^ bH) ^ cH) + wh8 + 0x8771;
			dH += dL >> 16;
			dL &= 65535; dH &= 65535;
			t = (dH >>  5) | ((dL << 11) & 65535); dH = (dL >>  5) | ((dH << 11) & 65535);
			dL = t + aL; dH += aH; if (dL > 65535) { dL &= 65535; dH++; }
			dH &= 65535;
			cL += ((dL ^ aL) ^ bL) + wlb + 0x6122; cH += ((dH ^ aH) ^ bH) + whb + 0x6d9d;
			cH += cL >> 16;
			cL &= 65535; cH &= 65535;
			t = (cL >> 16) | ((cH <<  0) & 65535); cH = (cH >> 16) | ((cL <<  0) & 65535);
			cL = t + dL; cH += dH; if (cL > 65535) { cL &= 65535; cH++; }
			cH &= 65535;
			bL += ((cL ^ dL) ^ aL) + wle + 0x380c; bH += ((cH ^ dH) ^ aH) + whe + 0xfde5;
			bH += bL >> 16;
			bL &= 65535; bH &= 65535;
			t = (bL >>  9) | ((bH <<  7) & 65535); bH = (bH >>  9) | ((bL <<  7) & 65535);
			bL = t + cL; bH += cH; if (bL > 65535) { bL &= 65535; bH++; }
			bH &= 65535;
			aL += ((bL ^ cL) ^ dL) + wl1 + 0xea44; aH += ((bH ^ cH) ^ dH) + wh1 + 0xa4be;
			aH += aL >> 16;
			aL &= 65535; aH &= 65535;
			t = (aH >> 12) | ((aL <<  4) & 65535); aH = (aL >> 12) | ((aH <<  4) & 65535);
			aL = t + bL; aH += bH; if (aL > 65535) { aL &= 65535; aH++; }
			aH &= 65535;
			dL += ((aL ^ bL) ^ cL) + wl4 + 0xcfa9; dH += ((aH ^ bH) ^ cH) + wh4 + 0x4bde;
			dH += dL >> 16;
			dL &= 65535; dH &= 65535;
			t = (dH >>  5) | ((dL << 11) & 65535); dH = (dL >>  5) | ((dH << 11) & 65535);
			dL = t + aL; dH += aH; if (dL > 65535) { dL &= 65535; dH++; }
			dH &= 65535;
			cL += ((dL ^ aL) ^ bL) + wl7 + 0x4b60; cH += ((dH ^ aH) ^ bH) + wh7 + 0xf6bb;
			cH += cL >> 16;
			cL &= 65535; cH &= 65535;
			t = (cL >> 16) | ((cH <<  0) & 65535); cH = (cH >> 16) | ((cL <<  0) & 65535);
			cL = t + dL; cH += dH; if (cL > 65535) { cL &= 65535; cH++; }
			cH &= 65535;
			bL += ((cL ^ dL) ^ aL) + wla + 0xbc70; bH += ((cH ^ dH) ^ aH) + wha + 0xbebf;
			bH += bL >> 16;
			bL &= 65535; bH &= 65535;
			t = (bL >>  9) | ((bH <<  7) & 65535); bH = (bH >>  9) | ((bL <<  7) & 65535);
			bL = t + cL; bH += cH; if (bL > 65535) { bL &= 65535; bH++; }
			bH &= 65535;
			aL += ((bL ^ cL) ^ dL) + wld + 0x7ec6; aH += ((bH ^ cH) ^ dH) + whd + 0x289b;
			aH += aL >> 16;
			aL &= 65535; aH &= 65535;
			t = (aH >> 12) | ((aL <<  4) & 65535); aH = (aL >> 12) | ((aH <<  4) & 65535);
			aL = t + bL; aH += bH; if (aL > 65535) { aL &= 65535; aH++; }
			aH &= 65535;
			dL += ((aL ^ bL) ^ cL) + wl0 + 0x27fa; dH += ((aH ^ bH) ^ cH) + wh0 + 0xeaa1;
			dH += dL >> 16;
			dL &= 65535; dH &= 65535;
			t = (dH >>  5) | ((dL << 11) & 65535); dH = (dL >>  5) | ((dH << 11) & 65535);
			dL = t + aL; dH += aH; if (dL > 65535) { dL &= 65535; dH++; }
			dH &= 65535;
			cL += ((dL ^ aL) ^ bL) + wl3 + 0x3085; cH += ((dH ^ aH) ^ bH) + wh3 + 0xd4ef;
			cH += cL >> 16;
			cL &= 65535; cH &= 65535;
			t = (cL >> 16) | ((cH <<  0) & 65535); cH = (cH >> 16) | ((cL <<  0) & 65535);
			cL = t + dL; cH += dH; if (cL > 65535) { cL &= 65535; cH++; }
			cH &= 65535;
			bL += ((cL ^ dL) ^ aL) + wl6 + 0x1d05; bH += ((cH ^ dH) ^ aH) + wh6 + 0x0488;
			bH += bL >> 16;
			bL &= 65535; bH &= 65535;
			t = (bL >>  9) | ((bH <<  7) & 65535); bH = (bH >>  9) | ((bL <<  7) & 65535);
			bL = t + cL; bH += cH; if (bL > 65535) { bL &= 65535; bH++; }
			bH &= 65535;
			aL += ((bL ^ cL) ^ dL) + wl9 + 0xd039; aH += ((bH ^ cH) ^ dH) + wh9 + 0xd9d4;
			aH += aL >> 16;
			aL &= 65535; aH &= 65535;
			t = (aH >> 12) | ((aL <<  4) & 65535); aH = (aL >> 12) | ((aH <<  4) & 65535);
			aL = t + bL; aH += bH; if (aL > 65535) { aL &= 65535; aH++; }
			aH &= 65535;
			dL += ((aL ^ bL) ^ cL) + wlc + 0x99e5; dH += ((aH ^ bH) ^ cH) + whc + 0xe6db;
			dH += dL >> 16;
			dL &= 65535; dH &= 65535;
			t = (dH >>  5) | ((dL << 11) & 65535); dH = (dL >>  5) | ((dH << 11) & 65535);
			dL = t + aL; dH += aH; if (dL > 65535) { dL &= 65535; dH++; }
			dH &= 65535;
			cL += ((dL ^ aL) ^ bL) + wlf + 0x7cf8; cH += ((dH ^ aH) ^ bH) + whf + 0x1fa2;
			cH += cL >> 16;
			cL &= 65535; cH &= 65535;
			t = (cL >> 16) | ((cH <<  0) & 65535); cH = (cH >> 16) | ((cL <<  0) & 65535);
			cL = t + dL; cH += dH; if (cL > 65535) { cL &= 65535; cH++; }
			cH &= 65535;
			bL += ((cL ^ dL) ^ aL) + wl2 + 0x5665; bH += ((cH ^ dH) ^ aH) + wh2 + 0xc4ac;
			bH += bL >> 16;
			bL &= 65535; bH &= 65535;
			t = (bL >>  9) | ((bH <<  7) & 65535); bH = (bH >>  9) | ((bL <<  7) & 65535);
			bL = t + cL; bH += cH; if (bL > 65535) { bL &= 65535; bH++; }
			bH &= 65535;
///
			aL += (cL ^ ((65535 - dL) | bL)) + wl0 + 0x2244; aH += (cH ^ ((65535 - dH) | bH)) + wh0 + 0xf429;
			aH += aL >> 16;
			aL &= 65535; aH &= 65535;
			t = (aH >> 10) | ((aL <<  6) & 65535); aH = (aL >> 10) | ((aH <<  6) & 65535);
			aL = t + bL; aH += bH; if (aL > 65535) { aL &= 65535; aH++; }
			aH &= 65535;
			dL += (bL ^ ((65535 - cL) | aL)) + wl7 + 0xff97; dH += (bH ^ ((65535 - cH) | aH)) + wh7 + 0x432a;
			dH += dL >> 16;
			dL &= 65535; dH &= 65535;
			t = (dH >>  6) | ((dL << 10) & 65535); dH = (dL >>  6) | ((dH << 10) & 65535);
			dL = t + aL; dH += aH; if (dL > 65535) { dL &= 65535; dH++; }
			dH &= 65535;
			cL += (aL ^ ((65535 - bL) | dL)) + wle + 0x23a7; cH += (aH ^ ((65535 - bH) | dH)) + whe + 0xab94;
			cH += cL >> 16;
			cL &= 65535; cH &= 65535;
			t = (cH >>  1) | ((cL << 15) & 65535); cH = (cL >>  1) | ((cH << 15) & 65535);
			cL = t + dL; cH += dH; if (cL > 65535) { cL &= 65535; cH++; }
			cH &= 65535;
			bL += (dL ^ ((65535 - aL) | cL)) + wl5 + 0xa039; bH += (dH ^ ((65535 - aH) | cH)) + wh5 + 0xfc93;
			bH += bL >> 16;
			bL &= 65535; bH &= 65535;
			t = (bL >> 11) | ((bH <<  5) & 65535); bH = (bH >> 11) | ((bL <<  5) & 65535);
			bL = t + cL; bH += cH; if (bL > 65535) { bL &= 65535; bH++; }
			bH &= 65535;
			aL += (cL ^ ((65535 - dL) | bL)) + wlc + 0x59c3; aH += (cH ^ ((65535 - dH) | bH)) + whc + 0x655b;
			aH += aL >> 16;
			aL &= 65535; aH &= 65535;
			t = (aH >> 10) | ((aL <<  6) & 65535); aH = (aL >> 10) | ((aH <<  6) & 65535);
			aL = t + bL; aH += bH; if (aL > 65535) { aL &= 65535; aH++; }
			aH &= 65535;
			dL += (bL ^ ((65535 - cL) | aL)) + wl3 + 0xcc92; dH += (bH ^ ((65535 - cH) | aH)) + wh3 + 0x8f0c;
			dH += dL >> 16;
			dL &= 65535; dH &= 65535;
			t = (dH >>  6) | ((dL << 10) & 65535); dH = (dL >>  6) | ((dH << 10) & 65535);
			dL = t + aL; dH += aH; if (dL > 65535) { dL &= 65535; dH++; }
			dH &= 65535;
			cL += (aL ^ ((65535 - bL) | dL)) + wla + 0xf47d; cH += (aH ^ ((65535 - bH) | dH)) + wha + 0xffef;
			cH += cL >> 16;
			cL &= 65535; cH &= 65535;
			t = (cH >>  1) | ((cL << 15) & 65535); cH = (cL >>  1) | ((cH << 15) & 65535);
			cL = t + dL; cH += dH; if (cL > 65535) { cL &= 65535; cH++; }
			cH &= 65535;
			bL += (dL ^ ((65535 - aL) | cL)) + wl1 + 0x5dd1; bH += (dH ^ ((65535 - aH) | cH)) + wh1 + 0x8584;
			bH += bL >> 16;
			bL &= 65535; bH &= 65535;
			t = (bL >> 11) | ((bH <<  5) & 65535); bH = (bH >> 11) | ((bL <<  5) & 65535);
			bL = t + cL; bH += cH; if (bL > 65535) { bL &= 65535; bH++; }
			bH &= 65535;
			aL += (cL ^ ((65535 - dL) | bL)) + wl8 + 0x7e4f; aH += (cH ^ ((65535 - dH) | bH)) + wh8 + 0x6fa8;
			aH += aL >> 16;
			aL &= 65535; aH &= 65535;
			t = (aH >> 10) | ((aL <<  6) & 65535); aH = (aL >> 10) | ((aH <<  6) & 65535);
			aL = t + bL; aH += bH; if (aL > 65535) { aL &= 65535; aH++; }
			aH &= 65535;
			dL += (bL ^ ((65535 - cL) | aL)) + wlf + 0xe6e0; dH += (bH ^ ((65535 - cH) | aH)) + whf + 0xfe2c;
			dH += dL >> 16;
			dL &= 65535; dH &= 65535;
			t = (dH >>  6) | ((dL << 10) & 65535); dH = (dL >>  6) | ((dH << 10) & 65535);
			dL = t + aL; dH += aH; if (dL > 65535) { dL &= 65535; dH++; }
			dH &= 65535;
			cL += (aL ^ ((65535 - bL) | dL)) + wl6 + 0x4314; cH += (aH ^ ((65535 - bH) | dH)) + wh6 + 0xa301;
			cH += cL >> 16;
			cL &= 65535; cH &= 65535;
			t = (cH >>  1) | ((cL << 15) & 65535); cH = (cL >>  1) | ((cH << 15) & 65535);
			cL = t + dL; cH += dH; if (cL > 65535) { cL &= 65535; cH++; }
			cH &= 65535;
			bL += (dL ^ ((65535 - aL) | cL)) + wld + 0x11a1; bH += (dH ^ ((65535 - aH) | cH)) + whd + 0x4e08;
			bH += bL >> 16;
			bL &= 65535; bH &= 65535;
			t = (bL >> 11) | ((bH <<  5) & 65535); bH = (bH >> 11) | ((bL <<  5) & 65535);
			bL = t + cL; bH += cH; if (bL > 65535) { bL &= 65535; bH++; }
			bH &= 65535;
			aL += (cL ^ ((65535 - dL) | bL)) + wl4 + 0x7e82; aH += (cH ^ ((65535 - dH) | bH)) + wh4 + 0xf753;
			aH += aL >> 16;
			aL &= 65535; aH &= 65535;
			t = (aH >> 10) | ((aL <<  6) & 65535); aH = (aL >> 10) | ((aH <<  6) & 65535);
			aL = t + bL; aH += bH; if (aL > 65535) { aL &= 65535; aH++; }
			aH &= 65535;
			dL += (bL ^ ((65535 - cL) | aL)) + wlb + 0xf235; dH += (bH ^ ((65535 - cH) | aH)) + whb + 0xbd3a;
			dH += dL >> 16;
			dL &= 65535; dH &= 65535;
			t = (dH >>  6) | ((dL << 10) & 65535); dH = (dL >>  6) | ((dH << 10) & 65535);
			dL = t + aL; dH += aH; if (dL > 65535) { dL &= 65535; dH++; }
			dH &= 65535;
			cL += (aL ^ ((65535 - bL) | dL)) + wl2 + 0xd2bb; cH += (aH ^ ((65535 - bH) | dH)) + wh2 + 0x2ad7;
			cH += cL >> 16;
			cL &= 65535; cH &= 65535;
			t = (cH >>  1) | ((cL << 15) & 65535); cH = (cL >>  1) | ((cH << 15) & 65535);
			cL = t + dL; cH += dH; if (cL > 65535) { cL &= 65535; cH++; }
			cH &= 65535;
			bL += (dL ^ ((65535 - aL) | cL)) + wl9 + 0xd391; bH += (dH ^ ((65535 - aH) | cH)) + wh9 + 0xeb86;
			bH += bL >> 16;
			bL &= 65535; bH &= 65535;
			t = (bL >> 11) | ((bH <<  5) & 65535); bH = (bH >> 11) | ((bL <<  5) & 65535);
			bL = t + cL; bH += cH; if (bL > 65535) { bL &= 65535; bH++; }
			bH &= 65535;
///
			t = this.a_[0] += aL; this.a_[1] += aH; if (t > 65535) { this.a_[0] -= 65536; this.a_[1]++; } this.a_[1] &= 65535;
			t = this.b_[0] += bL; this.b_[1] += bH; if (t > 65535) { this.b_[0] -= 65536; this.b_[1]++; } this.b_[1] &= 65535;
			t = this.c_[0] += cL; this.c_[1] += cH; if (t > 65535) { this.c_[0] -= 65536; this.c_[1]++; } this.c_[1] &= 65535;
			t = this.d_[0] += dL; this.d_[1] += dH; if (t > 65535) { this.d_[0] -= 65536; this.d_[1]++; } this.d_[1] &= 65535;
		},

		update_std : function(Z, len) {
			var a = this.a_, b = this.b_, c = this.c_, d = this.d_;
			var w0, w1, w2, w3, w4, w5, w6, w7, w8, w9, wa, wb, wc, wd, we, wf;
			if (len == 1) {
				w0 = Z.charCodeAt( 0) | (Z.charCodeAt( 1) << 8) | (Z.charCodeAt( 2) << 16) | (Z.charCodeAt( 3) << 24);
				w1 = Z.charCodeAt( 4) | (Z.charCodeAt( 5) << 8) | (Z.charCodeAt( 6) << 16) | (Z.charCodeAt( 7) << 24);
				w2 = Z.charCodeAt( 8) | (Z.charCodeAt( 9) << 8) | (Z.charCodeAt(10) << 16) | (Z.charCodeAt(11) << 24);
				w3 = Z.charCodeAt(12) | (Z.charCodeAt(13) << 8) | (Z.charCodeAt(14) << 16) | (Z.charCodeAt(15) << 24);
				w4 = Z.charCodeAt(16) | (Z.charCodeAt(17) << 8) | (Z.charCodeAt(18) << 16) | (Z.charCodeAt(19) << 24);
				w5 = Z.charCodeAt(20) | (Z.charCodeAt(21) << 8) | (Z.charCodeAt(22) << 16) | (Z.charCodeAt(23) << 24);
				w6 = Z.charCodeAt(24) | (Z.charCodeAt(25) << 8) | (Z.charCodeAt(26) << 16) | (Z.charCodeAt(27) << 24);
				w7 = Z.charCodeAt(28) | (Z.charCodeAt(29) << 8) | (Z.charCodeAt(30) << 16) | (Z.charCodeAt(31) << 24);
				w8 = Z.charCodeAt(32) | (Z.charCodeAt(33) << 8) | (Z.charCodeAt(34) << 16) | (Z.charCodeAt(35) << 24);
				w9 = Z.charCodeAt(36) | (Z.charCodeAt(37) << 8) | (Z.charCodeAt(38) << 16) | (Z.charCodeAt(39) << 24);
				wa = Z.charCodeAt(40) | (Z.charCodeAt(41) << 8) | (Z.charCodeAt(42) << 16) | (Z.charCodeAt(43) << 24);
				wb = Z.charCodeAt(44) | (Z.charCodeAt(45) << 8) | (Z.charCodeAt(46) << 16) | (Z.charCodeAt(47) << 24);
				wc = Z.charCodeAt(48) | (Z.charCodeAt(49) << 8) | (Z.charCodeAt(50) << 16) | (Z.charCodeAt(51) << 24);
				wd = Z.charCodeAt(52) | (Z.charCodeAt(53) << 8) | (Z.charCodeAt(54) << 16) | (Z.charCodeAt(55) << 24);
				we = Z.charCodeAt(56) | (Z.charCodeAt(57) << 8) | (Z.charCodeAt(58) << 16) | (Z.charCodeAt(59) << 24);
				wf = Z.charCodeAt(60) | (Z.charCodeAt(61) << 8) | (Z.charCodeAt(62) << 16) | (Z.charCodeAt(63) << 24);
			} else {
				w0 = Z.charCodeAt( 0) | (Z.charCodeAt( 1) << 16);
				w1 = Z.charCodeAt( 2) | (Z.charCodeAt( 3) << 16);
				w2 = Z.charCodeAt( 4) | (Z.charCodeAt( 5) << 16);
				w3 = Z.charCodeAt( 6) | (Z.charCodeAt( 7) << 16);
				w4 = Z.charCodeAt( 8) | (Z.charCodeAt( 9) << 16);
				w5 = Z.charCodeAt(10) | (Z.charCodeAt(11) << 16);
				w6 = Z.charCodeAt(12) | (Z.charCodeAt(13) << 16);
				w7 = Z.charCodeAt(14) | (Z.charCodeAt(15) << 16);
				w8 = Z.charCodeAt(16) | (Z.charCodeAt(17) << 16);
				w9 = Z.charCodeAt(18) | (Z.charCodeAt(19) << 16);
				wa = Z.charCodeAt(20) | (Z.charCodeAt(21) << 16);
				wb = Z.charCodeAt(22) | (Z.charCodeAt(23) << 16);
				wc = Z.charCodeAt(24) | (Z.charCodeAt(25) << 16);
				wd = Z.charCodeAt(26) | (Z.charCodeAt(27) << 16);
				we = Z.charCodeAt(28) | (Z.charCodeAt(29) << 16);
				wf = Z.charCodeAt(30) | (Z.charCodeAt(31) << 16);
			}

			a += w0 + 0xd76aa478 + ((b & c) | (~b & d)); a = b + ((a <<  7) | (a >>> 25));
			d += w1 + 0xe8c7b756 + ((a & b) | (~a & c)); d = a + ((d << 12) | (d >>> 20));
			c += w2 + 0x242070db + ((d & a) | (~d & b)); c = d + ((c << 17) | (c >>> 15));
			b += w3 + 0xc1bdceee + ((c & d) | (~c & a)); b = c + ((b << 22) | (b >>> 10));
			a += w4 + 0xf57c0faf + ((b & c) | (~b & d)); a = b + ((a <<  7) | (a >>> 25));
			d += w5 + 0x4787c62a + ((a & b) | (~a & c)); d = a + ((d << 12) | (d >>> 20));
			c += w6 + 0xa8304613 + ((d & a) | (~d & b)); c = d + ((c << 17) | (c >>> 15));
			b += w7 + 0xfd469501 + ((c & d) | (~c & a)); b = c + ((b << 22) | (b >>> 10));
			a += w8 + 0x698098d8 + ((b & c) | (~b & d)); a = b + ((a <<  7) | (a >>> 25));
			d += w9 + 0x8b44f7af + ((a & b) | (~a & c)); d = a + ((d << 12) | (d >>> 20));
			c += wa + 0xffff5bb1 + ((d & a) | (~d & b)); c = d + ((c << 17) | (c >>> 15));
			b += wb + 0x895cd7be + ((c & d) | (~c & a)); b = c + ((b << 22) | (b >>> 10));
			a += wc + 0x6b901122 + ((b & c) | (~b & d)); a = b + ((a <<  7) | (a >>> 25));
			d += wd + 0xfd987193 + ((a & b) | (~a & c)); d = a + ((d << 12) | (d >>> 20));
			c += we + 0xa679438e + ((d & a) | (~d & b)); c = d + ((c << 17) | (c >>> 15));
			b += wf + 0x49b40821 + ((c & d) | (~c & a)); b = c + ((b << 22) | (b >>> 10));
			a += w1 + 0xf61e2562 + ((b & d) | (c & ~d)); a = b + ((a <<  5) | (a >>> 27));
			d += w6 + 0xc040b340 + ((a & c) | (b & ~c)); d = a + ((d <<  9) | (d >>> 23));
			c += wb + 0x265e5a51 + ((d & b) | (a & ~b)); c = d + ((c << 14) | (c >>> 18));
			b += w0 + 0xe9b6c7aa + ((c & a) | (d & ~a)); b = c + ((b << 20) | (b >>> 12));
			a += w5 + 0xd62f105d + ((b & d) | (c & ~d)); a = b + ((a <<  5) | (a >>> 27));
			d += wa + 0x02441453 + ((a & c) | (b & ~c)); d = a + ((d <<  9) | (d >>> 23));
			c += wf + 0xd8a1e681 + ((d & b) | (a & ~b)); c = d + ((c << 14) | (c >>> 18));
			b += w4 + 0xe7d3fbc8 + ((c & a) | (d & ~a)); b = c + ((b << 20) | (b >>> 12));
			a += w9 + 0x21e1cde6 + ((b & d) | (c & ~d)); a = b + ((a <<  5) | (a >>> 27));
			d += we + 0xc33707d6 + ((a & c) | (b & ~c)); d = a + ((d <<  9) | (d >>> 23));
			c += w3 + 0xf4d50d87 + ((d & b) | (a & ~b)); c = d + ((c << 14) | (c >>> 18));
			b += w8 + 0x455a14ed + ((c & a) | (d & ~a)); b = c + ((b << 20) | (b >>> 12));
			a += wd + 0xa9e3e905 + ((b & d) | (c & ~d)); a = b + ((a <<  5) | (a >>> 27));
			d += w2 + 0xfcefa3f8 + ((a & c) | (b & ~c)); d = a + ((d <<  9) | (d >>> 23));
			c += w7 + 0x676f02d9 + ((d & b) | (a & ~b)); c = d + ((c << 14) | (c >>> 18));
			b += wc + 0x8d2a4c8a + ((c & a) | (d & ~a)); b = c + ((b << 20) | (b >>> 12));
			a += w5 + 0xfffa3942 + ((b ^ c) ^ d); a = b + ((a <<  4) | (a >>> 28));
			d += w8 + 0x8771f681 + ((a ^ b) ^ c); d = a + ((d << 11) | (d >>> 21));
			c += wb + 0x6d9d6122 + ((d ^ a) ^ b); c = d + ((c << 16) | (c >>> 16));
			b += we + 0xfde5380c + ((c ^ d) ^ a); b = c + ((b << 23) | (b >>>  9));
			a += w1 + 0xa4beea44 + ((b ^ c) ^ d); a = b + ((a <<  4) | (a >>> 28));
			d += w4 + 0x4bdecfa9 + ((a ^ b) ^ c); d = a + ((d << 11) | (d >>> 21));
			c += w7 + 0xf6bb4b60 + ((d ^ a) ^ b); c = d + ((c << 16) | (c >>> 16));
			b += wa + 0xbebfbc70 + ((c ^ d) ^ a); b = c + ((b << 23) | (b >>>  9));
			a += wd + 0x289b7ec6 + ((b ^ c) ^ d); a = b + ((a <<  4) | (a >>> 28));
			d += w0 + 0xeaa127fa + ((a ^ b) ^ c); d = a + ((d << 11) | (d >>> 21));
			c += w3 + 0xd4ef3085 + ((d ^ a) ^ b); c = d + ((c << 16) | (c >>> 16));
			b += w6 + 0x04881d05 + ((c ^ d) ^ a); b = c + ((b << 23) | (b >>>  9));
			a += w9 + 0xd9d4d039 + ((b ^ c) ^ d); a = b + ((a <<  4) | (a >>> 28));
			d += wc + 0xe6db99e5 + ((a ^ b) ^ c); d = a + ((d << 11) | (d >>> 21));
			c += wf + 0x1fa27cf8 + ((d ^ a) ^ b); c = d + ((c << 16) | (c >>> 16));
			b += w2 + 0xc4ac5665 + ((c ^ d) ^ a); b = c + ((b << 23) | (b >>>  9));
			a += w0 + 0xf4292244 + (c ^ (~d | b)); a = b + ((a <<  6) | (a >>> 26));
			d += w7 + 0x432aff97 + (b ^ (~c | a)); d = a + ((d << 10) | (d >>> 22));
			c += we + 0xab9423a7 + (a ^ (~b | d)); c = d + ((c << 15) | (c >>> 17));
			b += w5 + 0xfc93a039 + (d ^ (~a | c)); b = c + ((b << 21) | (b >>> 11));
			a += wc + 0x655b59c3 + (c ^ (~d | b)); a = b + ((a <<  6) | (a >>> 26));
			d += w3 + 0x8f0ccc92 + (b ^ (~c | a)); d = a + ((d << 10) | (d >>> 22));
			c += wa + 0xffeff47d + (a ^ (~b | d)); c = d + ((c << 15) | (c >>> 17));
			b += w1 + 0x85845dd1 + (d ^ (~a | c)); b = c + ((b << 21) | (b >>> 11));
			a += w8 + 0x6fa87e4f + (c ^ (~d | b)); a = b + ((a <<  6) | (a >>> 26));
			d += wf + 0xfe2ce6e0 + (b ^ (~c | a)); d = a + ((d << 10) | (d >>> 22));
			c += w6 + 0xa3014314 + (a ^ (~b | d)); c = d + ((c << 15) | (c >>> 17));
			b += wd + 0x4e0811a1 + (d ^ (~a | c)); b = c + ((b << 21) | (b >>> 11));
			a += w4 + 0xf7537e82 + (c ^ (~d | b)); a = b + ((a <<  6) | (a >>> 26));
			d += wb + 0xbd3af235 + (b ^ (~c | a)); d = a + ((d << 10) | (d >>> 22));
			c += w2 + 0x2ad7d2bb + (a ^ (~b | d)); c = d + ((c << 15) | (c >>> 17));
			b += w9 + 0xeb86d391 + (d ^ (~a | c)); b = c + ((b << 21) | (b >>> 11));

			this.a_ = (this.a_ + a) & 0xffffffff;
			this.b_ = (this.b_ + b) & 0xffffffff;
			this.c_ = (this.c_ + c) & 0xffffffff;
			this.d_ = (this.d_ + d) & 0xffffffff;
		},

		fillzero : function(size) {
			var Z = "";
			for (var i = 0; i < size; i++) {
				Z += "\x00";
			}
			return Z;
		},

		main : function(Z, zs, update, self, len) {
			if (len == 1) {
				var totalBitSize = zs * 8;
				while (zs >= 64) {
					self[update](Z, len);
					Z = Z.substr(64);
					zs -= 64;
				}
				Z +="\x80";
				if (zs >= 56) {
					Z += this.fillzero(63 - zs);
					self[update](Z, len);
					Z = this.fillzero(56);
				} else {
					Z += this.fillzero(55 - zs);
				}
				Z += String.fromCharCode(totalBitSize & 0xff, (totalBitSize >>> 8) & 0xff, (totalBitSize >>> 16) & 0xff, totalBitSize >>> 24);
				Z += "\x00\x00\x00\x00"; // in stead of (totalBitSize) >> 32
				self[update](Z, len);
			} else {
				/* len == 2 */
				var totalBitSize = zs * 16;
				while (zs >= 32) {
					self[update](Z, len);
					Z = Z.substr(32);
					zs -= 32;
				}
				Z +="\x80";
				if (zs >= 28) {
					Z += this.fillzero(31 - zs);
					self[update](Z, len);
					Z = this.fillzero(28);
				} else {
					Z += this.fillzero(27 - zs);
				}
				Z += String.fromCharCode(totalBitSize & 0xffff, totalBitSize >>> 16);
				Z += "\x00\x00"; // in stead of (totalBitSize) >> 32
				self[update](Z, len);
			}
		},

		/* sprintf(Z, "%08x", i32); */
		i2h8 : function(A) {
			var i, c, v = "";
			var h = "0123456789abcdef";
			for (i = 0; i < 4; i++) {
				c = A >>> (i * 8);
				v += h.charAt((c >> 4) & 15);
				v += h.charAt(c & 15);
			}
			return v;
		},

		BY_ASCII : 0,
		BY_UTF16 : 1,
		calc_Fx : function(msg, mode) {
			// for Firefox
			function conv(x) { return this.i2h8((x[1] * 65536) + x[0]); };
			var len = (arguments.length == 2 && mode == this.BY_UTF16) ? 2 : 1;
			this.a_ = [0x2301, 0x6745];
			this.b_ = [0xab89, 0xefcd];
			this.c_ = [0xdcfe, 0x98ba];
			this.d_ = [0x5476, 0x1032];
			this.main(msg, msg.length, "update_Fx", this, len);
			return conv(this.a_) + conv(this.b_) + conv(this.c_) + conv(this.d_);
		},

		calc_std : function(msg, mode) {
			var len = (arguments.length == 2 && mode == this.BY_UTF16) ? 2 : 1;
			this.a_ = 0x67452301;
			this.b_ = 0xefcdab89;
			this.c_ = 0x98badcfe;
			this.d_ = 0x10325476;
			this.main(msg, msg.length, "update_std", this, len);
			return this.i2h8(this.a_) + this.i2h8(this.b_) + this.i2h8(this.c_) + this.i2h8(this.d_);
		}
	} // end of md5
}; // end of CBI
new function() {
	CBI.md5.calc = navigator.userAgent.match(/Firefox/) ? CBI.md5.calc_Fx : CBI.md5.calc_std;
};





