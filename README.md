# CSCI3308-Group-13-02


1. EasyVote is a webpage that takes in your address and provides nearby polling stations for upcoming elections.
Along with the polling stations address we provide hours of operation for the polling stations and rank them from 
distance from you.

2. Matthew Etter, Tome Dudanov, Josh Lee, Zahir Nieblas Bedolla, Jason Swartz.

3. We are using HTML, SQL, JS, and the main technology to make our website run is google API.

4. No prerequisite.

5. You will be brought to a sign in page where you put in your username and password or if you are a new user you will go to a registration page where you will create a username and passwords as well as put in a address you want to use to find nearby polls. You will then be brought to our main page which will provide polls closest to you so you can go and vote. There is also an info tab that states our mission as well as what our website entails. The website will also let you update your address so you can get new up to date polling stations from wherever you are in the US.

6. Testing:

Sign-In page:
    Using Integration Testing and User Testing
    
    Test Cases:
        If a user inputs an existing username and password.
        If a user inputs an existing username but incorrect password.
        If a user inputs a username that does not exist regardless of password.
    Test DATA: 
        Usernames, passwords from SQL Database.
        Username and password entered in from user.
    Test Environment:
        Docker/PostgreSQL for database.
        Localhost.
    Test Results:
        User Will be either logged in and sent to the polls page or not logged in with "Incorrect username or password" message appearing.
    User Acceptance Testers:
        Other students in CSCI3308.

Registration:
    User Testing
    Test Cases: 
        If a user enters all valid credentials.
        If username is taken.
        Password must fit criteria provided.
        Check if address is valid or not.
    
    Integration Testing:
        Password, username, & address is filled out.
        Username & Password set criteria of minimum 8 characters.
        Username not in use, then successful registration.
        Username in use, then message of "username already exists".
    Testing Data:
        Username,Password & address entered by user.
    Test Enviornment:
        Docker/PostgreSQL for database.
        Localhost.
    Test Results:
        Successful registration.
        User is not able to register.
    User Acceptance Testers:
        Other students in CSCI3308.

Showing Nearby Polls:
    Testing for successful API calls dependent on user address input.
    
    Testing Environment:
        Mocha/Chai
        Docker
        PostgreSQL
        Localhost
    Test Data:
        User address, API call
    Test Results:
        200 return api call successful.
    User Acceptance Testers:
        Other students in CSCI3308. 
        
        Scope, approach, resources, and schedule of intended test activities.
    
7. Not applicable yet.
