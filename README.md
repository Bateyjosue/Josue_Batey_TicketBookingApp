# Ticket Booking App

A modern full-stack ticket booking application for events, featuring:

- **Admin dashboard** for event management, analytics, and bookings
- **Customer dashboard** for viewing and managing bookings
- **Role-based authentication** (admin/customer)
- **Event creation, editing, and deletion** (admin)
- **Booking and cancellation** (customer)
- **Responsive, accessible UI** with skeleton loaders and empty states
- **Email notifications** for bookings and cancellations (via Resend) Not done yet

---

## Getting Started (Local Development)

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd TicketBookingApp
```

### 2. Install dependencies (using pnpm)
```bash
pnpm install
```

### 3. Set up environment variables
Create a `.env` file in `apps/api/` with the following (sample values):
```env
# apps/api/.env
PORT=4000
MONGO_URI=mongodb://localhost:27017/ticketapp
JWT_SECRET=your_jwt_secret
EMAIL_KEY=your_resend_api_key
```

### 4. Start the development servers
- **API/backend:**
  ```bash
  cd apps/api
  pnpm dev
  ```
- **Web/frontend:**
  ```bash
  cd apps/web
  pnpm dev
  ```

### 5. Access the app
- Frontend: [Live Demo](https://josue-batey-ticket-booking-app-web.vercel.app/login)
- Backend API: [Link](https://josue-batey-ticketbookingapp.onrender.com)

---

## Features
- Admin and customer dashboards
- Event CRUD (admin)
- Bookings and cancellations (customer)
- Email notifications (Resend)
- Analytics and charts (admin)
- Responsive design
- Role-based route protection

---

## Sample .env (do not commit secrets)
```env
# apps/api/.env
PORT=4000
MONGO_URI=mongodb://localhost:27017/ticketapp
JWT_SECRET=your_jwt_secret
```

---

## License
MIT
