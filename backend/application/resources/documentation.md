# API Resource Documentation

This document provides an overview of the API resources available in the application.

## Auth Endpoints
| Resource         | HTTP Method | Endpoint         | Description          |
|------------------|-------------|------------------|----------------------|
| `LoginResource`  | POST        | `/api/login`     | User login           |
| `SignupResource` | POST        | `/api/signup/`   | User registration    |
| `LogoutResource` | POST        | `/api/logout`    | User logout          |

## Product Endpoints
| Resource              | HTTP Method      | Endpoint                     | Description                           |
|-----------------------|------------------|------------------------------|---------------------------------------|
| `ProductListResource` | GET, POST        | `/products`                  | List or create products               |
| `ProductResource`     | GET, PUT, DELETE | `/products/<int:product_id>` | Retrieve, update, or delete a product |

## Cart Endpoints
| Resource            | HTTP Method      | Endpoint                                      | Description                        |
|---------------------|------------------|-----------------------------------------------|------------------------------------|
| `CartListResource`  | GET, POST        | `/cart`                                       | List or add items to the cart      |
| `CartItemResource`  | GET, PUT, DELETE | `/cart/item`, `/cart/item/<int:cart_item_id>` | Manage individual cart items       |

## User Endpoints
| Resource           | HTTP Method      | Endpoint                    | Description                        |
|--------------------|------------------|-----------------------------|------------------------------------|
| `UserListResource` | GET, POST        | `/users`                    | List or create users               |
| `UserResource`     | GET, PUT, DELETE | `/users/<int:user_id>`      | Retrieve, update, or delete a user |

## Category Endpoints
| Resource                | HTTP Method      | Endpoint                             | Description                            |
|-------------------------|------------------|--------------------------------------|----------------------------------------|
| `CategoryListResource`  | GET, POST        | `/categories`                        | List or create categories              |
| `CategoryResource`      | GET, PUT, DELETE | `/categories/<int:category_id>`      | Retrieve, update, or delete a category |
