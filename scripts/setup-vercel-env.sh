#!/bin/bash
# Deploy PRODUCT_INGEST_API_KEY to Vercel environments

echo "🚀 Adding PRODUCT_INGEST_API_KEY to Vercel environments..."
echo ""

# Add to all environments
vercel env add PRODUCT_INGEST_API_KEY

echo ""
echo "✅ PRODUCT_INGEST_API_KEY has been added to Vercel!"
echo ""
echo "The key 'kollect-it-product-service-2025' is now available in:"
echo "  • Production"
echo "  • Preview"
echo "  • Development"
echo ""
