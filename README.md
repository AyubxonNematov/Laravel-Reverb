# Laravel Reverb Chat app

This project consists of two main parts:
- Backend: Laravel application (current directory)
- Frontend: React application (located in `react-reverb` directory)

### Backend Setup
1. Install PHP dependencies:
```bash
composer install
```

2. Copy `.env.example` to `.env` and configure your database:
```bash
cp .env.example .env
```

3. Generate application key:
```bash
php artisan key:generate
```

4. Run migrations:
```bash
php artisan migrate
```

5. Start the server:
```bash
php artisan serve
```

6. Start reverb server:
```bash
php artisan reverb:start
```

7. Start queue server:
```bash
php artisan queue:work
```

### Frontend Setup
1. Navigate to the frontend directory:
```bash
cd react-reverb
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```