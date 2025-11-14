#!/bin/bash

# Interactive script to setup access token and run migrations
echo "========================================"
echo "ShopSync Access Token Setup"
echo "========================================"
echo ""

# Check if token is already set
if [ -n "$SUPABASE_ACCESS_TOKEN" ]; then
    echo "✅ Access token already set: ${SUPABASE_ACCESS_TOKEN:0:20}..."
    echo ""
    read -p "Use existing token? (y/n): " use_existing
    if [ "$use_existing" != "y" ] && [ "$use_existing" != "Y" ]; then
        unset SUPABASE_ACCESS_TOKEN
    fi
fi

# Get token if not set
if [ -z "$SUPABASE_ACCESS_TOKEN" ]; then
    echo "📝 Step 1: Get Access Token"
    echo ""
    echo "   Open this URL in your browser:"
    echo "   https://supabase.com/dashboard/account/tokens"
    echo ""
    echo "   Or run: npm run migrate:token"
    echo ""
    read -p "Press Enter when you have the token..."
    echo ""
    echo "📝 Step 2: Enter Your Access Token"
    echo "   (Token starts with 'sbp_' and is about 50+ characters)"
    echo ""
    read -sp "Enter your access token: " SUPABASE_ACCESS_TOKEN
    echo ""
    echo ""
    
    if [ -z "$SUPABASE_ACCESS_TOKEN" ]; then
        echo "❌ Token is required. Exiting."
        exit 1
    fi
    
    # Save to .env file
    if [ -f .env ]; then
        # Check if token already exists in .env
        if grep -q "SUPABASE_ACCESS_TOKEN" .env; then
            # Update existing token
            if [[ "$OSTYPE" == "darwin"* ]]; then
                sed -i '' "s/SUPABASE_ACCESS_TOKEN=.*/SUPABASE_ACCESS_TOKEN=$SUPABASE_ACCESS_TOKEN/" .env
            else
                sed -i "s/SUPABASE_ACCESS_TOKEN=.*/SUPABASE_ACCESS_TOKEN=$SUPABASE_ACCESS_TOKEN/" .env
            fi
        else
            # Add new token
            echo "SUPABASE_ACCESS_TOKEN=$SUPABASE_ACCESS_TOKEN" >> .env
        fi
        echo "✅ Token saved to .env file"
    else
        echo "⚠️  .env file not found. Token not saved."
        echo "   Set it manually: export SUPABASE_ACCESS_TOKEN=$SUPABASE_ACCESS_TOKEN"
    fi
fi

# Export token
export SUPABASE_ACCESS_TOKEN

# Test token
echo "🧪 Testing token..."
if supabase projects list > /dev/null 2>&1; then
    echo "✅ Token is valid!"
    echo ""
else
    echo "❌ Token is invalid or doesn't have required permissions"
    echo ""
    echo "Please check:"
    echo "   1. Token is correct"
    echo "   2. Token has access to this project"
    echo "   3. Token hasn't expired"
    echo ""
    exit 1
fi

# Link project
echo "🔗 Linking to Supabase project..."
cd "$(dirname "$0")/.." || exit 1

supabase link --project-ref fgyssizbuggjqsarwiuj --password 6287605b.B

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Failed to link project"
    echo "   Check if:"
    echo "   - Project reference is correct: fgyssizbuggjqsarwiuj"
    echo "   - Database password is correct: 6287605b.B"
    echo "   - Token has access to this project"
    echo ""
    exit 1
fi

echo ""
echo "✅ Project linked successfully!"
echo ""

# Ask to run migrations
read -p "Run migrations now? (y/n): " run_migrations
if [ "$run_migrations" = "y" ] || [ "$run_migrations" = "Y" ]; then
    echo ""
    echo "🚀 Running migrations..."
    supabase db push
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "🎉 Migrations completed successfully!"
        echo ""
        echo "✅ Next steps:"
        echo "   1. Verify tables in Supabase dashboard:"
        echo "      https://supabase.com/dashboard/project/fgyssizbuggjqsarwiuj/editor"
        echo ""
        echo "   2. Create first user (see QUICKSTART.md)"
        echo ""
        echo "   3. Start development server:"
        echo "      npm run dev"
        echo ""
    else
        echo ""
        echo "❌ Migration failed"
        echo "   Check errors above"
        echo ""
        exit 1
    fi
else
    echo ""
    echo "✅ Setup complete! Token is saved and project is linked."
    echo ""
    echo "📝 To run migrations later:"
    echo "   supabase db push"
    echo ""
fi

