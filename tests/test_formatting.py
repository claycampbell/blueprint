"""Test file with formatting issues."""


def add(a, b, c, d, e, f):
    total = a + b + c + d + e + f
    return total


def test_add():
    assert add(1, 2, 3, 4, 5, 6) == 21
