import sys
from pathlib import Path

ROOT_DIR = str(Path(__file__).resolve().parent.parent)
TESTS_DIR = str(Path(__file__).resolve().parent)

# Prevent tests/ directory from shadowing backend package
if TESTS_DIR in sys.path:
    sys.path.remove(TESTS_DIR)

while ROOT_DIR in sys.path:
    sys.path.remove(ROOT_DIR)
sys.path.insert(0, ROOT_DIR)
