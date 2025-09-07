# Admin Navigation Implementation Plan

## Steps to fix "Add User" and "View Users" navigation:

1. [ ] Update AdminHome.tsx - Fix box tab navigation to use 'logins' tab
2. [ ] Update Logins.tsx - Add prop to accept initial active tab state
3. [ ] Update AdminDashboard.tsx - Pass initial tab state to Logins component
4. [ ] Test the navigation functionality

## Current Status:
- Components AddUser.tsx and ViewUsers.tsx are already implemented
- Logins.tsx handles internal tab switching between AddUser and ViewUsers
- AdminHome boxes need to navigate to correct tab with proper state
