#include<iostream>
#include<math.h>

using namespace std;

float add(float u, float v);
float quadraticEquation(float a, float b, float c, bool neg = false);
float square(float n);
float multiply(float x, float y);
float negate(float a);
float subtract(float x1, float x2);
float divide(float num, float den);

int main() {
	float n1, n2;
	n1 = 2;
	n2 = -3;

	//(x - n1)(x - n2)
	float x, y, z;
	x = 1.0f;
	y = negate(add(n1,n2));
	z = multiply(n1,n2);
	bool otherRoot = true;
	float root1 = quadraticEquation(x, y, z);
	float root2 = quadraticEquation(x, y, z, otherRoot);

	cout << root1 << endl;
	cout << root2 << endl;

	int a;
	cin >> a;

	return 0;
}

float add(float u, float v) {
	float ans = u + v;
	return ans;
}

float quadraticEquation(float a, float b, float c, bool neg) {
	float x, y;
	float b2 = square(b);
	float ac4 = multiply(multiply(4, a), c);
	float num = subtract(b2, ac4);
	if (neg)
		y = subtract(negate(b), sqrt(num));
	else
		y = add(negate(b), sqrt(num));
	float denom = multiply(2, a);
	x = divide(y, denom);
	return x;
}

float square(float n) {
	float retVal = n * n;
	return retVal;
}

float subtract(float x1, float x2) {
	float x3 = negate(x2);
	float y = add(x1, x3);
	return y;
}

float multiply(float x, float y) {
	float val = x * y;
	return val;
}

float negate(float a) {
	float num = -a;
	return num;
}

float divide(float num, float den) {
	float ans = num / den;
	return ans;
}
