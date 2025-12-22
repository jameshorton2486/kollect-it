# Production Prompt System

## Prompt Ownership

### Cursor (Code Analysis)

- Code refactoring
- Validation
- Testing
- Type checking
- Architecture analysis

### Claude (Website/API)

- Product analysis (website-side)
- API reasoning
- Prisma/schema reasoning
- Higher-level architectural reasoning

### GPT-4V (Image Analysis)

- Image quality assessment
- Photography analysis
- Visual defect detection

## Structure

```text
prompts/
├── schemas/          # Strict TypeScript schemas for all outputs
├── claude/           # Claude-specific prompts (website/API)
├── gpt4v/            # GPT-4V prompts (image analysis)
└── validation/       # End-to-end validation prompts
```

## Principles

1. **Deterministic**: Same input = same output (temperature 0 for critical paths)
2. **Strict Schemas**: All outputs validated against TypeScript types
3. **Clear Failure Behavior**: Explicit error handling and fallbacks
4. **Production-Ready**: No ambiguity, no "AI creativity drift"
5. **Contract-Based**: Website prompts are strict contracts
