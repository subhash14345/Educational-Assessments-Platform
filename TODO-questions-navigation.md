# Questions Navigation Implementation Plan

## Steps to fix "Add Questions" and "View Questions" navigation:

1. [ ] Update AdminHome.tsx - Fix box tab navigation to use 'questions' tab with subTab
2. [ ] Update Questions.tsx - Add prop to accept initial active tab state
3. [ ] Update AdminDashboard.tsx - Pass initial tab state to Questions component
4. [ ] Test the navigation functionality

## Current Structure:
- Questions.tsx handles internal tab switching between AddQuestions and ViewQuestions
- Uses 'view' and 'add' tabs similar to Logins component
- Needs the same navigation pattern as implemented for Logins

## Implementation Approach:
- Follow the same pattern as Logins navigation fix
- Use sessionStorage to pass subTab state between components
- Add props interface to Questions component
- Update AdminDashboard to handle Questions initial tab state
