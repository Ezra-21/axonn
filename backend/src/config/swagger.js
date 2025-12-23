/**
 * Swagger/OpenAPI Configuration
 */

import swaggerJsdoc from 'swagger-jsdoc';
import env from './env.js';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Axon Store API',
      version: '1.0.0',
      description:
        'Complete REST API for Axon e-commerce platform with admin and user functionality',
      contact: {
        name: 'API Support',
        email: 'support@axon.com',
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC',
      },
    },
    servers: [
      {
        url: `http://localhost:${env.PORT || 3000}/api`,
        description: 'Development server',
      },
      {
        url: `${env.API_BASE_URL || 'https://api.axon.com'}/api`,
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token in the format: Bearer <token>',
        },
      },
      schemas: {
        // Error Response
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Error message',
            },
            error: {
              type: 'object',
              properties: {
                statusCode: {
                  type: 'integer',
                  example: 400,
                },
                details: {
                  type: 'object',
                },
              },
            },
          },
        },

        // Success Response
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              example: 'Operation successful',
            },
            data: {
              type: 'object',
            },
          },
        },

        // User
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'cm1abc123xyz',
            },
            firstName: {
              type: 'string',
              example: 'John',
            },
            lastName: {
              type: 'string',
              example: 'Doe',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'john@example.com',
            },
            phone: {
              type: 'string',
              example: '+1234567890',
              nullable: true,
            },
            avatar: {
              type: 'string',
              nullable: true,
              example: 'https://res.cloudinary.com/...',
            },
            role: {
              type: 'string',
              enum: ['USER', 'ADMIN', 'SUPER_ADMIN'],
              example: 'USER',
            },
            isActive: {
              type: 'boolean',
              example: true,
            },
            emailVerified: {
              type: 'boolean',
              example: false,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },

        // Register Request
        RegisterRequest: {
          type: 'object',
          required: ['firstName', 'lastName', 'email', 'password', 'confirmPassword'],
          properties: {
            firstName: {
              type: 'string',
              minLength: 2,
              maxLength: 50,
              example: 'John',
              description: 'User first name',
            },
            lastName: {
              type: 'string',
              minLength: 2,
              maxLength: 50,
              example: 'Doe',
              description: 'User last name',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'john@example.com',
              description: 'User email address',
            },
            password: {
              type: 'string',
              minLength: 8,
              pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)',
              example: 'SecurePass123',
              description: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
            },
            confirmPassword: {
              type: 'string',
              minLength: 8,
              example: 'SecurePass123',
              description: 'Must match the password field',
            },
            phone: {
              type: 'string',
              pattern: '^\\+?[1-9]\\d{1,14}$',
              example: '+1234567890',
              description: 'Optional phone number',
            },
          },
        },

        // Login Request
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'john@example.com',
            },
            password: {
              type: 'string',
              example: 'SecurePass123!',
            },
          },
        },

        // Auth Response
        AuthResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              example: 'Registration successful',
            },
            data: {
              type: 'object',
              properties: {
                user: {
                  $ref: '#/components/schemas/User',
                },
                accessToken: {
                  type: 'string',
                  example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                  description: 'JWT access token for authentication',
                },
                refreshToken: {
                  type: 'string',
                  example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                  description: 'JWT refresh token for getting new access tokens',
                },
              },
            },
          },
        },

        // Product
        Product: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'cm1abc123xyz',
            },
            name: {
              type: 'string',
              example: 'Modern Leather Sofa',
            },
            slug: {
              type: 'string',
              example: 'modern-leather-sofa',
            },
            description: {
              type: 'string',
              example: 'Comfortable 3-seater leather sofa with premium quality leather',
            },
            shortDescription: {
              type: 'string',
              nullable: true,
              example: 'Comfortable 3-seater leather sofa',
            },
            price: {
              type: 'number',
              format: 'float',
              example: 1299.99,
            },
            comparePrice: {
              type: 'number',
              format: 'float',
              nullable: true,
              example: 1599.99,
            },
            costPrice: {
              type: 'number',
              format: 'float',
              nullable: true,
              example: 800.0,
            },
            stock: {
              type: 'integer',
              example: 10,
            },
            lowStockThreshold: {
              type: 'integer',
              example: 5,
            },
            sku: {
              type: 'string',
              nullable: true,
              example: 'SOF-001',
            },
            barcode: {
              type: 'string',
              nullable: true,
            },
            weight: {
              type: 'number',
              format: 'float',
              nullable: true,
              example: 45.5,
            },
            dimensions: {
              type: 'string',
              nullable: true,
              example: '200 x 90 x 85',
            },
            material: {
              type: 'string',
              nullable: true,
              example: 'Leather',
            },
            color: {
              type: 'string',
              nullable: true,
              example: 'Brown',
            },
            isActive: {
              type: 'boolean',
              example: true,
            },
            isFeatured: {
              type: 'boolean',
              example: false,
            },
            isNewArrival: {
              type: 'boolean',
              example: false,
            },
            categoryId: {
              type: 'string',
              example: 'cm1cat123xyz',
            },
            images: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                  },
                  url: {
                    type: 'string',
                  },
                  altText: {
                    type: 'string',
                  },
                  isPrimary: {
                    type: 'boolean',
                  },
                },
              },
            },
            category: {
              $ref: '#/components/schemas/Category',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },

        // Category
        Category: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'cm1cat123xyz',
            },
            name: {
              type: 'string',
              example: 'Living Room',
            },
            slug: {
              type: 'string',
              example: 'living-room',
            },
            description: {
              type: 'string',
              example: 'Furniture for your living room',
            },
            image: {
              type: 'string',
              nullable: true,
            },
            isActive: {
              type: 'boolean',
              example: true,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },

        // Cart
        Cart: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
            },
            userId: {
              type: 'string',
            },
            items: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/CartItem',
              },
            },
            totalItems: {
              type: 'integer',
              example: 3,
            },
            subtotal: {
              type: 'number',
              format: 'float',
              example: 2499.97,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },

        // Cart Item
        CartItem: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
            },
            productId: {
              type: 'string',
            },
            quantity: {
              type: 'integer',
              example: 2,
            },
            price: {
              type: 'number',
              format: 'float',
              example: 1299.99,
            },
            product: {
              $ref: '#/components/schemas/Product',
            },
          },
        },

        // Order
        Order: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
            },
            orderNumber: {
              type: 'string',
              example: 'ORD-20260109-ABC123',
            },
            userId: {
              type: 'string',
            },
            status: {
              type: 'string',
              enum: ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
              example: 'PENDING',
            },
            paymentStatus: {
              type: 'string',
              enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'],
              example: 'PENDING',
            },
            paymentMethod: {
              type: 'string',
              example: 'CREDIT_CARD',
            },
            subtotal: {
              type: 'number',
              format: 'float',
              example: 2499.97,
            },
            shippingCost: {
              type: 'number',
              format: 'float',
              example: 50.0,
            },
            tax: {
              type: 'number',
              format: 'float',
              example: 127.5,
            },
            total: {
              type: 'number',
              format: 'float',
              example: 2677.47,
            },
            shippingAddress: {
              type: 'object',
            },
            items: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/OrderItem',
              },
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },

        // Order Item
        OrderItem: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
            },
            productId: {
              type: 'string',
            },
            quantity: {
              type: 'integer',
              example: 2,
            },
            price: {
              type: 'number',
              format: 'float',
              example: 1299.99,
            },
            product: {
              $ref: '#/components/schemas/Product',
            },
          },
        },

        // Address
        Address: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
            },
            userId: {
              type: 'string',
            },
            street: {
              type: 'string',
              example: '123 Main St, Apt 4B',
              description: 'Full street address',
            },
            city: {
              type: 'string',
              example: 'Addis Ababa',
            },
            state: {
              type: 'string',
              example: 'Addis Ababa',
            },
            country: {
              type: 'string',
              example: 'Ethiopia',
            },
            postalCode: {
              type: 'string',
              example: '1000',
            },
            isDefault: {
              type: 'boolean',
              example: true,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },

        // Pagination
        PaginationMeta: {
          type: 'object',
          properties: {
            page: {
              type: 'integer',
              example: 1,
            },
            limit: {
              type: 'integer',
              example: 10,
            },
            total: {
              type: 'integer',
              example: 50,
            },
            totalPages: {
              type: 'integer',
              example: 5,
            },
            hasMore: {
              type: 'boolean',
              example: true,
            },
          },
        },

        // Dashboard Stats
        DashboardStats: {
          type: 'object',
          properties: {
            totalRevenue: {
              type: 'number',
              format: 'float',
              example: 125000.0,
            },
            totalOrders: {
              type: 'integer',
              example: 234,
            },
            totalProducts: {
              type: 'integer',
              example: 156,
            },
            totalUsers: {
              type: 'integer',
              example: 1250,
            },
            recentOrders: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Order',
              },
            },
            topProducts: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  product: {
                    $ref: '#/components/schemas/Product',
                  },
                  totalSold: {
                    type: 'integer',
                  },
                  revenue: {
                    type: 'number',
                    format: 'float',
                  },
                },
              },
            },
          },
        },

        // Payment
        Payment: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'cm1pay123xyz',
            },
            orderId: {
              type: 'string',
              example: 'cm1ord123xyz',
            },
            userId: {
              type: 'string',
              example: 'cm1usr123xyz',
            },
            amount: {
              type: 'number',
              format: 'float',
              example: 2499.97,
            },
            currency: {
              type: 'string',
              example: 'usd',
            },
            paymentMethod: {
              type: 'string',
              enum: ['STRIPE', 'CASH_ON_DELIVERY', 'BANK_TRANSFER', 'MOBILE_PAYMENT'],
              example: 'STRIPE',
            },
            status: {
              type: 'string',
              enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'],
              example: 'PAID',
            },
            stripePaymentIntentId: {
              type: 'string',
              nullable: true,
              example: 'pi_1234567890',
            },
            transactionId: {
              type: 'string',
              nullable: true,
              example: 'txn_1234567890',
            },
            paidAt: {
              type: 'string',
              format: 'date-time',
              nullable: true,
            },
            refundedAt: {
              type: 'string',
              format: 'date-time',
              nullable: true,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
      },

      responses: {
        UnauthorizedError: {
          description: 'Access token is missing or invalid',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                success: false,
                message: 'Unauthorized - No token provided',
                error: {
                  statusCode: 401,
                },
              },
            },
          },
        },
        ForbiddenError: {
          description: 'User does not have permission to access this resource',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                success: false,
                message: 'Forbidden - Insufficient permissions',
                error: {
                  statusCode: 403,
                },
              },
            },
          },
        },
        NotFoundError: {
          description: 'The specified resource was not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                success: false,
                message: 'Resource not found',
                error: {
                  statusCode: 404,
                },
              },
            },
          },
        },
        ValidationError: {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                success: false,
                message: 'Validation failed',
                error: {
                  statusCode: 400,
                  details: {
                    field: 'email',
                    message: 'Invalid email format',
                  },
                },
              },
            },
          },
        },
        ServerError: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                success: false,
                message: 'Internal server error',
                error: {
                  statusCode: 500,
                },
              },
            },
          },
        },
      },

      parameters: {
        PageQuery: {
          name: 'page',
          in: 'query',
          description: 'Page number for pagination',
          schema: {
            type: 'integer',
            minimum: 1,
            default: 1,
          },
        },
        LimitQuery: {
          name: 'limit',
          in: 'query',
          description: 'Number of items per page',
          schema: {
            type: 'integer',
            minimum: 1,
            maximum: 100,
            default: 10,
          },
        },
        SortQuery: {
          name: 'sort',
          in: 'query',
          description: 'Sort field and order (e.g., -createdAt for descending)',
          schema: {
            type: 'string',
            example: '-createdAt',
          },
        },
        SearchQuery: {
          name: 'search',
          in: 'query',
          description: 'Search term',
          schema: {
            type: 'string',
          },
        },
        IdParam: {
          name: 'id',
          in: 'path',
          required: true,
          description: 'Resource ID',
          schema: {
            type: 'string',
          },
        },
      },
    },
    tags: [
      {
        name: 'Auth',
        description: 'User authentication endpoints',
      },
      {
        name: 'Users',
        description: 'User profile and management endpoints',
      },
      {
        name: 'Products',
        description: 'Product catalog endpoints',
      },
      {
        name: 'Cart',
        description: 'Shopping cart endpoints',
      },
      {
        name: 'Orders',
        description: 'Order management endpoints',
      },
      {
        name: 'Payments',
        description: 'Payment processing endpoints with Stripe integration',
      },
      {
        name: 'Admin - Auth',
        description: 'Admin authentication endpoints',
      },
      {
        name: 'Admin - Dashboard',
        description: 'Admin dashboard and analytics endpoints',
      },
      {
        name: 'Admin - Products',
        description: 'Admin product management endpoints',
      },
      {
        name: 'Admin - Orders',
        description: 'Admin order management endpoints',
      },
      {
        name: 'Admin - Users',
        description: 'Admin user management endpoints',
      },
      {
        name: 'Admin - Payments',
        description: 'Admin payment management and refund endpoints',
      },
    ],
  },
  apis: [
    './src/routes/user/*.js',
    './src/routes/admin/*.js',
    './src/controllers/user/*.js',
    './src/controllers/admin/*.js',
  ],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;

// swagger docs served at /api/docs in non-production

// tags: Users, Products, Categories, Orders, Payments

// swagger UI disabled in test environment

// swagger security: BearerAuth scheme applied to all routes

// API versioning: current version v1, plan v2 for breaking changes