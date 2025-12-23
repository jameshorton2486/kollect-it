# Account Page Testing Guide - Next Steps

## ✅ What's Been Completed

All the code changes are done! The Edit Profile and Change Password buttons are now fully functional with:
- ✅ Modal dialogs for both features
- ✅ Form validation
- ✅ API routes connected
- ✅ Database integration ready

---

## 📋 Step-by-Step Testing Instructions

### Step 1: Start Your Development Server

1. **Open a terminal/command prompt** in your project folder:
   ```
   C:\Users\james\kollect-it-marketplace-1
   ```

2. **Start the development server**:
   ```powershell
   npm run dev
   # OR
   bun run dev
   ```

3. **Wait for it to start** - You should see something like:
   ```
   ✓ Ready in 2.5s
   ○ Local: http://localhost:3000
   ```

---

### Step 2: Log In to Your Account

1. **Open your browser** and go to:
   ```
   http://localhost:3000
   ```

2. **Log in to your account**:
   - Click "Sign In" or go to `/login`
   - Enter your email and password
   - If you don't have an account yet, you can use the test credentials from `USER_CREDENTIALS_REFERENCE.md`

3. **Verify you're logged in** - You should see your name in the header

---

### Step 3: Navigate to the Account Page

1. **Click on your profile/account icon** in the header, OR
2. **Go directly to**: `http://localhost:3000/account`

3. **You should see the Profile tab** with your information displayed

---

### Step 4: Test the "Edit Profile" Button

1. **Click the "Edit Profile" button** (gold button on the Profile tab)

2. **The modal should open** showing:
   - Your current name
   - Empty fields for: Phone, Address, City, State, Zip Code

3. **Fill in some information**:
   - Enter a phone number (e.g., "555-123-4567")
   - Enter an address (e.g., "123 Main St")
   - Enter a city (e.g., "New York")
   - Enter a state (e.g., "NY")
   - Enter a zip code (e.g., "10001")

4. **Click "Save Changes"**

5. **You should see**:
   - A green success message: "Profile updated successfully!"
   - The page will reload after 1.5 seconds
   - Your new information should now appear in the profile display

6. **Verify the update**:
   - Check that your new phone number, address, etc. are now showing in the Profile tab

---

### Step 5: Test the "Change Password" Button

1. **Click the "Change Password" button** (outlined button next to Edit Profile)

2. **The modal should open** with three password fields:
   - Current Password
   - New Password
   - Confirm New Password

3. **Test the password visibility toggle**:
   - Click the eye icon next to "Current Password" - it should show/hide the password
   - Same for "New Password"

4. **Try to change your password**:
   - Enter your current password
   - Enter a new password (must be at least 8 characters)
   - Enter the same new password in "Confirm New Password"

5. **Click "Change Password"**

6. **You should see**:
   - A green success message: "Password changed successfully!"
   - The modal will close after 1.5 seconds

7. **Test the new password**:
   - Sign out
   - Try to sign in with your new password
   - It should work!

---

### Step 6: Test Error Handling

#### Test Profile Validation:
1. Open Edit Profile
2. Leave all fields empty and click "Save Changes"
3. It should still save (fields are optional)

#### Test Password Validation:
1. Open Change Password
2. Try to submit with:
   - **Short password** (less than 8 characters) - Should show error
   - **Mismatched passwords** - Should show "Passwords do not match" error
   - **Wrong current password** - Should show "Current password is incorrect" error

---

## 🐛 Troubleshooting

### Issue: Buttons don't do anything

**Check:**
- Open your browser's Developer Tools (F12)
- Look at the Console tab for any error messages
- Common issues:
  - JavaScript errors blocking the code
  - Network errors (check Network tab)

**Fix:**
- Make sure your development server is running
- Refresh the page (Ctrl+R or Cmd+R)
- Clear browser cache if needed

---

### Issue: "Unauthorized" error when saving

**Check:**
- Make sure you're logged in
- Check that your session hasn't expired
- Look at the browser console for the exact error

**Fix:**
- Sign out and sign back in
- Check that `NEXTAUTH_SECRET` is set in your `.env.local` file

---

### Issue: "Failed to update profile" or "Failed to change password"

**Check:**
- Open the browser's Developer Tools (F12)
- Go to the Network tab
- Click the button that's failing
- Look for the API request (should be `/api/account/profile` or `/api/account/password`)
- Click on it and check the Response tab

**Common causes:**
1. **Database connection issue**:
   - Verify `DATABASE_URL` is set in `.env.local`
   - Check that your database is running and accessible

2. **Prisma client not generated**:
   ```powershell
   npx prisma generate
   ```

3. **Database schema not migrated**:
   ```powershell
   npx prisma db push
   ```

---

### Issue: Modal doesn't open

**Check:**
- Look at the browser console (F12) for errors
- Make sure all the JavaScript loaded correctly

**Fix:**
- Refresh the page
- Clear browser cache
- Check that all imports are working (no import errors in console)

---

## ✅ Success Checklist

After testing, you should be able to:

- [ ] Click "Edit Profile" and see the modal open
- [ ] Fill in profile information and save it successfully
- [ ] See the updated information displayed after saving
- [ ] Click "Change Password" and see the modal open
- [ ] Toggle password visibility with the eye icons
- [ ] Change your password successfully
- [ ] Sign in with your new password
- [ ] See error messages when validation fails

---

## 📝 Next Steps After Testing

Once everything works:

1. **Commit your changes** (optional but recommended):
   ```powershell
   git add .
   git commit -m "Add Edit Profile and Change Password functionality to account page"
   git push
   ```

2. **Document any issues** you found during testing

3. **Test in different browsers** if needed (Chrome, Firefox, Safari, Edge)

---

## 🎉 You're Done!

If all the tests pass, your account page is fully functional! Users can now:
- ✅ Update their profile information
- ✅ Change their passwords
- ✅ See clear success/error messages

---

## 📞 Need Help?

If you encounter any issues:
1. Check the browser console for error messages
2. Check the terminal where your dev server is running for server errors
3. Verify your database connection is working
4. Make sure all environment variables are set correctly
