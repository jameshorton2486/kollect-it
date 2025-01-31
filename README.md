# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/9a8a7eaa-141e-495b-9f9b-9f6d66669802

## About Kollect-It

Kollect-It is a modern e-commerce marketplace for fine art and collectibles. Our platform connects collectors with unique items while ensuring a secure and enjoyable shopping experience.

## Key Features

- User Authentication & Authorization
- Product Listings with Advanced Filters
- Secure Shopping Cart & Checkout
- Seller Dashboard
- Real-time Updates
- Responsive Design

## Tech Stack

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase (Backend & Authentication)

## Getting Started

### Prerequisites

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installation

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd <YOUR_PROJECT_NAME>

# Step 3: Install dependencies
npm i

# Step 4: Start the development server
npm run dev
```

### Environment Setup

The project uses Supabase for backend services. Required environment variables are managed through the Lovable platform.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Development Guidelines

### Code Style

- We use ESLint and TypeScript for code quality
- Follow the existing component structure
- Use Tailwind CSS for styling
- Implement responsive design
- Write meaningful commit messages

### Component Structure

```
src/
├── components/     # Reusable UI components
├── contexts/       # React contexts
├── hooks/         # Custom hooks
├── lib/           # Utility functions
├── pages/         # Page components
└── styles/        # Global styles
```

### Security Best Practices

- Never commit sensitive information
- Validate user input
- Use proper authentication checks
- Implement proper error handling

## Deployment

### Using Lovable

Simply open [Lovable](https://lovable.dev/projects/9a8a7eaa-141e-495b-9f9b-9f6d66669802) and click on Share -> Publish.

### Custom Domain Setup

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)

## Contributing

1. Create a new branch
2. Make your changes
3. Submit a pull request
4. Ensure all checks pass

## Testing

We use React Testing Library for unit tests. Run tests with:

```sh
npm test
```

## Support

For support, please visit our [documentation](https://docs.lovable.dev/) or contact our support team.

## License

This project is private and confidential.