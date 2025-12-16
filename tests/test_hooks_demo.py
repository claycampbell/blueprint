"""Test file to demonstrate pre-commit hooks."""

# Intentional style violations that Ruff will fix:
import sys
import os


def badly_formatted_function(x,y,z):
    """Function with bad formatting."""
    result=x+y+z
    return result


def test_badly_formatted():
    """Test the badly formatted function."""
    assert badly_formatted_function(1,2,3)==6


def test_with_trailing_whitespace():
    """Test with trailing whitespace."""
    value = 42
    assert value == 42
