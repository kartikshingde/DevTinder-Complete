# DevTinder Frontend

- Create a Vite+React Application
- Remove unnecessary code and create a app
- Install Tailwind CSS
- Install daisyui
- Add Navbar component to App.jsx
- Create a Navbar.jsx seperate component file
- Install react-router
- Create BrowserRouter > creare a route / and its children routes
- Create an Outlet in body component
- Create a footer

- create a login page
- Install axios
- CORS - install cors in backend =>add middleware to with configuration as credentials:true
- Whenever you are making api call in frontend pass axios=> {withCredentials:true}

- redux toolkit -> https://redux-toolkit.js.org/tutorials/quick-start
- Create react-redux + @redux.js/toolkit
- ConfigureStore => Provider => createSlice => add reducer to Store
- Add redux devtools in chrome
- Login and see if your data is coming properly in the store
- Navbar should update as soon as user logs in
- Refactor our code to add constant file i.e. add BASE_URL of backend

- You should not be able to access other route without login
- If token is not present , redirect user to login page
- Logout Feature
- Get the feed and add the feed in the store
- Build the user card on feed
- Built profile edit page
- Added s3 for storing profile image
- Cloudfront integrated.
- Page to See all my connnections
- Page to See all my Connection Requests
- Feature - Accept/Reject Connection Request
- Send/Ignore user card from feed
- Signup New User Page
- E2E testing


Body
Navbar
Route= / =>Feed
Route= /login =>Login
Route= /connections =>Connections
Route= /profile =>Profile

# Razorpay Payment gateway Integration
- Signed up and completed kyc and all
- Created UI for Premium page
- Creating an API for create order in backend
- Added key and secret in .env
- Initialized Razorpay in utils
- Creating order on razorpay
- Created Schema and model
- Saved the order in payment colllection
- made dynamic membership
- add the script of the razorpay to the index.html <head>
- use that rzp.open() in ui code