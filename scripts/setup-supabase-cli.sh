#!/bin/bash

# Setup Supabase CLI for migration management
echo "========================================"
echo "Supabase CLI Setup"
echo "========================================"
echo ""

# Check if Supabase CLI is installed
if command -v supabase &> /dev/null; then
    echo "✅ Supabase CLI is already installed"
    supabase --version
else
    echo "📦 Installing Supabase CLI..."
    
    # Check OS and install accordingly
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command -v brew &> /dev/null; then
            echo "   Using Homebrew..."
            brew install supabase/tap/supabase
        else
            echo "   Homebrew not found. Installing via npm..."
            npm install -g supabase
        fi
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        echo "   Installing via npm..."
        npm install -g supabase
    else
        echo "   Please install Supabase CLI manually:"
        echo "   https://supabase.com/docs/guides/cli"
        exit 1
    fi
fi

echo ""
echo "🔐 Login to Supabase..."
echo "   This will open a browser for authentication"
supabase login

echo ""
echo "🔗 Linking to your project..."
echo "   Project ref: fgyssizbuggjqsarwiuj"
supabase link --project-ref fgyssizbuggjqsarwiuj

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Run migrations: supabase db push"
echo "   2. Create new migration: supabase migration new <name>"
echo "   3. Reset database: supabase db reset"
echo ""

