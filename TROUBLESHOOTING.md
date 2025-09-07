# 404 Error Fix Guide - Admin Question Edit

## Issue Description
When editing questions in the admin view, clicking "Save Changes" results in:
```
Server error: 404 - HTML response received instead of JSON
```

## Quick Fix Steps

### 1. Check Server Status
```bash
# Terminal 1 - Start the server
cd project/server
npm start

# Terminal 2 - Start the frontend
cd project
npm run dev
```

### 2. Verify Environment Configuration
Create or update `.env` file in the project root:
```
VITE_API_URL=http://localhost:5000/api
```

### 3. Test API Endpoints
Test the API directly in browser console:
```javascript
// Check if API is accessible
fetch('http://localhost:5000/api/admin/questions', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
}).then(r => r.json()).then(console.log).catch(console.error);
```

### 4. Common Issues & Solutions

#### Issue 1: Wrong API URL
**Symptoms:** 404 error, requests going to wrong port
**Solution:** Check VITE_API_URL in .env file

#### Issue 2: Missing Authentication
**Symptoms:** 401 or 403 errors
**Solution:** Ensure you're logged in as admin user

#### Issue 3: Server Not Running
**Symptoms:** Network errors, connection refused
**Solution:** Start the server with `npm start` in server directory

#### Issue 4: CORS Issues
**Symptoms:** CORS errors in browser console
**Solution:** Server already has CORS enabled, check if running on correct port

### 5. Debug Steps

1. **Check Browser Console**
   - Open DevTools (F12)
   - Look for network errors
   - Check the exact URL being called

2. **Check Network Tab**
   - Look for the PUT request to `/api/admin/questions/:id`
   - Check response status and body

3. **Verify Question ID**
   - Ensure the question ID exists in database
   - Check MongoDB for the question

### 6. Manual Testing

Test the API endpoint directly:
```bash
# Get all questions (requires auth)
curl -X GET http://localhost:5000/api/admin/questions \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Update a specific question
curl -X PUT http://localhost:5000/api/admin/questions/QUESTION_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"question":"Test","options":["A","B","C","D"],"correctAnswer":"A","category":"test","subcategory":"test"}'
```

### 7. Environment Checklist

- [ ] Server is running on port 5000
- [ ] Frontend is running (usually port 5173 for Vite)
- [ ] .env file exists with correct VITE_API_URL
- [ ] User is logged in as admin
- [ ] MongoDB is running
- [ ] Question ID exists in database

### 8. Error Messages Guide

| Error Message | Cause | Solution |
|---------------|--------|----------|
| "404 - HTML response" | Wrong URL or server not running | Check server status and URL |
| "401 Unauthorized" | Missing/invalid token | Login as admin |
| "403 Forbidden" | Not admin user | Use admin account |
| "Network error" | Server not running | Start server |

### 9. Quick Verification

Add the HealthCheck component to your admin dashboard to verify API connectivity:

```jsx
import HealthCheck from './components/Admin/HealthCheck';

// In your admin component
<HealthCheck />
```

### 10. Final Steps

1. Start both servers
2. Login as admin
3. Navigate to View Questions
4. Try editing a question
5. Check browser console for detailed error messages

The fixes implemented include enhanced error logging and better error handling to help identify the exact cause of the 404 error.
