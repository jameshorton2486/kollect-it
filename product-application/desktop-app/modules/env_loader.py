"""
Centralized Environment Variable Loader for Kollect-It Product Application.

Priority order:
1. System environment variables (Vercel, CI/CD, shell)
2. Main repo .env.local
3. Main repo .env
4. Local .env in desktop-app (fallback only)

This eliminates the need for a separate .env file in the product-application folder.
"""

import os
import sys
from pathlib import Path
from typing import Optional, Dict, List

try:
    from dotenv import dotenv_values
except ImportError:
    print("ERROR: python-dotenv not installed. Run: pip install python-dotenv")
    sys.exit(1)

# Import paths module
from modules.paths import REPO_ROOT, DESKTOP_APP_DIR, MAIN_ENV_LOCAL, MAIN_ENV


# Variable name mappings (desktop app name -> possible main repo names)
VARIABLE_MAPPINGS: Dict[str, List[str]] = {
    # API Keys - PRODUCT_INGEST_API_KEY is the canonical name
    "SERVICE_API_KEY": ["SERVICE_API_KEY", "PRODUCT_INGEST_API_KEY"],
    "PRODUCT_INGEST_API_KEY": ["PRODUCT_INGEST_API_KEY", "SERVICE_API_KEY"],
    
    # ImageKit
    "IMAGEKIT_PUBLIC_KEY": ["IMAGEKIT_PUBLIC_KEY"],
    "IMAGEKIT_PRIVATE_KEY": ["IMAGEKIT_PRIVATE_KEY"],
    "IMAGEKIT_URL_ENDPOINT": ["IMAGEKIT_URL_ENDPOINT", "NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT"],
    
    # AI Services
    "ANTHROPIC_API_KEY": ["ANTHROPIC_API_KEY"],
    
    # Stripe
    "STRIPE_PUBLISHABLE_KEY": ["STRIPE_PUBLISHABLE_KEY", "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"],
    "STRIPE_SECRET_KEY": ["STRIPE_SECRET_KEY"],
    
    # URLs
    "API_BASE_URL": ["API_BASE_URL", "NEXT_PUBLIC_APP_URL", "NEXTAUTH_URL"],
}

# Required variables (app cannot function without these)
REQUIRED_VARIABLES = [
    "PRODUCT_INGEST_API_KEY",  # Or SERVICE_API_KEY via mapping
    "IMAGEKIT_PUBLIC_KEY",
    "IMAGEKIT_PRIVATE_KEY",
    "ANTHROPIC_API_KEY",
]

# Optional variables with sensible defaults
OPTIONAL_DEFAULTS = {
    "USE_PRODUCTION": "true",
    "AI_TEMPERATURE": "0.7",
    "API_BASE_URL": "https://kollect-it.com",
    "IMAGEKIT_URL_ENDPOINT": "https://ik.imagekit.io/kollectit",
}


class EnvironmentLoader:
    """Hierarchical environment variable loader."""
    
    def __init__(self):
        self.env_files_loaded: List[Path] = []
        self.merged_env: Dict[str, str] = {}
        self._load_all_env_files()
    
    def _load_all_env_files(self) -> None:
        """Load environment files in priority order (lowest to highest)."""
        env_files_to_load = []
        
        # Priority 1 (lowest): Local .env in desktop-app
        local_env = DESKTOP_APP_DIR / ".env"
        if local_env.exists():
            env_files_to_load.append(local_env)
        
        # Priority 2: Main repo .env
        if MAIN_ENV.exists():
            env_files_to_load.append(MAIN_ENV)
        
        # Priority 3 (highest file): Main repo .env.local
        if MAIN_ENV_LOCAL.exists():
            env_files_to_load.append(MAIN_ENV_LOCAL)
        
        # Load files (later files override earlier ones)
        for env_file in env_files_to_load:
            try:
                values = dotenv_values(env_file)
                self.merged_env.update(values)
                self.env_files_loaded.append(env_file)
            except Exception as e:
                print(f"[ENV] Warning: Failed to load {env_file}: {e}")
        
        if not self.env_files_loaded:
            print("[ENV] WARNING: No .env files found!")
            print(f"[ENV] Searched: {MAIN_ENV_LOCAL}, {MAIN_ENV}, {local_env}")
    
    def get(self, key: str, default: Optional[str] = None) -> Optional[str]:
        """
        Get an environment variable with fallback logic.
        
        Priority:
        1. System environment variable (os.environ)
        2. Merged .env files (with variable name mapping)
        3. Default value
        4. OPTIONAL_DEFAULTS
        """
        # 1. Check system environment first (for Vercel, CI/CD)
        value = os.environ.get(key)
        if value:
            return value
        
        # 2. Check merged env with variable name mapping
        possible_names = VARIABLE_MAPPINGS.get(key, [key])
        for name in possible_names:
            # Check system env for mapped name
            value = os.environ.get(name)
            if value:
                return value
            # Check merged env files
            value = self.merged_env.get(name)
            if value:
                return value
        
        # 3. Return provided default
        if default is not None:
            return default
        
        # 4. Check optional defaults
        return OPTIONAL_DEFAULTS.get(key)
    
    def get_required(self, key: str) -> str:
        """Get a required environment variable, raising error if not found."""
        value = self.get(key)
        if not value:
            searched_names = VARIABLE_MAPPINGS.get(key, [key])
            raise EnvironmentError(
                f"\n{'='*60}\n"
                f"MISSING REQUIRED ENVIRONMENT VARIABLE\n"
                f"{'='*60}\n"
                f"Variable: {key}\n"
                f"Also checked: {searched_names}\n"
                f"\n"
                f"Env files loaded:\n"
                + "\n".join(f"  - {f}" for f in self.env_files_loaded) +
                f"\n\n"
                f"Please ensure your .env.local file contains this variable.\n"
                f"Expected location: {MAIN_ENV_LOCAL}\n"
                f"{'='*60}"
            )
        return value
    
    def validate(self) -> Dict[str, bool]:
        """Validate that all required variables are present."""
        results = {}
        for var in REQUIRED_VARIABLES:
            value = self.get(var)
            results[var] = value is not None and len(value) > 0
        return results
    
    def get_status_report(self) -> str:
        """Generate a detailed status report."""
        lines = [
            "",
            "=" * 60,
            "ENVIRONMENT CONFIGURATION STATUS",
            "=" * 60,
            f"Repository root: {REPO_ROOT}",
            f"Env files loaded: {len(self.env_files_loaded)}",
        ]
        
        for f in self.env_files_loaded:
            lines.append(f"  ✓ {f}")
        
        if not self.env_files_loaded:
            lines.append("  ✗ No env files found!")
        
        lines.append("")
        lines.append("Required Variables:")
        
        for var in REQUIRED_VARIABLES:
            value = self.get(var)
            if value:
                # Mask the value for security
                if len(value) > 10:
                    masked = value[:4] + "..." + value[-4:]
                else:
                    masked = "***"
                lines.append(f"  ✓ {var}: {masked}")
            else:
                lines.append(f"  ✗ {var}: NOT FOUND")
        
        lines.append("")
        lines.append("Optional Variables:")
        
        for var, default in OPTIONAL_DEFAULTS.items():
            value = self.get(var)
            source = "(default)" if value == default else "(configured)"
            lines.append(f"  • {var}: {value} {source}")
        
        lines.append("=" * 60)
        lines.append("")
        
        return "\n".join(lines)


# Global singleton instance
_env_loader: Optional[EnvironmentLoader] = None


def get_env_loader() -> EnvironmentLoader:
    """Get or create the global environment loader instance."""
    global _env_loader
    if _env_loader is None:
        _env_loader = EnvironmentLoader()
    return _env_loader


def get_env(key: str, default: Optional[str] = None) -> Optional[str]:
    """Convenience function to get an environment variable."""
    return get_env_loader().get(key, default)


def get_required_env(key: str) -> str:
    """Convenience function to get a required environment variable."""
    return get_env_loader().get_required(key)


def validate_environment() -> bool:
    """Validate the environment and print status report."""
    loader = get_env_loader()
    print(loader.get_status_report())
    results = loader.validate()
    
    all_valid = all(results.values())
    if all_valid:
        print("✓ All required environment variables are configured!\n")
    else:
        missing = [k for k, v in results.items() if not v]
        print(f"✗ Missing variables: {', '.join(missing)}\n")
    
    return all_valid


# Run validation when executed directly
if __name__ == "__main__":
    success = validate_environment()
    sys.exit(0 if success else 1)
