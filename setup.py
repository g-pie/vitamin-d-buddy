"""
Vitamin-D Bud-D python package configuration.
"""

from setuptools import setup

setup(
    name='vitamindbuddy',
    version='0.1.0',
    packages=['vitamindbuddy'],
    include_package_data=True,
    install_requires=[
        'arrow',
        'bs4',
        'Flask',
        'html5validator',
        'pycodestyle',
        'pydocstyle',
        'pylint',
        'pytest',
        'requests',
        'selenium',
    ],
    python_requires='>=3.6',
)
