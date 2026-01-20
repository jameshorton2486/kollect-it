"""
Centralized path resolution for the Kollect-It Product Application.
All paths are resolved dynamically based on the location of this file.
"""

from pathlib import Path
from typing import Optional

# Core directories (resolved from this file's location)
MODULES_DIR = Path(__file__).resolve().parent
DESKTOP_APP_DIR = MODULES_DIR.parent
PRODUCT_APP_DIR = DESKTOP_APP_DIR.parent
REPO_ROOT = PRODUCT_APP_DIR.parent

# Application directories
TEMPLATES_DIR = DESKTOP_APP_DIR / "templates"
CONFIG_DIR = DESKTOP_APP_DIR / "config"
LOGS_DIR = DESKTOP_APP_DIR / "logs"
TESTS_DIR = DESKTOP_APP_DIR / "tests"
PATCHES_DIR = DESKTOP_APP_DIR / "patches"

# Main repo resources (for shared env files)
MAIN_ENV_LOCAL = REPO_ROOT / ".env.local"
MAIN_ENV = REPO_ROOT / ".env"

# Ensure logs directory exists
LOGS_DIR.mkdir(exist_ok=True)


def get_template_path(template_name: str) -> Path:
    """Get the full path to a template file."""
    path = TEMPLATES_DIR / template_name
    if not path.suffix:
        path = path.with_suffix(".json")
    return path


def get_config_path(config_name: str) -> Path:
    """Get the full path to a config file."""
    path = CONFIG_DIR / config_name
    if not path.suffix:
        path = path.with_suffix(".json")
    return path


def find_env_file() -> Optional[Path]:
    """Find the first available env file in priority order."""
    candidates = [
        MAIN_ENV_LOCAL,      # Main repo .env.local (highest priority)
        MAIN_ENV,            # Main repo .env
        DESKTOP_APP_DIR / ".env",  # Local fallback
    ]
    for path in candidates:
        if path.exists():
            return path
    return None


def validate_paths() -> dict:
    """Validate that all critical paths exist."""
    return {
        "REPO_ROOT": REPO_ROOT.exists(),
        "DESKTOP_APP_DIR": DESKTOP_APP_DIR.exists(),
        "TEMPLATES_DIR": TEMPLATES_DIR.exists(),
        "CONFIG_DIR": CONFIG_DIR.exists(),
        "MAIN_ENV_LOCAL": MAIN_ENV_LOCAL.exists(),
    }


# Debug output when run directly
if __name__ == "__main__":
    print("=" * 60)
    print("PATH RESOLUTION DEBUG")
    print("=" * 60)
    print(f"MODULES_DIR:     {MODULES_DIR}")
    print(f"DESKTOP_APP_DIR: {DESKTOP_APP_DIR}")
    print(f"PRODUCT_APP_DIR: {PRODUCT_APP_DIR}")
    print(f"REPO_ROOT:       {REPO_ROOT}")
    print(f"TEMPLATES_DIR:   {TEMPLATES_DIR}")
    print(f"CONFIG_DIR:      {CONFIG_DIR}")
    print(f"LOGS_DIR:        {LOGS_DIR}")
    print()
    print("Validation:")
    for name, exists in validate_paths().items():
        status = "✓" if exists else "✗"
        print(f"  {status} {name}")
    print()
    env_file = find_env_file()
    print(f"Env file found: {env_file or 'NONE'}")
