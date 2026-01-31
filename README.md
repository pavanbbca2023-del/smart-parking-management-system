# 🚗 Smart Parking Management System

A comprehensive Django-based parking management system with payment integration, QR code scanning, and real-time slot management.

## ✨ Features

- **🅿️ Parking Management**: Multi-zone parking with slot allocation
- **💳 Payment Integration**: Razorpay payment gateway (TEST mode)
- **📱 QR Code System**: Entry/exit QR code scanning
- **⏰ Real-time Billing**: Hourly rate calculation with grace periods
- **🔐 Admin Interface**: Complete Django admin for management
- **📊 Session Tracking**: Full parking session lifecycle
- **🛡️ Security**: CSRF protection, atomic transactions, data validation

## 🏗️ Architecture

```
smart-parking-management-system/
├── backend_core/           # Core parking functionality
│   └── parking/           # Main parking app
│       ├── models.py      # Database models
│       ├── views.py       # API endpoints
│       ├── services/      # Business logic
│       └── admin.py       # Admin interface
├── backend_analytics/     # Analytics module
├── smart_parking/         # Django project settings
└── Documentation/         # Project documentation
```

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/smart-parking-management-system.git
cd smart-parking-management-system
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Setup Database
```bash
python manage.py migrate
python manage.py createsuperuser
```

### 4. Run Server
```bash
python manage.py runserver
```

### 5. Access Admin
- URL: `http://localhost:8000/admin/`
- Create superuser account during setup

## 📋 Models

### Core Models
- **ParkingZone**: Parking areas with hourly rates
- **ParkingSlot**: Individual parking spaces
- **Vehicle**: Vehicle registration and owner info
- **ParkingSession**: Complete parking lifecycle tracking

### Payment Models
- **PaymentOrder**: Razorpay payment order tracking
- **Payment Integration**: TEST mode Razorpay gateway

## 🔧 API Endpoints

### Parking APIs
```
POST /api/parking/book/          # Book parking slot
POST /api/parking/entry/         # Vehicle entry scan
POST /api/parking/exit/          # Vehicle exit scan
GET  /api/parking/status/        # Check parking status
```

### Payment APIs
```
POST /api/payment/create-order/  # Create payment order
POST /api/payment/verify/        # Verify payment
POST /api/payment/webhook/       # Payment webhook
```

## 💳 Payment Integration

- **Gateway**: Razorpay (TEST mode)
- **Features**: Order creation, signature verification, webhooks
- **Security**: Signature validation, CSRF protection
- **Status Tracking**: Real-time payment status updates

## 🛠️ Development

### Project Structure
- **Models**: Clean database design with proper relationships
- **Services**: Business logic separated from views
- **Views**: Lightweight API endpoints
- **Admin**: Complete management interface

### Key Features
- **Atomic Transactions**: Data consistency guaranteed
- **Error Handling**: Comprehensive error management
- **Validation**: Input validation and constraints
- **Logging**: Audit trail for all operations

## 📚 Documentation

Detailed documentation available in `/Documentation/` folder:
- Setup guides
- API documentation
- Testing guides
- Security implementation

## 🧪 Testing

### Test Data
```bash
python manage.py shell
# Run test data creation scripts
```

### Manual Testing
1. Create parking zones via admin
2. Add vehicles and slots
3. Test booking flow
4. Test payment integration
5. Verify QR code scanning

## 🔒 Security Features

- **CSRF Protection**: All forms protected
- **Input Validation**: Comprehensive data validation
- **Atomic Operations**: Database consistency
- **Audit Logging**: Complete operation tracking
- **Payment Security**: Razorpay signature verification

## 🚀 Deployment

### Production Checklist
- [ ] Update `DEBUG = False`
- [ ] Configure production database
- [ ] Set up environment variables
- [ ] Configure static files
- [ ] Set up SSL certificates
- [ ] Configure payment gateway (LIVE mode)

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📞 Support

For support and questions:
- Create GitHub issues
- Check documentation
- Review code comments

---

**Built with Django 4.2+ | Python 3.8+ | SQLite/PostgreSQL**