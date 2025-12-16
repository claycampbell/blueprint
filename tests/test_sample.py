"""Sample test file to validate pre-commit hooks."""

import pytest


def add(a: int, b: int) -> int:
    """Add two numbers together."""
    return a + b


def test_add():
    """Test the add function."""
    assert add(1, 2) == 3
    assert add(-1, 1) == 0
    assert add(0, 0) == 0


def test_add_negative():
    """Test add with negative numbers."""
    assert add(-5, -3) == -8
    assert add(-10, 5) == -5


@pytest.mark.parametrize(
    ("a", "b", "expected"),
    [
        (1, 1, 2),
        (5, 3, 8),
        (10, 20, 30),
        (100, 200, 300),
    ],
)
def test_add_parametrized(a, b, expected):
    """Test add with multiple inputs using parametrize."""
    assert add(a, b) == expected
