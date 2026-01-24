# Admin-Only Tools

The following directories contain internal, administrator-only tooling.

They are:

- NOT user-facing
- NOT deployed to the public frontend
- NOT imported by application runtime code
- Intended for internal operational use only

## Admin Tooling

- `/product-application/`

## Rules

- No secrets stored in code
- All credentials loaded from environment variables
- No frontend imports from admin tooling
- Changes require admin review
