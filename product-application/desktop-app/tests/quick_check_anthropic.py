import os
import sys

def main():
    key = os.getenv("ANTHROPIC_API_KEY")

    if not key:
        print("NO_KEY: ANTHROPIC_API_KEY not set.")
        print("Expected source: main repo .env.local")
        sys.exit(2)

    print("OK: ANTHROPIC_API_KEY detected")
    sys.exit(0)

if __name__ == "__main__":
    main()
