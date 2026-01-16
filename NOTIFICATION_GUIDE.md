# Product Owner Notification System

## Overview
The notification system shows alerts to product owners when their products are approved by admins.

## How It Works

### 1. **Backend Flow (Already Implemented)**
   - When admin approves a product in `/backend/routes/productRoutes.js`
   - A notification is automatically created in the `NotificationTable`
   - Contains: user_id (owner's email), title, and message

### 2. **Frontend Flow (Just Implemented)**

#### A. Notification Bell in Navbar
   - **Location**: Top-right corner of the navigation bar (only for logged-in users, not admins)
   - **Component**: `NotificationDropdown.tsx`
   - **Features**:
     - Bell icon with red badge if there's a notification
     - Click to open dropdown
     - Shows notification title and message
     - Dismiss button (X) to clear notification

#### B. How Users See Notifications
   1. Product owner logs in
   2. Their email is stored in `localStorage`
   3. Navbar automatically fetches notifications for that email
   4. Red badge appears on bell icon if notification exists
   5. Clicking bell shows the notification details
   6. User can dismiss notification by clicking X

## Files Modified

1. **`/frontend/components/NotificationDropdown.tsx`** (NEW)
   - Fetches notifications from backend
   - Displays notification dropdown
   - Handles dismiss action

2. **`/frontend/components/Navbar.tsx`** (MODIFIED)
   - Added NotificationDropdown component
   - Shows bell icon between profile and logout buttons

3. **`/frontend/lib/api.ts`** (FIXED)
   - Fixed endpoint from `/notifications` to `/notification`

4. **`/frontend/app/admin/products/page.tsx`** (MODIFIED)
   - Fixed to fetch notification using product owner's email
   - Added error handling

## Testing the Flow

1. **As Admin:**
   - Go to `/admin/products`
   - Approve a pending product
   - Notification is created in backend

2. **As Product Owner:**
   - Log in with the email that owns the approved product
   - Look at top-right corner of navbar
   - See red badge on bell icon (shows "1")
   - Click bell to see notification
   - Click X to dismiss

## API Endpoint

```typescript
POST /notification
Body: { email: "user@example.com" }
Response: { 
  AllNotifs: {
    id: number,
    user_id: string,
    title: string,
    message: string
  }
}
```

## Future Enhancements (Optional)

1. **Multiple Notifications**
   - Backend returns array instead of single notification
   - Frontend displays all notifications in list
   - Add "Mark all as read" functionality

2. **Real-time Updates**
   - Use WebSocket or polling to auto-refresh notifications
   - Push notifications to users

3. **Notification History**
   - Separate notifications page
   - Archive old notifications
   - Filter by type/date

4. **Different Notification Types**
   - Product approved (✓)
   - Product rejected (✗)
   - Order received (🛒)
   - Payment confirmed (💰)

## Current Limitations

- Shows only ONE notification (latest for user)
- No persistence (dismissed = deleted from UI only)
- No read/unread status
- No notification history page
