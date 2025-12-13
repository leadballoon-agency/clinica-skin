#!/bin/bash

# CO2 Laser Template Customization Agent - Quick Start Script
# This script guides users through the complete customization process

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
TEMPLATE_PATH="/Users/marktaylor/Desktop/co2-laser-demo-template"
OUTPUT_PATH="/Users/marktaylor/Desktop"
PLATFORM="vercel"
ENVIRONMENT="production"

echo -e "${BLUE}🚀 CO2 Laser Template Customization Agent - Quick Start${NC}"
echo "================================================================"
echo

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Function to check prerequisites
check_prerequisites() {
    echo "🔍 Checking prerequisites..."

    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org"
        exit 1
    fi

    local node_version=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$node_version" -lt 18 ]; then
        print_error "Node.js version 18+ is required. Current version: $(node -v)"
        exit 1
    fi
    print_status "Node.js $(node -v) is installed"

    # Check if template exists
    if [ ! -d "$TEMPLATE_PATH" ]; then
        print_error "CO2 Laser demo template not found at: $TEMPLATE_PATH"
        echo "Please ensure the template is available at the expected location."
        exit 1
    fi
    print_status "CO2 Laser demo template found"

    # Check Firecrawl API key
    if [ -z "$FIRECRAWL_API_KEY" ]; then
        print_warning "FIRECRAWL_API_KEY environment variable not set"
        echo "You can set it now or the script will use simulated data extraction."
        read -p "Enter your Firecrawl API key (or press Enter to skip): " api_key
        if [ ! -z "$api_key" ]; then
            export FIRECRAWL_API_KEY="$api_key"
            print_status "Firecrawl API key set"
        else
            print_warning "Proceeding without Firecrawl API key (will use simulated data)"
        fi
    else
        print_status "Firecrawl API key is configured"
    fi

    echo
}

# Function to get user input
get_user_input() {
    echo "📝 Please provide the following information:"
    echo

    # Get website URL
    while [ -z "$WEBSITE_URL" ]; do
        read -p "Enter the clinic's website URL (e.g., https://example-clinic.com): " WEBSITE_URL
        if [[ ! "$WEBSITE_URL" =~ ^https?:// ]]; then
            print_error "Please enter a valid URL starting with http:// or https://"
            WEBSITE_URL=""
        fi
    done

    # Get clinic name (optional)
    read -p "Enter clinic name (optional, will be extracted from website): " CLINIC_NAME

    # Get custom domain (optional)
    read -p "Enter custom domain for deployment (optional): " CUSTOM_DOMAIN

    # Get deployment platform
    echo
    echo "Choose deployment platform:"
    echo "1) Vercel (recommended)"
    echo "2) Netlify"
    read -p "Enter choice (1 or 2) [default: 1]: " platform_choice

    case $platform_choice in
        2)
            PLATFORM="netlify"
            print_info "Selected platform: Netlify"
            ;;
        *)
            PLATFORM="vercel"
            print_info "Selected platform: Vercel"
            ;;
    esac

    echo
}

# Function to check platform CLI
check_platform_cli() {
    echo "🔧 Checking deployment platform CLI..."

    if [ "$PLATFORM" = "vercel" ]; then
        if ! command -v vercel &> /dev/null; then
            print_warning "Vercel CLI not found. Installing..."
            npm install -g vercel
            if [ $? -eq 0 ]; then
                print_status "Vercel CLI installed successfully"
            else
                print_error "Failed to install Vercel CLI"
                exit 1
            fi
        else
            print_status "Vercel CLI is available"
        fi
    elif [ "$PLATFORM" = "netlify" ]; then
        if ! command -v netlify &> /dev/null; then
            print_warning "Netlify CLI not found. Installing..."
            npm install -g netlify-cli
            if [ $? -eq 0 ]; then
                print_status "Netlify CLI installed successfully"
            else
                print_error "Failed to install Netlify CLI"
                exit 1
            fi
        else
            print_status "Netlify CLI is available"
        fi
    fi

    echo
}

# Function to run customization
run_customization() {
    echo "⚙️ Running template customization..."

    # Build the command
    local cmd="node clinic-automation-agent.js --url \"$WEBSITE_URL\""

    if [ ! -z "$CLINIC_NAME" ]; then
        cmd="$cmd --name \"$CLINIC_NAME\""
    fi

    if [ ! -z "$TEMPLATE_PATH" ]; then
        cmd="$cmd --template \"$TEMPLATE_PATH\""
    fi

    if [ ! -z "$OUTPUT_PATH" ]; then
        cmd="$cmd --output \"$OUTPUT_PATH\""
    fi

    print_info "Executing: $cmd"
    echo

    # Run the customization
    eval $cmd
    local exit_code=$?

    if [ $exit_code -eq 0 ]; then
        print_status "Template customization completed successfully!"

        # Determine output directory
        if [ ! -z "$CLINIC_NAME" ]; then
            PROJECT_DIR="$OUTPUT_PATH/$(echo "$CLINIC_NAME" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g')-co2-laser-site"
        else
            # Extract from URL
            local domain=$(echo "$WEBSITE_URL" | sed -e 's|^[^/]*//||' -e 's|/.*||' -e 's|www\.||')
            PROJECT_DIR="$OUTPUT_PATH/$(echo "$domain" | sed 's/[^a-z0-9]/-/g')-co2-laser-site"
        fi

        print_info "Project created at: $PROJECT_DIR"
    else
        print_error "Template customization failed with exit code $exit_code"
        echo "Please check the error messages above and try again."
        exit $exit_code
    fi

    echo
}

# Function to run quality assurance
run_quality_assurance() {
    echo "✅ Running quality assurance checks..."

    if [ ! -d "$PROJECT_DIR" ]; then
        print_error "Project directory not found: $PROJECT_DIR"
        exit 1
    fi

    node quality-assurance-system.js "$PROJECT_DIR"
    local exit_code=$?

    if [ $exit_code -eq 0 ]; then
        print_status "Quality assurance completed successfully!"
    else
        print_warning "Quality assurance found issues (exit code: $exit_code)"
        echo "Please review the QA report and fix any critical issues before deployment."

        # Ask if user wants to continue
        read -p "Do you want to continue with deployment anyway? (y/N): " continue_deploy
        if [[ ! "$continue_deploy" =~ ^[Yy]$ ]]; then
            print_info "Deployment cancelled. Fix QA issues and run deployment manually."
            exit 0
        fi
    fi

    echo
}

# Function to run deployment
run_deployment() {
    echo "🚀 Running deployment..."

    # Build deployment command
    local cmd="node deployment-automation.js \"$PROJECT_DIR\" --platform $PLATFORM --environment $ENVIRONMENT"

    if [ ! -z "$CUSTOM_DOMAIN" ]; then
        cmd="$cmd --domain \"$CUSTOM_DOMAIN\""
    fi

    print_info "Executing: $cmd"
    echo

    # Run deployment
    eval $cmd
    local exit_code=$?

    if [ $exit_code -eq 0 ]; then
        print_status "Deployment completed successfully!"

        echo
        echo "🎉 Congratulations! Your CO2 Laser template has been customized and deployed."
        echo
        print_info "Next steps:"
        echo "1. Review the deployment report in: $PROJECT_DIR/deployment-reports/"
        echo "2. Test the live website thoroughly"
        echo "3. Update booking configuration if needed"
        echo "4. Set up analytics and monitoring"

        if [ ! -z "$CUSTOM_DOMAIN" ]; then
            echo "5. Configure DNS records for your custom domain"
        fi

    else
        print_error "Deployment failed with exit code $exit_code"
        echo "Please check the error messages and deployment logs."

        print_info "You can retry deployment manually with:"
        echo "node deployment-automation.js \"$PROJECT_DIR\" --platform $PLATFORM"
        exit $exit_code
    fi

    echo
}

# Function to show summary
show_summary() {
    echo "📊 Process Summary"
    echo "=================="
    echo "Website URL: $WEBSITE_URL"
    echo "Clinic Name: ${CLINIC_NAME:-'(extracted from website)'}"
    echo "Project Directory: $PROJECT_DIR"
    echo "Platform: $PLATFORM"
    echo "Custom Domain: ${CUSTOM_DOMAIN:-'None'}"
    echo

    print_info "Generated Reports:"
    echo "• Customization Report: $PROJECT_DIR/customization-reports/CUSTOMIZATION-REPORT.md"
    echo "• Quality Assurance Report: $PROJECT_DIR/qa-reports/QA-REPORT.md"
    echo "• Deployment Report: $PROJECT_DIR/deployment-reports/DEPLOYMENT-REPORT.md"
    echo "• Manual Review Checklist: $PROJECT_DIR/customization-reports/MANUAL-REVIEW-CHECKLIST.md"
    echo
}

# Function to show help
show_help() {
    echo "CO2 Laser Template Customization Agent - Quick Start Script"
    echo
    echo "Usage:"
    echo "  ./quick-start.sh                 # Interactive mode"
    echo "  ./quick-start.sh --help          # Show this help"
    echo "  ./quick-start.sh --url <url>     # Non-interactive with URL"
    echo
    echo "Environment Variables:"
    echo "  FIRECRAWL_API_KEY               # Required for web scraping"
    echo
    echo "Examples:"
    echo "  ./quick-start.sh"
    echo "  ./quick-start.sh --url https://example-clinic.com"
    echo "  FIRECRAWL_API_KEY=your-key ./quick-start.sh --url https://clinic.com"
    echo
}

# Main execution
main() {
    # Check for help flag
    if [[ "$1" == "--help" || "$1" == "-h" ]]; then
        show_help
        exit 0
    fi

    # Check for URL parameter
    if [[ "$1" == "--url" && ! -z "$2" ]]; then
        WEBSITE_URL="$2"
        print_info "Using provided URL: $WEBSITE_URL"
        echo
    fi

    # Run the complete process
    check_prerequisites

    if [ -z "$WEBSITE_URL" ]; then
        get_user_input
    fi

    check_platform_cli
    run_customization
    run_quality_assurance
    run_deployment
    show_summary

    print_status "🎉 CO2 Laser Template Customization completed successfully!"
    echo
    echo "Thank you for using the CO2 Laser Template Customization Agent!"
}

# Check if script is being sourced or executed
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi